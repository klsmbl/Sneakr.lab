/**
 * Sneakr.lab - Subscription & Payment Page (Bootstrap)
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
import { Check, X, Zap } from 'lucide-react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import 'bootstrap/dist/css/bootstrap.min.css';

// Reusable Bootstrap-based components
const Card = ({ children, className = '', style = {} }) => (
  <div className={`card ${className}`} style={style}>{children}</div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>{children}</div>
);

const CardBody = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>{children}</div>
);

const Badge = ({ children, className = '', bg = 'primary' }) => (
  <span className={`badge bg-${bg} ${className}`}>{children}</span>
);

export function SubscriptionPage() {
  const { user } = useUser();
  const { tier, setTier } = useSubscription();
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayPal, setShowPayPal] = useState(false);

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

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowPayPal(true);
    setError('');
  };

  const onCreateOrder = async () => {
    try {
      const orderData = await createSubscriptionOrder(selectedPlan);
      if (orderData.id) {
        return orderData.id;
      } else {
        throw new Error('Failed to create PayPal order');
      }
    } catch (err) {
      setError(`Order creation failed: ${err.message}`);
      throw err;
    }
  };

  const onApproveOrder = async (data) => {
    try {
      const result = await captureSubscriptionOrder(data.orderID);
      setTier('premium');
      setSubscription({
        ...subscription,
        tier: 'premium',
        subscription_date: result.subscription_date
      });
      setShowPayPal(false);
      setSelectedPlan(null);
      setError('');
      alert('✅ Payment successful! You are now a Premium user!');
      await loadSubscriptionData();
    } catch (err) {
      setError(`Payment capture failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className='d-flex align-items-center justify-content-center min-vh-100'>
        <div className='text-center'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
          <p className='text-muted mt-4'>Loading subscription data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container py-5 min-vh-100'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-5'>
          <h1 className='display-4 fw-bold mb-3'>Sneakr.lab Premium</h1>
          <p className='lead text-muted'>Unlock unlimited creative possibilities</p>
        </div>

        {error && (
          <div className='alert alert-danger mb-4' role='alert'>
            {error}
          </div>
        )}

        {/* Current Status */}
        {subscription && (
          <div className='card mb-4 border-0 text-white shadow' 
               style={{ background: 'linear-gradient(to right, #2563eb, #4f46e5)' }}>
            <div className='card-body p-4'>
              <div className='d-flex align-items-center justify-content-between'>
                <div>
                  <p className='text-white-50 small mb-1'>Current Plan</p>
                  <p className='h3 fw-bold mb-0'>
                    {subscription.tier === 'premium' ? '⭐ Premium' : 'Free'}
                  </p>
                  {subscription.subscription_date && (
                    <p className='text-white-50 small mt-1 mb-0'>
                      Since {new Date(subscription.subscription_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {subscription.tier === 'premium' && (
                  <Zap className='text-warning' size={48} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        <div className='row g-4 mb-5'>
          {/* Free Plan */}
          <div className='col-lg-4'>
            <Card className='h-100 shadow-sm'>
              <CardHeader className='bg-transparent py-4'>
                <h2 className='h4 mb-1'>Free</h2>
                <p className='text-muted small mb-0'>Great for getting started</p>
              </CardHeader>
              <CardBody className='d-flex flex-column'>
                <div className='mb-4'>
                  <span className='display-5 fw-bold'>$0</span>
                  <span className='text-muted'>/month</span>
                </div>
                <ul className='list-unstyled mb-4 flex-grow-1'>
                  <li className='mb-3 d-flex align-items-center gap-2'>
                    <Check className='text-success' size={20} />
                    <span>1 sneaker model</span>
                  </li>
                  <li className='mb-3 d-flex align-items-center gap-2'>
                    <Check className='text-success' size={20} />
                    <span>Limited colors</span>
                  </li>
                  <li className='mb-3 d-flex align-items-center gap-2'>
                    <Check className='text-success' size={20} />
                    <span>3 AI generations/day</span>
                  </li>
                  <li className='mb-3 d-flex align-items-center gap-2'>
                    <Check className='text-success' size={20} />
                    <span>Standard 3D preview</span>
                  </li>
                  <li className='mb-3 d-flex align-items-center gap-2'>
                    <Check className='text-success' size={20} />
                    <span>Save 1-2 designs</span>
                  </li>
                  <li className='mb-3 d-flex align-items-center gap-2'>
                    <X className='text-danger' size={20} />
                    <span className='text-muted'>Watermarked output</span>
                  </li>
                </ul>
                <button disabled className='btn btn-outline-secondary w-full mt-auto py-2'>
                  {subscription?.tier === 'free' ? 'Current Plan' : 'Downgrade'}
                </button>
              </CardBody>
            </Card>
          </div>

          {/* Premium Plan */}
          <div className='col-lg-4'>
            <Card className='h-100 border-primary border-2 shadow-lg position-relative'>
              <div className='position-absolute top-0 start-50 translate-middle'>
                <Badge className='rounded-pill px-3 py-2'>POPULAR</Badge>
              </div>
              <CardHeader className='bg-transparent pt-5 pb-4'>
                <h2 className='h4 mb-1 d-flex align-items-center gap-2'>
                  <Zap className='text-warning' size={24} />
                  Premium
                </h2>
                <p className='text-muted small mb-0'>Most features unlocked</p>
              </CardHeader>
              <CardBody className='d-flex flex-column'>
                <div className='mb-4 border-bottom pb-4'>
                  <div className='mb-3'>
                    <span className='display-5 fw-bold'>$9.99</span>
                    <span className='text-muted'>/month</span>
                  </div>
                  {showPayPal && selectedPlan === 'monthly' ? (
                    <div className='mt-3'>
                      <PayPalButtons 
                        style={{ layout: "vertical" }} 
                        createOrder={onCreateOrder}
                        onApprove={onApproveOrder}
                        onCancel={() => setShowPayPal(false)}
                      />
                      <button 
                        className="btn btn-link btn-sm w-100 mt-2 text-decoration-none"
                        onClick={() => setShowPayPal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePlanSelect('monthly')}
                      disabled={subscription?.tier === 'premium'}
                      className='btn btn-primary w-100 py-2'
                    >
                      {subscription?.tier === 'premium' ? 'Current Plan' : 'Upgrade Monthly'}
                    </button>
                  )}
                </div>

                <div className='mb-4'>
                  <div className='mb-3'>
                    <span className='display-5 fw-bold'>$99.99</span>
                    <span className='text-muted'>/year</span>
                  </div>
                  <p className='text-success small fw-bold mb-3'>Save $19.89 annually!</p>
                  {showPayPal && selectedPlan === 'yearly' ? (
                    <div className='mt-3'>
                      <PayPalButtons 
                        style={{ layout: "vertical" }} 
                        createOrder={onCreateOrder}
                        onApprove={onApproveOrder}
                        onCancel={() => setShowPayPal(false)}
                      />
                      <button 
                        className="btn btn-link btn-sm w-100 mt-2 text-decoration-none"
                        onClick={() => setShowPayPal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePlanSelect('yearly')}
                      disabled={subscription?.tier === 'premium'}
                      className='btn btn-outline-primary w-100 py-2'
                    >
                      {subscription?.tier === 'premium' ? 'Current Plan' : 'Upgrade Yearly'}
                    </button>
                  )}
                </div>

                <ul className='list-unstyled mb-0'>
                  <li className='mb-2 d-flex align-items-center gap-2'>
                    <Check className='text-success' size={20} />
                    <span>All sneaker models</span>
                  </li>
                  <li className='mb-2 d-flex align-items-center gap-2'>
                    <Check className='text-success' size={20} />
                    <span>Unlimited colors</span>
                  </li>
                  <li className='mb-2 d-flex align-items-center gap-2'>
                    <Check className='text-success' size={20} />
                    <span>Unlimited AI generations</span>
                  </li>
                  <li className='mb-2 d-flex align-items-center gap-2'>
                    <Check className='text-success' size={20} />
                    <span>HD quality output</span>
                  </li>
                  <li className='mb-2 d-flex align-items-center gap-2'>
                    <Check className='text-success' size={20} />
                    <span>Unlimited saves</span>
                  </li>
                  <li className='mb-2 d-flex align-items-center gap-2'>
                    <Check className='text-success' size={20} />
                    <span>No watermarks</span>
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>

          {/* Enterprise/Custom */}
          <div className='col-lg-4'>
            <Card className='h-100 shadow-sm'>
              <CardHeader className='bg-transparent py-4'>
                <h2 className='h4 mb-1'>Enterprise</h2>
                <p className='text-muted small mb-0'>Custom solutions for teams</p>
              </CardHeader>
              <CardBody className='d-flex flex-column'>
                <div className='mb-4'>
                  <span className='display-5 fw-bold'>Custom</span>
                </div>
                <p className='text-muted mb-4'>
                  Need bulk orders or custom integrations for your brand?
                </p>
                <ul className='list-unstyled mb-4 flex-grow-1'>
                  <li className='mb-3 d-flex align-items-center gap-2'>
                    <Check className='text-success' size={20} />
                    <span>Bulk order discounts</span>
                  </li>
                  <li className='mb-3 d-flex align-items-center gap-2'>
                    <Check className='text-success' size={20} />
                    <span>API access</span>
                  </li>
                  <li className='mb-3 d-flex align-items-center gap-2'>
                    <Check className='text-success' size={20} />
                    <span>Priority support</span>
                  </li>
                </ul>
                <button className='btn btn-outline-dark w-100 py-2'>
                  Contact Sales
                </button>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Payment History */}
        {payments.length > 0 && (
          <div className='card mb-5 shadow-sm'>
            <CardHeader className='bg-light py-3'>
              <h5 className='mb-0'>Payment History</h5>
            </CardHeader>
            <CardBody>
              <div className='table-responsive'>
                <table className='table table-hover align-middle mb-0'>
                  <thead>
                    <tr>
                      <th className='text-muted small fw-bold'>DATE</th>
                      <th className='text-muted small fw-bold'>AMOUNT</th>
                      <th className='text-muted small fw-bold'>PLAN</th>
                      <th className='text-muted small fw-bold'>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => (
                      <tr key={payment.id}>
                        <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                        <td className='fw-bold'>${payment.amount}</td>
                        <td>
                          {payment.subscription_months === 1 ? 'Monthly' : 'Yearly'}
                        </td>
                        <td>
                          <Badge bg={payment.status === 'COMPLETED' ? 'success' : 'secondary'}>
                            {payment.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </div>
        )}

        {/* Info Box */}
        <div className='alert alert-info border-info-subtle mb-0' role='alert'>
          <h5 className='alert-heading d-flex align-items-center gap-2'>
            <span>🧪</span>
            PayPal Sandbox Demo
          </h5>
          <p className='mb-2 small'>
            This is a demonstration using PayPal Sandbox. In production, this would use real PayPal payments.
          </p>
          <hr />
          <p className='mb-0 small fw-bold'>Testing Steps:</p>
          <ol className='mb-0 small text-muted'>
            <li>Click "Upgrade" on your preferred plan.</li>
            <li>Use your personal Sandbox Buyer account to complete the payment.</li>
            <li>Your account will be upgraded automatically!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
