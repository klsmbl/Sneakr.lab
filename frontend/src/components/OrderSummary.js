/**
 * Sneakr.lab - DATASTALGO
 * Order summary: design details, quantity, size, subtotal, discount, total
 */

import { useState } from 'react';
import { useDesign } from '../context/DesignContext';
import { useSubscription } from '../context/SubscriptionContext';

const UNIT_PRICE = 120;
const DISCOUNT_PERCENT_PREMIUM = 10;

export function OrderSummary() {
  const { design } = useDesign();
  const { tier } = useSubscription();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('US 9');

  const discountPercent = tier === 'premium' ? DISCOUNT_PERCENT_PREMIUM : 0;
  const subtotal = quantity * UNIT_PRICE;
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  const isReadOnly = tier === 'free';

  return (
    <section className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 mb-3">Order Summary (Concept)</h2>
        <p className="text-muted small mb-3">
          Design details, quantity, size, and computed total. Read-only for free users.
        </p>

        <dl className="row small mb-2">
          <dt className="col-sm-4">Model</dt>
          <dd className="col-sm-8">{design.modelName}</dd>
          <dt className="col-sm-4">Design</dt>
          <dd className="col-sm-8">{design.designName}</dd>
          <dt className="col-sm-4">Colors</dt>
          <dd className="col-sm-8">
            <div className="d-flex flex-wrap gap-1">
              {Object.entries(design.layerColors).slice(0, 5).map(([part, color]) => (
                <span
                  key={part}
                  className="d-inline-block rounded border"
                  style={{ width: 20, height: 20, backgroundColor: color }}
                  title={`${part}: ${color}`}
                />
              ))}
            </div>
          </dd>
        </dl>

        <div className="mb-2">
          <label className="form-label small">Quantity</label>
          <input
            type="number"
            className="form-control form-control-sm"
            min={1}
            max={10}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            readOnly={isReadOnly}
          />
        </div>
        <div className="mb-3">
          <label className="form-label small">Size</label>
          <select
            className="form-select form-select-sm"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            disabled={isReadOnly}
          >
            {['US 7', 'US 8', 'US 9', 'US 10', 'US 11'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <hr />
        <div className="small">
          <div className="d-flex justify-content-between">
            <span>Subtotal ({quantity} × ${UNIT_PRICE})</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discountPercent > 0 && (
            <div className="d-flex justify-content-between text-success">
              <span>Discount ({discountPercent}%)</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="d-flex justify-content-between fw-bold mt-1">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        {isReadOnly && (
          <p className="text-muted small mt-2 mb-0">Upgrade to premium to edit and proceed.</p>
        )}
      </div>
    </section>
  );
}
