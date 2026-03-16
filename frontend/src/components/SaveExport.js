/**
 * Sneakr.lab - DATASTALGO
 * Save design to PostgreSQL and export (HD for premium)
 */

import { useState, useEffect } from 'react';
import { useDesign } from '../context/DesignContext';
import { useSubscription } from '../context/SubscriptionContext';
import { FREE_SAVED_DESIGNS_LIMIT } from '../context/SubscriptionContext';
import { saveDesign, getDesigns, getDesign } from '../services/api';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export function SaveExport() {
  const { design, setModel, setAccentColor, setLayerColor, setDesign } = useDesign();
  const {
    tier,
    savedDesignsCount,
    canSaveDesign,
    incrementSavedDesigns,
    canExportHD,
  } = useSubscription();
  const { user } = useUser();
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);
  const [exported, setExported] = useState(false);
  const [message, setMessage] = useState(null);
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const canSave = canSaveDesign();
  const canExport = canExportHD();

  useEffect(() => {
    if (user) {
      getDesigns()
        .then(setSavedList)
        .catch(() => setSavedList([]));
    } else {
      setSavedList([]);
    }
  }, [saved, user]);

  async function handleSave() {
    if (!user) {
      setMessage('Please sign in to save your designs.');
      return;
    }
    if (!canSave) {
      setMessage(`Free users can save up to ${FREE_SAVED_DESIGNS_LIMIT} designs. Upgrade for unlimited.`);
      return;
    }
    
    // Capture the current shoe image
    let shoeImageData = null;
    if (captureFunction) {
      shoeImageData = captureFunction();
      setCapturedImage(shoeImageData);
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
      setLogo(d.logoUrl || null, d.logoPrompt || '');
      setMessage('Design loaded.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Failed to load design.');
    }
  }

  function handleExport() {
    if (!user) {
      setMessage('Please sign in to export your designs.');
      return;
    }
    if (!canExport) {
      setMessage('HD export is available for premium users.');
      return;
    }
    
    // Capture the current shoe image for export
    if (captureFunction) {
      const shoeImageData = captureFunction();
      if (shoeImageData) {
        setCapturedImage(shoeImageData);
        downloadImage(shoeImageData, `sneakr-design-${design.modelName}-${Date.now()}.png`);
        setExported(true);
        setMessage('HD mockup exported and downloaded.');
      } else {
        setMessage('Failed to capture shoe image for export.');
      }
    } else {
      setExported(true);
      setMessage('HD mockup export started (concept only; no file in this demo).');
    }
  }

  function downloadImage(dataURL, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <section className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 mb-3">4. Save & Export</h2>
        {!user && (
          <div className="alert alert-warning small mb-3">
            You are not signed in. <button className="btn btn-link btn-sm p-0" onClick={() => navigate('/signin')}>Sign in</button> to save and manage your designs.
          </div>
        )}
        <p className="text-muted small mb-3">
          Save your design to the database or export a high-definition mockup (premium).
        </p>

        <div className="d-flex flex-wrap gap-2 mb-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={(!canSave && user) || loading}
            onClick={handleSave}
          >
            {loading ? 'Saving…' : saved ? 'Saved' : 'Save design'}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={(!canExport && user) || exported}
            onClick={handleExport}
          >
            {exported ? 'Exported' : 'Export HD mockup'}
          </button>
          {capturedImage && (
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => downloadImage(capturedImage, `sneakr-design-${design.modelName}-${Date.now()}.png`)}
            >
              📱 Download Image
            </button>
          )}
        </div>

        {/* Display captured shoe image */}
        {capturedImage && (
          <div className="mt-3 mb-3">
            <label className="form-label small">Your Custom Shoe Design</label>
            <div className="border rounded p-2 bg-light">
              <img 
                src={capturedImage} 
                alt="Custom Shoe Design" 
                className="img-fluid rounded"
                style={{ maxHeight: '200px', width: 'auto' }}
              />
            </div>
          </div>
        )}

        {user && (
          <p className="text-muted small mb-2">
            {tier === 'free'
              ? `Saved: ${savedDesignsCount} / ${FREE_SAVED_DESIGNS_LIMIT} (free). Upgrade for unlimited and HD export.`
              : 'Unlimited saves and HD export.'}
          </p>
        )}

        {user && savedList.length > 0 && (
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
