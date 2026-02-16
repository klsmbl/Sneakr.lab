/**
 * Sneakr.lab - DATASTALGO
 * AI-assisted logo generation from text description
 */

import { useState, useCallback } from 'react';
import { useDesign } from '../context/DesignContext';
import { useSubscription } from '../context/SubscriptionContext';
import { FREE_AI_GENERATIONS_PER_DAY } from '../context/SubscriptionContext';

/** Generate a logo image as data URL from the prompt (works without external APIs). */
function generateLogoDataUrl(prompt) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const text = prompt.trim().slice(0, 20) || 'Your Logo';
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, size - 16, size - 16);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2);

  return canvas.toDataURL('image/png');
}

export function AIHelper() {
  const { design, setLogo } = useDesign();
  const {
    tier,
    aiGenerationsUsedToday,
    incrementAiGenerations,
  } = useSubscription();

  const [prompt, setPrompt] = useState(design.logoPrompt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ideas, setIdeas] = useState([]);

  const limit = tier === 'premium' ? Infinity : FREE_AI_GENERATIONS_PER_DAY;
  const remaining = Math.max(0, limit - aiGenerationsUsedToday);
  const canGenerate = remaining > 0 && prompt.trim().length > 0;

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;
    const ok = incrementAiGenerations();
    if (!ok) {
      setError('Daily AI limit reached. Upgrade to premium for unlimited generations.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const mockIdeas = [
        `Logo idea 1: "${prompt}" - minimalist style`,
        `Logo idea 2: "${prompt}" - bold typography`,
        `Logo idea 3: "${prompt}" - geometric shape`,
      ];
      setIdeas(mockIdeas);
      const logoDataUrl = generateLogoDataUrl(prompt);
      setLogo(logoDataUrl, prompt);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'AI generation failed.');
    } finally {
      setLoading(false);
    }
  }, [canGenerate, incrementAiGenerations, prompt, setLogo]);

  return (
    <section className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 mb-3">2. AI Helper</h2>
        <p className="text-muted small mb-3">
          Describe your logo idea in a few words. The AI will suggest ideas and update the mockup.
        </p>

        <div className="mb-3">
          <label className="form-label">Logo idea (short description)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. mountain silhouette, my initials, abstract waves"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="mb-3 d-flex align-items-center gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-primary"
            disabled={!canGenerate || loading}
            onClick={handleGenerate}
          >
            {loading ? 'Generating…' : 'Generate logo ideas'}
          </button>
          <span className="text-muted small">
            {tier === 'premium'
              ? 'Unlimited generations'
              : `${remaining} of ${FREE_AI_GENERATIONS_PER_DAY} left today`}
          </span>
        </div>

        {error && (
          <div className="alert alert-warning small mb-3" role="alert">
            {error}
          </div>
        )}

        {ideas.length > 0 && (
          <div className="mt-2">
            <label className="form-label small">AI suggestions</label>
            <ul className="list-unstyled small text-muted">
              {ideas.map((idea, i) => (
                <li key={i}>{idea}</li>
              ))}
            </ul>
          </div>
        )}

        {design.logoUrl && (
          <div className="mt-3">
            <label className="form-label small">Logo on sneaker</label>
            <p className="small text-muted mb-1">This logo appears on the 3D mockup.</p>
            <img
              src={design.logoUrl}
              alt="Your logo"
              className="rounded border"
              style={{ maxWidth: 80, maxHeight: 80, objectFit: 'contain' }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
