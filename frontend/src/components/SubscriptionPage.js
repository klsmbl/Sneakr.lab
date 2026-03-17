/**
 * Sneakr.lab - Subscription & Payment Page
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { user } = useUser();
  const { setTier } = useSubscription();
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paypalReady, setPaypalReady] = useState(false);
  const monthlyButtonsRef = useRef(null);
  const yearlyButtonsRef = useRef(null);
  const plansRef = useRef(null);
  const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;

  const loadSubscriptionData = useCallback(async () => {
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
  }, [setTier]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadSubscriptionData();
  }, [user, loadSubscriptionData]);

  useEffect(() => {
    if (!user || subscription?.tier === 'premium') return;

    if (!PAYPAL_CLIENT_ID) {
      setError('Missing PayPal client configuration. Please set REACT_APP_PAYPAL_CLIENT_ID.');
      return;
    }

    if (window.paypal) {
      setPaypalReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
    script.async = true;
    script.onload = () => setPaypalReady(true);
    script.onerror = () => setError('Failed to load PayPal SDK. Please refresh and try again.');
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [user, subscription?.tier, PAYPAL_CLIENT_ID]);

  const handleUpgrade = useCallback(async (plan) => {
    try {
      setError('');

      const orderData = await createSubscriptionOrder(plan);
      return orderData.id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const capturePayment = useCallback(async (orderId) => {
    try {
      const result = await captureSubscriptionOrder(orderId);
      setTier('premium');
      setSubscription((prev) => ({
        ...(prev || {}),
        tier: 'premium',
        subscription_date: result.subscription_date
      }));
      setError('');
      await loadSubscriptionData();
    } catch (err) {
      setError(err.message);
    }
  }, [loadSubscriptionData, setTier]);

  useEffect(() => {
    if (!paypalReady || !window.paypal || subscription?.tier === 'premium') {
      return;
    }

    if (monthlyButtonsRef.current) {
      monthlyButtonsRef.current.innerHTML = '';
      window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'paypal', height: 42 },
        createOrder: async () => handleUpgrade('monthly'),
        onApprove: async (data) => {
          await capturePayment(data.orderID);
        },
        onError: () => {
          setError('PayPal payment failed. Please try again.');
        },
      }).render(monthlyButtonsRef.current);
    }

    if (yearlyButtonsRef.current) {
      yearlyButtonsRef.current.innerHTML = '';
      window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'paypal', height: 42 },
        createOrder: async () => handleUpgrade('yearly'),
        onApprove: async (data) => {
          await capturePayment(data.orderID);
        },
        onError: () => {
          setError('PayPal payment failed. Please try again.');
        },
      }).render(yearlyButtonsRef.current);
    }
  }, [paypalReady, subscription?.tier, handleUpgrade, capturePayment]);

  if (!user) {
    return (
      <div className="subscription-page">
        <div className="subscription-auth-required">
          <h1>Upgrade to Premium</h1>
          <p>Create an account or sign in to access Premium membership.</p>
          <button type="button" className="subscription-cta-btn" onClick={() => navigate('/signin')}>
            Sign In / Create Account
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="subscription-page"><p className="subscription-loading">Loading premium details...</p></div>;
  }

  return (
    <div className="subscription-page">
      <section className="premium-hero">
        <h1>Upgrade to Premium</h1>
        <p>
          Unlock advanced customization tools, priority production, and exclusive design features.
        </p>
        {subscription?.tier === 'premium' ? (
          <p className="premium-hero__status">You are already on Premium.</p>
        ) : (
          <button
            type="button"
            className="subscription-cta-btn"
            onClick={() => plansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            Upgrade Now
          </button>
        )}
      </section>

      <section className="premium-features-grid" aria-label="Premium feature highlights">
        <article className="premium-feature-card">
          <h3>Advanced Customization Options</h3>
          <p>Access expanded design controls and advanced material combinations.</p>
        </article>
        <article className="premium-feature-card">
          <h3>Priority Order Processing</h3>
          <p>Move your custom pair to the front of the production queue.</p>
        </article>
        <article className="premium-feature-card">
          <h3>Exclusive Sneaker Templates</h3>
          <p>Unlock limited and premium-only base templates for unique drops.</p>
        </article>
        <article className="premium-feature-card">
          <h3>Early Access to New Features</h3>
          <p>Get first access to upcoming tools and new customization modules.</p>
        </article>
      </section>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="current-status">
        <h3>Current Plan</h3>
        <p>
          <strong>{subscription?.tier === 'premium' ? 'Premium' : 'Free'}</strong>
          {subscription?.subscription_date && (
            <span> - Since {new Date(subscription.subscription_date).toLocaleDateString()}</span>
          )}
        </p>
      </div>

      <section className="pricing-plans" ref={plansRef}>
        <div className="plan premium-plan">
          <h2>Premium Monthly</h2>
          <p className="price">$9.99<span>/month</span></p>
          <button
            type="button"
            disabled={subscription?.tier === 'premium' || !paypalReady}
            className="btn btn-primary"
          >
            {subscription?.tier === 'premium' ? 'Current Plan' : 'Upgrade Now'}
          </button>
          {subscription?.tier !== 'premium' && <div ref={monthlyButtonsRef} className="paypal-buttons-wrap" />}
        </div>

        <div className="plan premium-plan">
          <h2>Premium Yearly</h2>
          <p className="price">$99.99<span>/year</span></p>
          <p className="savings">Save $19.89 vs monthly</p>
          <button
            type="button"
            disabled={subscription?.tier === 'premium' || !paypalReady}
            className="btn btn-primary"
          >
            {subscription?.tier === 'premium' ? 'Current Plan' : 'Upgrade Now'}
          </button>
          {subscription?.tier !== 'premium' && <div ref={yearlyButtonsRef} className="paypal-buttons-wrap" />}
        </div>
      </section>

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
        <h4>Secure Checkout</h4>
        <p>Payments are processed through PayPal for secure and reliable transactions.</p>
        <p><strong>Sandbox testing accounts:</strong></p>
        <ul>
          <li><strong>Buyer:</strong> sb-mock@paypal.com / password: 123456</li>
          <li><strong>Seller:</strong> sb-seller@paypal.com / password: 123456</li>
        </ul>
      </div>
    </div>
  );
}
