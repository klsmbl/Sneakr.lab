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
    <section className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 mb-3">👟 Sneaker Setup</h2>
        <p className="text-muted small mb-3">
          Select your sneaker model below.
        </p>

        <div className="mb-0">
          <label className="form-label">Sneaker Model</label>
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
