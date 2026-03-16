/**
 * Sneakr.lab - Subscription & Payment Page (shadcn/ui)
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
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Check, X, Zap } from 'lucide-react';

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

      const orderData = await createSubscriptionOrder(plan);
      
      if (orderData.id) {
        localStorage.setItem('pendingPayPalOrderId', orderData.id);
        localStorage.setItem('pendingPayPalPlan', plan);
        
        alert(`Payment Order Created: ${orderData.id}\n\nIn production, you would be redirected to PayPal for payment approval.\n\nFor demo purposes, click "Complete Payment" to simulate payment completion.`);
        
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

  const featureComparison = [
    { name: 'Sneaker Models', free: '1', premium: 'Unlimited' },
    { name: 'Color Palette', free: 'Limited', premium: 'Unlimited' },
    { name: 'AI Logo Generations', free: '3/day', premium: 'Unlimited' },
    { name: '3D Preview Quality', free: 'Standard', premium: 'HD' },
    { name: 'Design Saves', free: '1-2', premium: 'Unlimited' },
    { name: 'Watermark', free: 'Yes', premium: 'No' },
    { name: 'HD Export', free: 'No', premium: 'Yes' },
    { name: 'Design Duplication', free: 'No', premium: 'Yes' },
    { name: 'Advanced Presets', free: 'No', premium: 'Yes' },
  ];

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
          <p className='text-muted-foreground mt-4'>Loading subscription data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl mb-4'>
            Sneakr.lab Premium
          </h1>
          <p className='text-xl text-muted-foreground'>
            Unlock unlimited creative possibilities
          </p>
        </div>

        {error && (
          <div className='mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg'>
            {error}
          </div>
        )}

        {/* Current Status */}
        {subscription && (
          <Card className='mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 border-0'>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-white/80 text-sm mb-1'>Current Plan</p>
                  <p className='text-white text-2xl font-bold'>
                    {subscription.tier === 'premium' ? '⭐ Premium' : 'Free'}
                  </p>
                  {subscription.subscription_date && (
                    <p className='text-white/70 text-sm mt-1'>
                      Since {new Date(subscription.subscription_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {subscription.tier === 'premium' && (
                  <Zap className='w-12 h-12 text-yellow-300' />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Plans */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12'>
          {/* Free Plan */}
          <Card className='flex flex-col'>
            <CardHeader>
              <CardTitle className='text-2xl'>Free</CardTitle>
              <CardDescription>Great for getting started</CardDescription>
            </CardHeader>
            <CardContent className='flex-grow'>
              <div className='mb-6'>
                <span className='text-4xl font-bold'>$0</span>
                <span className='text-muted-foreground text-sm ml-2'>/month</span>
              </div>
              <ul className='space-y-3'>
                <li className='flex items-center gap-2'>
                  <Check className='w-5 h-5 text-green-600' />
                  <span>1 sneaker model</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='w-5 h-5 text-green-600' />
                  <span>Limited colors</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='w-5 h-5 text-green-600' />
                  <span>3 AI generations/day</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='w-5 h-5 text-green-600' />
                  <span>Standard 3D preview</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='w-5 h-5 text-green-600' />
                  <span>Save 1-2 designs</span>
                </li>
                <li className='flex items-center gap-2'>
                  <X className='w-5 h-5 text-destructive' />
                  <span className='text-muted-foreground'>Watermarked output</span>
                </li>
              </ul>
            </CardContent>
            <CardContent className='pt-0'>
              <Button disabled className='w-full'>
                {subscription?.tier === 'free' ? 'Current Plan' : 'Downgrade'}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className='lg:col-span-1 border-primary border-2 shadow-xl relative'>
            <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 bg-primary'>
              POPULAR
            </Badge>
            <CardHeader className='pt-8'>
              <CardTitle className='text-2xl flex items-center gap-2'>
                <Zap className='w-6 h-6 text-yellow-500' />
                Premium
              </CardTitle>
              <CardDescription>Most features unlocked</CardDescription>
            </CardHeader>
            <CardContent className='flex-grow'>
              <div className='space-y-4 mb-6'>
                <div>
                  <div className='flex items-baseline gap-1 mb-2'>
                    <span className='text-4xl font-bold'>$9.99</span>
                    <span className='text-muted-foreground text-sm'>/month</span>
                  </div>
                  <Button
                    onClick={() => handleUpgrade('monthly')}
                    disabled={subscription?.tier === 'premium' || paymentInProgress || selectedPlan === 'monthly'}
                    className='w-full'
                  >
                    {paymentInProgress && selectedPlan === 'monthly' ? 'Processing...' : 'Upgrade Monthly'}
                  </Button>
                </div>
                <div className='border-t pt-4'>
                  <div className='flex items-baseline gap-1 mb-2'>
                    <span className='text-4xl font-bold'>$99.99</span>
                    <span className='text-muted-foreground text-sm'>/year</span>
                  </div>
                  <p className='text-green-600 text-sm font-semibold mb-3'>Save $19.89 annually!</p>
                  <Button
                    onClick={() => handleUpgrade('yearly')}
                    disabled={subscription?.tier === 'premium' || paymentInProgress || selectedPlan === 'yearly'}
                    variant='secondary'
                    className='w-full'
                  >
                    {paymentInProgress && selectedPlan === 'yearly' ? 'Processing...' : 'Upgrade Yearly'}
                  </Button>
                </div>
              </div>
              <ul className='space-y-3'>
                <li className='flex items-center gap-2'>
                  <Check className='w-5 h-5 text-green-600' />
                  <span>All sneaker models</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='w-5 h-5 text-green-600' />
                  <span>Unlimited colors</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='w-5 h-5 text-green-600' />
                  <span>Unlimited AI generations</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='w-5 h-5 text-green-600' />
                  <span>HD quality output</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='w-5 h-5 text-green-600' />
                  <span>Unlimited saves</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='w-5 h-5 text-green-600' />
                  <span>No watermarks</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='w-5 h-5 text-green-600' />
                  <span>Design duplication</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='w-5 h-5 text-green-600' />
                  <span>Advanced presets</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature Comparison */}
          <Card className='lg:col-span-1'>
            <CardHeader>
              <CardTitle className='text-2xl'>Enterprise</CardTitle>
              <CardDescription>Custom solutions for teams</CardDescription>
            </CardHeader>
            <CardContent className='flex-grow flex flex-col justify-between'>
              <div>
                <p className='text-5xl font-bold mb-4'>Custom</p>
                <p className='text-muted-foreground mb-6'>
                  Need bulk orders or custom integrations?
                </p>
                <ul className='space-y-3 mb-6'>
                  <li className='flex items-center gap-2'>
                    <Check className='w-5 h-5 text-green-600' />
                    <span>Bulk order discounts</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='w-5 h-5 text-green-600' />
                    <span>API access</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='w-5 h-5 text-green-600' />
                    <span>Priority support</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='w-5 h-5 text-green-600' />
                    <span>Custom branding</span>
                  </li>
                </ul>
              </div>
              <Button variant='outline' className='w-full'>
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        {payments.length > 0 && (
          <Card className='mb-12'>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your transaction records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b'>
                      <th className='text-left py-3 px-4 font-semibold text-muted-foreground'>Date</th>
                      <th className='text-left py-3 px-4 font-semibold text-muted-foreground'>Amount</th>
                      <th className='text-left py-3 px-4 font-semibold text-muted-foreground'>Plan</th>
                      <th className='text-left py-3 px-4 font-semibold text-muted-foreground'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => (
                      <tr key={payment.id} className='border-b hover:bg-muted/50'>
                        <td className='py-3 px-4'>
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                        <td className='py-3 px-4 font-semibold'>${payment.amount}</td>
                        <td className='py-3 px-4'>
                          {payment.subscription_months === 1 ? 'Monthly' : 'Yearly'} ({payment.subscription_months}mo)
                        </td>
                        <td className='py-3 px-4'>
                          <Badge variant={payment.status === 'COMPLETED' ? 'default' : 'secondary'}>
                            {payment.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Box */}
        <Card className='border-blue-200 bg-blue-50/50'>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <span>🧪</span>
              PayPal Sandbox Demo
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <p className='text-sm text-muted-foreground'>
              This is a demonstration using PayPal Sandbox (virtual money). In production, this would use real PayPal payments.
            </p>
            <div className='space-y-2'>
              <p className='text-sm font-semibold'>Test Accounts:</p>
              <ul className='space-y-1 text-sm text-muted-foreground ml-4'>
                <li>• Buyer: sb-mock@paypal.com / password: 123456</li>
                <li>• Seller: sb-seller@paypal.com / password: 123456</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
