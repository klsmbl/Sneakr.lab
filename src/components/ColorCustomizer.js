/**
 * Sneakr.lab - DATASTALGO
 * Nike-style color customization
 */

import { useState } from 'react';
import { useDesign } from '../context/DesignContext';
import { useSubscription } from '../context/SubscriptionContext';
import { FREE_COLORS, PREMIUM_COLORS } from '../data/sneakerOptions';

const COLOR_ZONES = [
  { id: 'upper', label: 'Upper', description: 'Main body and sides' },
  { id: 'sole', label: 'Sole', description: 'Bottom and midsole' },
  { id: 'accent', label: 'Accents', description: 'Details and highlights' },
];

export function ColorCustomizer() {
  const { design, setLayerColor } = useDesign();
  const { canUseUnlimitedColors } = useSubscription();
  const [selectedZone, setSelectedZone] = useState('upper');

  const colors = canUseUnlimitedColors() ? PREMIUM_COLORS : FREE_COLORS;
  const selectedZoneColor = design.layerColors[selectedZone];

  return (
    <section className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 mb-3">🎨 Color Customization</h2>
        <p className="text-muted small mb-3">
          Choose colors for different zones of your sneaker. Colors are applied intelligently to work with any shoe model!
        </p>

        {/* Quick Color Preview */}
        <div className="mb-3 p-2 bg-light rounded">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <small className="text-muted fw-semibold">Current Colors:</small>
            {COLOR_ZONES.map((zone) => (
              <div key={zone.id} className="d-flex align-items-center gap-1">
                <span
                  className="border border-2"
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: design.layerColors[zone.id],
                    borderRadius: '3px',
                    display: 'inline-block',
                    borderColor: '#ccc',
                  }}
                />
                <small className="text-muted">
                  {zone.label}
                </small>
              </div>
            ))}
          </div>
        </div>

        {/* Zone Selection */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Select Color Zone</label>
          <div className="row g-2">
            {COLOR_ZONES.map((zone) => {
              const isSelected = selectedZone === zone.id;
              const zoneColor = design.layerColors[zone.id];
              
              return (
                <div key={zone.id} className="col-12 col-md-4">
                  <button
                    type="button"
                    className={`btn w-100 text-start ${
                      isSelected ? 'btn-primary' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setSelectedZone(zone.id)}
                    style={{
                      position: 'relative',
                      paddingLeft: '3.5rem',
                      minHeight: '60px',
                    }}
                  >
                    {/* Color Indicator */}
                    <span
                      className="position-absolute start-0 top-50 translate-middle-y ms-2 border border-2"
                      style={{
                        width: 36,
                        height: 36,
                        backgroundColor: zoneColor,
                        borderRadius: '8px',
                        display: 'inline-block',
                        borderColor: '#fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    />
                    <div>
                      <div className="fw-semibold">{zone.label}</div>
                      <small className="text-muted d-block">{zone.description}</small>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Color Picker for Selected Zone */}
        <div className="border-top pt-3">
          <label className="form-label fw-semibold">
            Color for {COLOR_ZONES.find((z) => z.id === selectedZone)?.label}
          </label>
          <p className="text-muted small mb-3">
            {COLOR_ZONES.find((z) => z.id === selectedZone)?.description}
          </p>
          
          <div className="d-flex flex-wrap gap-2">
            {colors.map((color) => {
              const isActive = selectedZoneColor === color;
              
              return (
                <button
                  key={color}
                  type="button"
                  className="btn rounded-circle border border-3 p-0"
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: color,
                    borderColor: isActive ? '#0d6efd' : '#dee2e6',
                    boxShadow: isActive ? '0 0 0 3px rgba(13,110,253,0.25)' : 'none',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                  }}
                  onClick={() => setLayerColor(selectedZone, color)}
                  title={color}
                  aria-label={`Color ${color}`}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                />
              );
            })}
          </div>

          {!canUseUnlimitedColors() && (
            <p className="text-muted small mt-3 mb-0">
              <strong>💎 Premium:</strong> Unlock {PREMIUM_COLORS.length - FREE_COLORS.length} more colors
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
