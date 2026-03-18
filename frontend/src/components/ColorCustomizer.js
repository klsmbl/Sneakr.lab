/**
 * Sneakr.lab - DATASTALGO
 * Nike-style color customization
 */

import { useState, useEffect } from 'react';
import { useDesign } from '../context/DesignContext';
import { useSubscription } from '../context/SubscriptionContext';
import { FREE_COLORS, PREMIUM_COLORS, SNEAKER_MODELS } from '../data/sneakerOptions';

export function ColorCustomizer() {
  const { design, setLayerColor } = useDesign();
  const { canUseUnlimitedColors } = useSubscription();
  const [selectedZone, setSelectedZone] = useState('upper');

  // Get color zones for current model
  const currentModel = SNEAKER_MODELS.find(m => m.id === design.modelId);
  const COLOR_ZONES = currentModel?.colorZones || [];

  // Reset selected zone if it doesn't exist on new model
  useEffect(() => {
    const zoneExists = COLOR_ZONES.find(z => z.id === selectedZone);
    if (!zoneExists && COLOR_ZONES.length > 0) {
      setSelectedZone(COLOR_ZONES[0].id);
    }
  }, [design.modelId, COLOR_ZONES, selectedZone]);

  const colors = canUseUnlimitedColors() ? PREMIUM_COLORS : FREE_COLORS;
  const selectedZoneColor = design.layerColors[selectedZone];
  const selectedZoneIndex = Math.max(0, COLOR_ZONES.findIndex((z) => z.id === selectedZone));
  const selectedZoneInfo = COLOR_ZONES[selectedZoneIndex];

  const moveZone = (direction) => {
    if (!COLOR_ZONES.length) return;
    const nextIndex = (selectedZoneIndex + direction + COLOR_ZONES.length) % COLOR_ZONES.length;
    setSelectedZone(COLOR_ZONES[nextIndex].id);
  };

  if (!currentModel || COLOR_ZONES.length === 0) {
    return null; // Don't render if no model selected
  }

  return (
    <section className="card shadow-sm mb-4 customizer-panel-card">
      <div className="card-body">
        <h2 className="h6 mb-2">Customization</h2>
        <p className="text-muted small mb-3">Fine-tune each part with precision.</p>

        <div className="customizer-step-nav">
          <button
            type="button"
            className="customizer-step-nav__arrow"
            onClick={() => moveZone(-1)}
            aria-label="Previous part"
          >
            ←
          </button>
          <div className="customizer-step-nav__label-wrap">
            <span className="customizer-step-nav__label">{selectedZoneInfo?.label || 'Base'}</span>
            <small className="customizer-step-nav__counter">{selectedZoneIndex + 1}/{COLOR_ZONES.length}</small>
          </div>
          <button
            type="button"
            className="customizer-step-nav__arrow"
            onClick={() => moveZone(1)}
            aria-label="Next part"
          >
            →
          </button>
        </div>

        <div className="customizer-zone-chips mb-3">
          {COLOR_ZONES.map((zone) => {
            const isSelected = selectedZone === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                className={`customizer-zone-chip ${isSelected ? 'is-active' : ''}`}
                onClick={() => setSelectedZone(zone.id)}
              >
                {zone.label}
              </button>
            );
          })}
        </div>

        <div className="border-top pt-3">
          <p className="text-muted small mb-3">{selectedZoneInfo?.description}</p>

          <div className="customizer-color-row">
            {colors.map((color) => {
              const isActive = selectedZoneColor === color;

              return (
                <button
                  key={color}
                  type="button"
                  className={`customizer-color-swatch ${isActive ? 'is-active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setLayerColor(selectedZone, color)}
                  title={color}
                  aria-label={`Color ${color}`}
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
