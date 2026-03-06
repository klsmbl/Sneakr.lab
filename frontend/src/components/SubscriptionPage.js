/**
 * Sneakr.lab - Subscription & Payment Page
 */

import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useSubscription } from '../context/SubscriptionContext';
import { 
  getSubscription, 
  createSubscriptionOrder, 
  captureSubscriptionOrder,
  getPaymentHistory 
} from '../services/api';
import './SubscriptionPage.css';

export function SubscriptionPage() {
  const { user } = useUser();
  const { tier, setTier } = useSubscription();
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadSubscriptionData();
  }, [user]);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const [subData, paymentData] = await Promise.all([
        getSubscription(),
        getPaymentHistory()
      ]);
      setSubscription(subData);
      setPayments(paymentData);
      setTier(subData.tier);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan) => {
    try {
      setPaymentInProgress(true);
      setSelectedPlan(plan);
      setError('');

      // Create PayPal order
      const orderData = await createSubscriptionOrder(plan);
      
      // Redirect to PayPal for approval
      if (orderData.id) {
        // In production, use PayPal Checkout integration
        // For now, show order info and allow capture
        localStorage.setItem('pendingPayPalOrderId', orderData.id);
        localStorage.setItem('pendingPayPalPlan', plan);
        
        // Simulate PayPal checkout (in real app, use PayPal buttons)
        alert(`Payment Order Created: ${orderData.id}\n\nIn production, you would be redirected to PayPal for payment approval.\n\nFor demo purposes, click "Complete Payment" to simulate payment completion.`);
        
        // After approval, capture the order
        setTimeout(() => capturePayment(orderData.id), 1000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setPaymentInProgress(false);
      setSelectedPlan(null);
    }
  };

  const capturePayment = async (orderId) => {
    try {
      const result = await captureSubscriptionOrder(orderId);
      setTier('premium');
      setSubscription({
        ...subscription,
        tier: 'premium',
        subscription_date: result.subscription_date
      });
      setError('');
      alert('✅ Payment successful! You are now a Premium user!');
      localStorage.removeItem('pendingPayPalOrderId');
      localStorage.removeItem('pendingPayPalPlan');
      await loadSubscriptionData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="subscription-page"><p>Loading...</p></div>;
  }

  return (
    <div className="subscription-page">
      <h1>Sneakr.lab Premium</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="current-status">
        <h3>Current Plan</h3>
        <p>
          <strong>{subscription?.tier === 'premium' ? '⭐ Premium' : 'Free'}</strong>
          {subscription?.subscription_date && (
            <span> - Since {new Date(subscription.subscription_date).toLocaleDateString()}</span>
          )}
        </p>
      </div>

      <div className="pricing-plans">
        <div className="plan free-plan">
          <h2>Free</h2>
          <p className="price">$0<span>/month</span></p>
          <ul className="features">
            <li>✓ Customize 1 sneaker model</li>
            <li>✓ Limited color palette</li>
            <li>✓ 3 AI logo generations/day</li>
            <li>✓ Standard 3D quality</li>
            <li>✓ Save 1-2 designs</li>
            <li>✗ Watermarked designs</li>
          </ul>
          <button 
            disabled={subscription?.tier === 'free'}
            className="btn btn-outline-secondary"
          >
            {subscription?.tier === 'free' ? 'Current Plan' : 'Downgrade'}
          </button>
        </div>

        <div className="plan premium-plan">
          <div className="badge">POPULAR</div>
          <h2>Premium</h2>
          <div className="pricing-options">
            <div className="option monthly">
              <p className="price">$9.99<span>/month</span></p>
              <button
                onClick={() => handleUpgrade('monthly')}
                disabled={subscription?.tier === 'premium' || paymentInProgress || selectedPlan === 'monthly'}
                className="btn btn-primary"
              >
                {paymentInProgress && selectedPlan === 'monthly' ? 'Processing...' : 'Upgrade Monthly'}
              </button>
            </div>
            <div className="option yearly">
              <p className="price">$99.99<span>/year</span></p>
              <p className="savings">Save $19.89</p>
              <button
                onClick={() => handleUpgrade('yearly')}
                disabled={subscription?.tier === 'premium' || paymentInProgress || selectedPlan === 'yearly'}
                className="btn btn-primary"
              >
                {paymentInProgress && selectedPlan === 'yearly' ? 'Processing...' : 'Upgrade Yearly'}
              </button>
            </div>
          </div>
          <ul className="features">
            <li>✓ All sneaker models</li>
            <li>✓ Unlimited colors & materials</li>
            <li>✓ Unlimited AI generations</li>
            <li>✓ HD quality output</li>
            <li>✓ Save unlimited designs</li>
            <li>✓ No watermarks</li>
            <li>✓ Duplicate & edit designs</li>
            <li>✓ Advanced presets</li>
          </ul>
        </div>
      </div>

      {payments.length > 0 && (
        <div className="payment-history">
          <h3>Payment History</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Plan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                  <td>${payment.amount}</td>
                  <td>{payment.subscription_months === 1 ? 'Monthly' : 'Yearly'} ({payment.subscription_months}mo)</td>
                  <td>
                    <span className={`badge bg-${payment.status === 'COMPLETED' ? 'success' : payment.status === 'CREATED' ? 'warning' : 'danger'}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="info-box">
        <h4>PayPal Sandbox Demo</h4>
        <p>This is a demonstration using PayPal Sandbox (virtual money). In production, this would use real PayPal payments.</p>
        <p><strong>Test Accounts:</strong></p>
        <ul>
          <li><strong>Buyer:</strong> sb-mock@paypal.com / password: 123456</li>
          <li><strong>Seller:</strong> sb-seller@paypal.com / password: 123456</li>
        </ul>
      </div>
    </div>
  );
}
