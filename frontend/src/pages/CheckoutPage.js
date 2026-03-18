import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  createCheckoutOrder,
  captureCheckoutOrder
} from '../services/api';
import './CheckoutPage.css';

const SHIPPING_OPTIONS = [
  {
    id: 'standard',
    title: 'Standard Shipping',
    eta: '3-5 business days',
    price: 0,
  },
  {
    id: 'express',
    title: 'Express Shipping',
    eta: '1-2 business days',
    price: 15,
  },
];

const PRODUCT_PRICE = 120;

function formatPrice(value) {
  return value === 0 ? 'Free' : `$${value.toFixed(2)}`;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [paypalReady, setPaypalReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const paypalButtonRef = useRef(null);
  const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;

  const shoePreview = localStorage.getItem('checkout_shoe_image') || localStorage.getItem('shoe_image');
  const checkoutModelName = localStorage.getItem('checkout_model_name') || 'Custom Low Sneaker - Black Edition';
  const checkoutDesignName = localStorage.getItem('checkout_design_name');

  const selectedShipping = useMemo(
    () => SHIPPING_OPTIONS.find((option) => option.id === shippingMethod) || SHIPPING_OPTIONS[0],
    [shippingMethod]
  );

  const total = PRODUCT_PRICE + selectedShipping.price;

  // Load PayPal SDK
  useEffect(() => {
    if (!user) {
      navigate('/signin', { state: { returnTo: '/checkout' } });
      return;
    }

    if (!PAYPAL_CLIENT_ID) {
      setError('Missing PayPal client configuration. Please set REACT_APP_PAYPAL_CLIENT_ID.');
      return;
    }

    // Check if PayPal SDK is already loaded
    if (window.paypal) {
      setPaypalReady(true);
      return;
    }

    // Create script element with better error handling
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('PayPal SDK loaded successfully');
      setPaypalReady(true);
    };
    
    script.onerror = (error) => {
      console.error('Failed to load PayPal SDK:', error);
      setError('Failed to load PayPal SDK. Please check your configuration and refresh.');
    };

    // Add error event listener for network issues
    script.addEventListener('error', (e) => {
      console.error('PayPal SDK error event:', e);
      setError('Network error loading PayPal SDK');
    });

    document.head.appendChild(script);

    return () => {
      // Don't remove PayPal SDK as it may be needed elsewhere
      // Just cleanup our listeners
      script.removeEventListener('error', () => {});
    };
  }, [user, PAYPAL_CLIENT_ID, navigate]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateCheckoutOrder = useCallback(async () => {
    try {
      setError('');
      console.log('Validating form...');
      
      if (!formData.email || !formData.fullName || !formData.address || 
          !formData.city || !formData.state || !formData.postalCode || !formData.country) {
        const msg = 'Please fill in all required fields';
        setError(msg);
        console.error(msg);
        throw new Error(msg);
      }
      if (!formData.email.includes('@')) {
        const msg = 'Please enter a valid email address';
        setError(msg);
        console.error(msg);
        throw new Error(msg);
      }

      console.log('Form validated. Creating order...');
      setLoading(true);
      const orderData = await createCheckoutOrder({
        amount: total.toFixed(2),
        shippingMethod,
        modelName: checkoutModelName,
        designName: checkoutDesignName || undefined,
        email: formData.email,
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country
      });

      console.log('Order created successfully:', orderData);
      return orderData.id;
    } catch (err) {
      const errorMsg = err.message || 'Failed to create order';
      console.error('Checkout order creation error:', err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [formData, total, shippingMethod, checkoutModelName, checkoutDesignName]);

  const handleCapturePayment = useCallback(async (orderId) => {
    try {
      setLoading(true);
      const result = await captureCheckoutOrder(orderId);
      setError('');
      navigate('/checkout/success', {
        state: { orderId: result.orderId, amount: result.amount }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Render PayPal buttons
  useEffect(() => {
    if (!paypalReady || !window.paypal || !paypalButtonRef.current) {
      return;
    }

    try {
      console.log('Rendering PayPal buttons...');
      paypalButtonRef.current.innerHTML = '';
      
      window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'paypal', height: 42 },
        createOrder: async (data, actions) => {
          try {
            console.log('PayPal: Creating order...');
            const orderId = await handleCreateCheckoutOrder();
            console.log('PayPal: Order created:', orderId);
            return orderId;
          } catch (err) {
            const msg = err.message || 'Failed to create PayPal order';
            console.error('PayPal: Create order error:', msg, err);
            setError(msg);
            return actions.reject ? actions.reject(err) : Promise.reject(err);
          }
        },
        onApprove: async (data, actions) => {
          try {
            console.log('PayPal: Order approved:', data.orderID);
            await handleCapturePayment(data.orderID);
            return actions.resolve?.();
          } catch (err) {
            console.error('PayPal: Capture error:', err);
            setError(err.message || 'Payment capture failed. Please try again.');
            return actions.reject ? actions.reject(err) : Promise.reject(err);
          }
        },
        onCancel: (data) => {
          console.warn('PayPal: Payment cancelled by user:', data);
          setError('PayPal payment was canceled. You can try again.');
        },
        onError: (err) => {
          console.error('PayPal: Payment error:', err);
          const message = err?.message || 'PayPal payment failed due to a script error. Please retry.';
          setError(message);
        },
      }).render(paypalButtonRef.current);
      
      console.log('PayPal buttons rendered successfully');
    } catch (err) {
      console.error('Error rendering PayPal buttons:', err);
      setError('Failed to initialize PayPal buttons. Please refresh and try again.');
    }
  }, [paypalReady, handleCreateCheckoutOrder, handleCapturePayment]);

  if (!user) {
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-page__texture" aria-hidden="true" />

      <main className="checkout-shell container-xl py-4 py-lg-5">
        <header className="checkout-header">
          <button className="checkout-back" type="button" onClick={() => navigate(-1)}>
            Back
          </button>
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">Secure your custom sneakers and complete your order.</p>

          <ol className="checkout-progress" aria-label="Checkout steps">
            <li className="checkout-progress__step is-complete">Cart</li>
            <li className="checkout-progress__step is-complete">Information</li>
            <li className="checkout-progress__step is-complete">Shipping</li>
            <li className="checkout-progress__step is-active">Payment</li>
          </ol>
        </header>

        <section className="checkout-grid" aria-label="Checkout form and order summary">
          <div className="checkout-card checkout-form-card">
            <div className="checkout-section">
              <h2>Contact Information</h2>
              <div className="checkout-field-grid">
                <label className="checkout-field">
                  <span>Email Address</span>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="you@email.com" 
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                </label>
              </div>
            </div>

            <div className="checkout-section">
              <h2>Shipping Address</h2>
              <div className="checkout-field-grid">
                <label className="checkout-field checkout-field--full">
                  <span>Full Name</span>
                  <input 
                    type="text" 
                    name="fullName" 
                    placeholder="Enter full name" 
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleFormChange}
                  />
                </label>

                <label className="checkout-field checkout-field--full">
                  <span>Address Line</span>
                  <input 
                    type="text" 
                    name="address" 
                    placeholder="Street address" 
                    autoComplete="street-address"
                    value={formData.address}
                    onChange={handleFormChange}
                  />
                </label>

                <label className="checkout-field">
                  <span>City</span>
                  <input 
                    type="text" 
                    name="city" 
                    placeholder="City" 
                    autoComplete="address-level2"
                    value={formData.city}
                    onChange={handleFormChange}
                  />
                </label>

                <label className="checkout-field">
                  <span>State / Region</span>
                  <input 
                    type="text" 
                    name="state" 
                    placeholder="State" 
                    autoComplete="address-level1"
                    value={formData.state}
                    onChange={handleFormChange}
                  />
                </label>

                <label className="checkout-field">
                  <span>Postal Code</span>
                  <input 
                    type="text" 
                    name="postalCode" 
                    placeholder="Postal code" 
                    autoComplete="postal-code"
                    value={formData.postalCode}
                    onChange={handleFormChange}
                  />
                </label>

                <label className="checkout-field">
                  <span>Country</span>
                  <input 
                    type="text" 
                    name="country" 
                    placeholder="Country" 
                    autoComplete="country-name"
                    value={formData.country}
                    onChange={handleFormChange}
                  />
                </label>
              </div>
            </div>

            <div className="checkout-section">
              <h2>Shipping Method</h2>
              <div className="shipping-options" role="radiogroup" aria-label="Shipping method">
                {SHIPPING_OPTIONS.map((option) => {
                  const checked = option.id === shippingMethod;
                  return (
                    <label className={`shipping-option ${checked ? 'is-selected' : ''}`} key={option.id}>
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={option.id}
                        checked={checked}
                        onChange={() => setShippingMethod(option.id)}
                      />
                      <div>
                        <p className="shipping-option__title">{option.title}</p>
                        <p className="shipping-option__meta">{option.eta}</p>
                      </div>
                      <strong>{formatPrice(option.price)}</strong>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="checkout-section">
              <h2>Payment</h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {loading && (
                <div className="alert alert-info" role="status">
                  Processing your payment...
                </div>
              )}
              <div ref={paypalButtonRef} />
              <p className="checkout-trust-copy" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                Secure payment powered by PayPal. Your information is protected.
              </p>
            </div>
          </div>

          <aside className="checkout-card checkout-summary-card" aria-label="Order summary">
            <h2>Order Summary</h2>

            <div className="summary-product">
              <div className="summary-product__thumb" aria-hidden="true">
                {shoePreview ? (
                  <img src={shoePreview} alt="Custom sneaker preview" />
                ) : (
                  <span>Preview</span>
                )}
              </div>
              <div>
                <p className="summary-product__name">{checkoutModelName}</p>
                {checkoutDesignName && (
                  <p className="summary-product__meta">Design: {checkoutDesignName}</p>
                )}
                <p className="summary-product__meta">Size: US 9</p>
                <p className="summary-product__meta">Quantity: 1</p>
              </div>
            </div>

            <div className="summary-prices">
              <div className="summary-row">
                <span>Product Price</span>
                <span>${PRODUCT_PRICE.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{formatPrice(selectedShipping.price)}</span>
              </div>
              <div className="summary-row summary-row--total">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>

            <p className="checkout-trust-copy">Secure payment. Your information is protected.</p>

            <ul className="checkout-trust-list" aria-label="Trust details">
              <li>Secure Checkout</li>
              <li>Fast Production</li>
              <li>Quality Guarantee</li>
            </ul>
          </aside>
        </section>
      </main>
    </div>
  );
}
