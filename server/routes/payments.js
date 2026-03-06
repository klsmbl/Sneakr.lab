/**
 * Sneakr.lab - Payment and Subscription routes (PayPal Sandbox REST API)
 */

import { randomUUID } from 'crypto';
import db from '../db.js';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'AeZJa8rZozqJ3gQRaKSc8R7Z1ZLK3xyYRNVCE-qb5vJ0uq1zVEGH7z86qVLaRnhS8pS8u6zXjfG1OvWa';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || 'ED3mD3gEYAKNEYSqr19VQUxVe8fCXvzLQ9VfVBW1uqKtDaVpCEjQTFzKiKJyBGYyHQE9BXXEr0qA-vKHF';
const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com';

// Get PayPal access token
async function getPayPalAccessToken() {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (err) {
    console.error('PayPal auth error:', err);
    throw err;
  }
}

// Get current subscription status
export async function getSubscription(req, res) {
  try {
    const stmt = db.prepare('SELECT subscription, subscription_date FROM users WHERE id = ?');
    const user = stmt.get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      tier: user.subscription,
      subscription_date: user.subscription_date,
      can_upgrade: user.subscription === 'free'
    });
  } catch (err) {
    console.error('Get subscription error:', err);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
}

// Create PayPal order for subscription
export async function createSubscriptionOrder(req, res) {
  try {
    const { plan } = req.body;
    if (plan !== 'monthly' && plan !== 'yearly') {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const amount = plan === 'monthly' ? '9.99' : '99.99';
    const description = plan === 'monthly' ? 'Sneakr.lab Premium - 1 Month' : 'Sneakr.lab Premium - 1 Year';

    const accessToken = await getPayPalAccessToken();

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount
          },
          description: description
        }
      ],
      application_context: {
        brand_name: 'Sneakr.lab',
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription/success`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription/cancel`
      }
    };

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(orderPayload)
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('PayPal order creation error:', err);
      return res.status(400).json({ error: 'Failed to create PayPal order' });
    }

    const orderData = await response.json();
    const orderId = orderData.id;

    // Store order in database
    const paymentId = randomUUID();
    const stmt = db.prepare(
      'INSERT INTO payments (id, user_id, paypal_order_id, amount, status, subscription_months) VALUES (?, ?, ?, ?, ?, ?)'
    );
    stmt.run(
      paymentId,
      req.user.id,
      orderId,
      amount,
      'CREATED',
      plan === 'monthly' ? 1 : 12
    );

    res.json({
      id: orderId,
      status: orderData.status
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order: ' + err.message });
  }
}

// Capture PayPal order and activate subscription
export async function captureSubscriptionOrder(req, res) {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('PayPal capture error:', err);
      return res.status(400).json({ 
        error: 'Payment capture failed',
        details: err
      });
    }

    const captureData = await response.json();

    if (captureData.status !== 'COMPLETED') {
      return res.status(400).json({ 
        error: 'Payment not completed',
        status: captureData.status
      });
    }

    // Update user subscription to premium
    const now = new Date().toISOString();
    const updateStmt = db.prepare(
      'UPDATE users SET subscription = ?, subscription_date = ? WHERE id = ?'
    );
    updateStmt.run('premium', now, req.user.id);

    // Update payment status
    const paymentStmt = db.prepare(
      'UPDATE payments SET status = ? WHERE paypal_order_id = ?'
    );
    paymentStmt.run('COMPLETED', orderId);

    res.json({
      success: true,
      subscription: 'premium',
      subscription_date: now
    });
  } catch (err) {
    console.error('Capture order error:', err);
    res.status(500).json({ error: 'Failed to capture order: ' + err.message });
  }
}

// Get payment history
export async function getPaymentHistory(req, res) {
  try {
    const stmt = db.prepare(
      'SELECT id, paypal_order_id, amount, currency, status, subscription_months, created_at FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
    );
    const payments = stmt.all(req.user.id);

    res.json(payments);
  } catch (err) {
    console.error('Get payment history error:', err);
    res.status(500).json({ error: 'Failed to get payment history' });
  }
}
