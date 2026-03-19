/**
 * Sneakr.lab - DATASTALGO
 * Step 1: Sneaker model and design selection
 */

import { useDesign } from '../context/DesignContext';
import { useSubscription } from '../context/SubscriptionContext';
import { SNEAKER_MODELS } from '../data/sneakerOptions';

export function SneakerSetup() {
  const { design, setModel } = useDesign();
  const { canAccessAllModels } = useSubscription();

  const models = SNEAKER_MODELS.filter((m) => !m.premiumOnly || canAccessAllModels());

  return (
    <section className="card shadow-sm mb-4 customizer-panel-card">
      <div className="card-body">
        <h2 className="h6 mb-2">Model</h2>
        <p className="text-muted small mb-3">Choose your base silhouette.</p>

        <div className="mb-3">
          <label className="form-label small text-muted mb-2">Shoe Model</label>
          <select
            className="form-select"
            value={design.modelId}
            onChange={(e) => {
              const m = SNEAKER_MODELS.find((x) => x.id === e.target.value);
              if (m) setModel(m.id, m.name);
            }}
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
