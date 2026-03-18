import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOrderHistory } from '../services/api';
import './CheckoutSuccessPage.css';

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { orderId, amount } = location.state || {};

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const orders = await getOrderHistory();
        // Find the most recent order (should be the one we just placed)
        if (orders && orders.length > 0) {
          setOrder(orders[0]);
        }
      } catch (err) {
        setError('Failed to load order details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  return (
    <div className="checkout-success-page">
      <div className="checkout-success-page__texture" aria-hidden="true" />

      <main className="checkout-success-shell container-xl py-4 py-lg-5">
        <div className="checkout-success-card">
          <div className="success-icon-wrapper" aria-hidden="true">
            <div className="success-icon">✓</div>
          </div>

          <h1 className="success-title">Order Confirmed!</h1>

          {error && (
            <div className="alert alert-warning" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div className="success-loading" role="status">
              <p>Loading your order details...</p>
            </div>
          ) : (
            <>
              <p className="success-subtitle">
                Thank you for your order! We'll start crafting your custom sneakers right away.
              </p>

              <div className="order-details">
                <div className="detail-row">
                  <span className="detail-label">Order ID:</span>
                  <span className="detail-value">{orderId || 'N/A'}</span>
                </div>

                {order && (
                  <>
                    <div className="detail-row">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value">${parseFloat(order.amount).toFixed(2)}</span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Model:</span>
                      <span className="detail-value">{order.model_name}</span>
                    </div>

                    {order.design_name && (
                      <div className="detail-row">
                        <span className="detail-label">Design:</span>
                        <span className="detail-value">{order.design_name}</span>
                      </div>
                    )}

                    <div className="detail-row">
                      <span className="detail-label">Shipping To:</span>
                      <span className="detail-value">
                        {order.full_name}<br />
                        {order.address}<br />
                        {order.city}, {order.state} {order.postal_code}<br />
                        {order.country}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Shipping Method:</span>
                      <span className="detail-value">
                        {order.shipping_method === 'standard' ? 'Standard (3-5 business days)' : 'Express (1-2 business days)'}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">
                        <span className="status-badge status-badge--completed">
                          {order.status}
                        </span>
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="success-message">
                <h2>What's Next?</h2>
                <ul className="next-steps">
                  <li>We've sent a confirmation email to {order?.email || 'your email'}</li>
                  <li>Your custom sneakers will be crafted with precision</li>
                  <li>You'll receive updates on production and shipping status</li>
                  <li>Track your order in your account dashboard</li>
                </ul>
              </div>

              <div className="success-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/account')}
                >
                  View My Orders
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/customizer')}
                >
                  Create Another Design
                </button>
              </div>

              <div className="success-trust-info">
                <h3>Questions?</h3>
                <p>Check your email for order confirmation and tracking details.</p>
                <p>
                  Need help? <a href="/contact-us">Contact our support team</a>
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
