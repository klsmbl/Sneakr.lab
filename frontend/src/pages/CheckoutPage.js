import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [savePayment, setSavePayment] = useState(false);

  const shoePreview = localStorage.getItem('checkout_shoe_image') || localStorage.getItem('shoe_image');
  const checkoutModelName = localStorage.getItem('checkout_model_name') || 'Custom Low Sneaker - Black Edition';
  const checkoutDesignName = localStorage.getItem('checkout_design_name');

  const selectedShipping = useMemo(
    () => SHIPPING_OPTIONS.find((option) => option.id === shippingMethod) || SHIPPING_OPTIONS[0],
    [shippingMethod]
  );

  const total = PRODUCT_PRICE + selectedShipping.price;

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
                  <input type="email" name="email" placeholder="you@email.com" autoComplete="email" />
                </label>
              </div>
            </div>

            <div className="checkout-section">
              <h2>Shipping Address</h2>
              <div className="checkout-field-grid">
                <label className="checkout-field checkout-field--full">
                  <span>Full Name</span>
                  <input type="text" name="fullName" placeholder="Enter full name" autoComplete="name" />
                </label>

                <label className="checkout-field checkout-field--full">
                  <span>Address Line</span>
                  <input type="text" name="address" placeholder="Street address" autoComplete="street-address" />
                </label>

                <label className="checkout-field">
                  <span>City</span>
                  <input type="text" name="city" placeholder="City" autoComplete="address-level2" />
                </label>

                <label className="checkout-field">
                  <span>State / Region</span>
                  <input type="text" name="state" placeholder="State" autoComplete="address-level1" />
                </label>

                <label className="checkout-field">
                  <span>Postal Code</span>
                  <input type="text" name="postalCode" placeholder="Postal code" autoComplete="postal-code" />
                </label>

                <label className="checkout-field">
                  <span>Country</span>
                  <input type="text" name="country" placeholder="Country" autoComplete="country-name" />
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
              <div className="checkout-field-grid">
                <label className="checkout-field checkout-field--full">
                  <span>Card Number</span>
                  <input type="text" name="cardNumber" inputMode="numeric" placeholder="1234 5678 9012 3456" autoComplete="cc-number" />
                </label>

                <label className="checkout-field">
                  <span>Expiration Date</span>
                  <input type="text" name="expDate" placeholder="MM/YY" autoComplete="cc-exp" />
                </label>

                <label className="checkout-field">
                  <span>CVV</span>
                  <input type="text" name="cvv" inputMode="numeric" placeholder="123" autoComplete="cc-csc" />
                </label>

                <label className="checkout-field checkout-field--full">
                  <span>Name on Card</span>
                  <input type="text" name="cardName" placeholder="Name as shown on card" autoComplete="cc-name" />
                </label>
              </div>

              <label className="checkout-checkbox">
                <input
                  type="checkbox"
                  checked={savePayment}
                  onChange={(event) => setSavePayment(event.target.checked)}
                />
                <span>Save payment method</span>
              </label>
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

            <button className="checkout-cta" type="button">
              Complete Purchase
            </button>
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
