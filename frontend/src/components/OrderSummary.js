/**
 * Sneakr.lab - DATASTALGO
 * Order summary: design details, quantity, size, subtotal, discount, total
 */

import { useState } from 'react';
import { useDesign } from '../context/DesignContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useCart } from '../context/CartContext';

const UNIT_PRICE = 120;
const DISCOUNT_PERCENT_PREMIUM = 10;
const SIZE_OPTIONS = ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'];

function formatColorSummary(layerColors) {
  return Object.entries(layerColors)
    .slice(0, 4)
    .map(([part, color]) => `${part}: ${color}`)
    .join(' · ');
}

export function OrderSummary() {
  const { design } = useDesign();
  const { tier } = useSubscription();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('US 9');
  const [showToast, setShowToast] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent = tier === 'premium' ? DISCOUNT_PERCENT_PREMIUM : 0;
  const subtotal = quantity * UNIT_PRICE;
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  const customizationSummary = formatColorSummary(design.layerColors);

  const handleAddToCart = () => {
    addItem({
      modelId: design.modelId,
      modelName: design.modelName,
      designId: design.designId,
      designName: design.designName,
      layerColors: { ...design.layerColors },
      logoPrompt: design.logoPrompt,
      size,
      quantity,
      unitPrice: total / quantity,
    });

    setIsAdded(true);
    setShowToast(true);

    window.setTimeout(() => setIsAdded(false), 380);
    window.setTimeout(() => setShowToast(false), 2400);
  };

  const increaseQty = () => setQuantity((q) => Math.min(10, q + 1));
  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <section className="card shadow-sm mb-4">
      <div className="card-body order-module">
        <h2 className="h5 mb-3">Custom Product</h2>
        <div className="order-module__preview" aria-hidden="true">
          <div className="order-module__preview-shoe">👟</div>
        </div>

        <h3 className="order-module__name">{design.modelName}</h3>
        <p className="order-module__summary">
          {design.designName} · {customizationSummary}
          {design.logoPrompt ? ` · logo: ${design.logoPrompt}` : ''}
        </p>

        <div className="order-module__row">
          <label className="order-module__label" htmlFor="shoe-size-select">Size</label>
          <select
            id="shoe-size-select"
            className="form-select form-select-sm"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            {SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="order-module__row">
          <span className="order-module__label">Quantity</span>
          <div className="order-module__qty">
            <button type="button" onClick={decreaseQty} aria-label="Decrease quantity">-</button>
            <span>{quantity}</span>
            <button type="button" onClick={increaseQty} aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div className="order-module__price">
          <div>
            <span>Price</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          {discountPercent > 0 && <small>Premium discount saved ${discountAmount.toFixed(2)}</small>}
        </div>

        <button
          type="button"
          className={`order-module__add-btn ${isAdded ? 'is-added' : ''}`}
          onClick={handleAddToCart}
        >
          <span className="order-module__cart-icon" aria-hidden="true">🛒</span>
          Add to Cart
        </button>

        <div className={`order-module__toast ${showToast ? 'is-visible' : ''}`} role="status">
          Custom shoes added to your cart.
        </div>

        <div className="order-module__meta">
          <span>Subtotal ({quantity} x ${UNIT_PRICE})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </section>
  );
}
