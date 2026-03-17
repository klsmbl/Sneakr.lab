import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPanel.css';

function formatCustomization(item) {
  const colorEntries = Object.entries(item.layerColors || {}).slice(0, 3);
  const colorSummary = colorEntries.map(([part, color]) => `${part}: ${color}`).join(' · ');
  const logoSummary = item.logoPrompt ? `Logo: ${item.logoPrompt}` : 'No logo';
  return `${item.designName} · ${logoSummary}${colorSummary ? ` · ${colorSummary}` : ''}`;
}

function CartItem({ item, onRemove, onQtyChange }) {
  return (
    <article className="cart-panel__item">
      <div className="cart-panel__thumb" aria-hidden="true">
        <div className="cart-panel__thumb-icon">👟</div>
      </div>

      <div className="cart-panel__item-main">
        <h4 className="cart-panel__item-name">{item.modelName}</h4>
        <p className="cart-panel__item-summary">{formatCustomization(item)}</p>
        <p className="cart-panel__item-meta">Size {item.size}</p>

        <div className="cart-panel__row">
          <div className="cart-panel__qty-wrap">
            <button
              type="button"
              className="cart-panel__qty-btn"
              onClick={() => onQtyChange(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="cart-panel__qty-value">{item.quantity}</span>
            <button
              type="button"
              className="cart-panel__qty-btn"
              onClick={() => onQtyChange(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <span className="cart-panel__item-price">${(item.quantity * item.unitPrice).toFixed(2)}</span>
        </div>
      </div>

      <button
        type="button"
        className="cart-panel__remove"
        onClick={() => onRemove(item.id)}
      >
        Remove
      </button>
    </article>
  );
}

export function CartPanel() {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    isCartOpen,
    closeCart,
    removeItem,
    updateItemQuantity,
  } = useCart();

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      <button
        type="button"
        className={`cart-overlay ${isCartOpen ? 'is-open' : ''}`}
        aria-label="Close cart"
        onClick={closeCart}
      />

      <aside className={`cart-panel ${isCartOpen ? 'is-open' : ''}`} aria-label="Shopping cart">
        <div className="cart-panel__header">
          <h3 className="cart-panel__title">Your Cart ({itemCount})</h3>
          <button type="button" className="cart-panel__close" onClick={closeCart}>
            ✕
          </button>
        </div>

        <div className="cart-panel__body">
          {items.length === 0 ? (
            <p className="cart-panel__empty">No custom shoes yet. Add your first design.</p>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onQtyChange={updateItemQuantity}
              />
            ))
          )}
        </div>

        <div className="cart-panel__footer">
          <div className="cart-panel__subtotal-row">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <button
            type="button"
            className="cart-panel__checkout"
            disabled={!items.length}
            onClick={handleCheckout}
          >
            Checkout
          </button>
          <button type="button" className="cart-panel__continue" onClick={closeCart}>
            Continue Shopping
          </button>
        </div>
      </aside>
    </>
  );
}
