/**
 * Sneakr.lab - DATASTALGO
 * Step 1: Sneaker model and design selection
 */

import { useDesign } from '../context/DesignContext';
import { useSubscription } from '../context/SubscriptionContext';
import { SNEAKER_MODELS, DESIGNS } from '../data/sneakerOptions';

export function SneakerSetup() {
  const { design, setModel, setDesign } = useDesign();
  const { canAccessAllModels, canUseUnlimitedColors } = useSubscription();

  const models = SNEAKER_MODELS.filter((m) => !m.premiumOnly || canAccessAllModels());
  const designOptions = DESIGNS.filter((d) => !d.premiumOnly || canUseUnlimitedColors());

  return (
    <section className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 mb-3">👟 Sneaker Setup</h2>
        <p className="text-muted small mb-3">
          Currently featuring the Classic Low sneaker. Choose a design pattern below!
        </p>

        <div className="mb-0">
          <label className="form-label">Design Pattern</label>
          <select
            className="form-select"
            value={design.designId}
            onChange={(e) => {
              const d = DESIGNS.find((x) => x.id === e.target.value);
              if (d) setDesign(d.id, d.name);
            }}
          >
            {designOptions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} {d.premiumOnly ? ' (Premium)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
