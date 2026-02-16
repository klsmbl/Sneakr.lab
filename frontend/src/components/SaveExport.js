/**
 * Sneakr.lab - DATASTALGO
 * Save design to PostgreSQL and export (HD for premium)
 */

import { useState, useEffect } from 'react';
import { useDesign } from '../context/DesignContext';
import { useSubscription } from '../context/SubscriptionContext';
import { FREE_SAVED_DESIGNS_LIMIT } from '../context/SubscriptionContext';
import { saveDesign, getDesigns, getDesign } from '../services/api';

export function SaveExport() {
  const { design, setModel, setAccentColor, setLayerColor, setDesign } = useDesign();
  const {
    tier,
    savedDesignsCount,
    canSaveDesign,
    incrementSavedDesigns,
    canExportHD,
  } = useSubscription();

  const [saved, setSaved] = useState(false);
  const [exported, setExported] = useState(false);
  const [message, setMessage] = useState(null);
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(false);

  const canSave = canSaveDesign();
  const canExport = canExportHD();

  useEffect(() => {
    getDesigns()
      .then(setSavedList)
      .catch(() => setSavedList([]));
  }, [saved]);

  async function handleSave() {
    if (!canSave) {
      setMessage(`Free users can save up to ${FREE_SAVED_DESIGNS_LIMIT} designs. Upgrade for unlimited.`);
      return;
    }
    setMessage(null);
    setLoading(true);
    try {
      await saveDesign(design);
      incrementSavedDesigns();
      setSaved(true);
      setMessage('Design saved to database.');
      getDesigns().then(setSavedList);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Failed to save. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  async function handleLoad(id) {
    setMessage(null);
    try {
      const item = await getDesign(id);
      const d = item.design;
      setModel(d.modelId, d.modelName);
      // Load layer colors if available, otherwise fall back to accentColor
      if (d.layerColors) {
        Object.entries(d.layerColors).forEach(([part, color]) => {
          setLayerColor(part, color);
        });
      } else if (d.accentColor) {
        setAccentColor(d.accentColor);
      }
      setDesign(d.designId, d.designName);
      setMessage('Design loaded.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Failed to load design.');
    }
  }

  function handleExport() {
    if (!canExport) {
      setMessage('HD export is available for premium users.');
      return;
    }
    setExported(true);
    setMessage('HD mockup export started (concept only; no file in this demo).');
  }

  return (
    <section className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 mb-3">4. Save & Export</h2>
        <p className="text-muted small mb-3">
          Save your design to the database or export a high-definition mockup (premium).
        </p>

        <div className="d-flex flex-wrap gap-2 mb-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={!canSave || loading}
            onClick={handleSave}
          >
            {loading ? 'Saving…' : saved ? 'Saved' : 'Save design'}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={!canExport || exported}
            onClick={handleExport}
          >
            {exported ? 'Exported' : 'Export HD mockup'}
          </button>
        </div>

        <p className="text-muted small mb-2">
          {tier === 'free'
            ? `Saved: ${savedDesignsCount} / ${FREE_SAVED_DESIGNS_LIMIT} (free). Upgrade for unlimited and HD export.`
            : 'Unlimited saves and HD export.'}
        </p>

        {savedList.length > 0 && (
          <div className="mt-2">
            <label className="form-label small">Saved designs (from database)</label>
            <ul className="list-unstyled small">
              {savedList.slice(0, 10).map((item) => (
                <li key={item.id} className="d-flex align-items-center gap-2 mb-1">
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-primary"
                    onClick={() => handleLoad(item.id)}
                  >
                    Load
                  </button>
                  <span className="text-muted">
                    {item.design.modelName} · {item.design.designName} · {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {message && (
          <div className="alert alert-info small mt-2 mb-0" role="status">
            {message}
          </div>
        )}
      </div>
    </section>
  );
}
