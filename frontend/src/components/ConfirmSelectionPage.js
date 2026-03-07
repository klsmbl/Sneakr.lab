import { useNavigate, useSearchParams } from 'react-router-dom';
import { StepIndicator } from './StepIndicator';
import { AnimatedBackground } from './AnimatedBackground';
import { SNEAKER_MODELS } from '../data/sneakerOptions';
import './LandingPage.css';
import './ConfirmSelectionPage.css';

export function ConfirmSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const modelId = searchParams.get('model') || 'classic-1';
  const model = SNEAKER_MODELS.find((m) => m.id === modelId) || SNEAKER_MODELS[0];

  const handleProceed = () => {
    localStorage.setItem('sneakr_selected_model', model.id);
    localStorage.setItem('sneakr_selected_model_name', model.name);
    navigate('/customizer');
  };

  return (
    <div className="home">
      <AnimatedBackground />

      <header className="header">
        <div className="header__content">
          <div className="header__brand" onClick={() => navigate('/')}>
            <img src="/Sneakr.lab.png" alt="SNEAKR.LAB" className="logo-img" />
          </div>
          <div className="header__icons">
            <button className="nav-link" onClick={() => navigate('/choose-shoe')}>
              ← Back
            </button>
          </div>
        </div>
      </header>

      <div className="confirm-page">
        <StepIndicator currentStep={2} />

        <div className="confirm-page__content">
          {/* Left: placeholder preview */}
          <div className="confirm-page__preview">
            <div className="confirm-page__placeholder">
              <span className="confirm-page__placeholder-icon">{model.icon}</span>
              <span className="confirm-page__placeholder-text">3D Preview</span>
              <span className="confirm-page__placeholder-sub">coming soon</span>
            </div>
          </div>

          {/* Right: info + actions */}
          <div className="confirm-page__info">
            <span className="confirm-page__cat">{model.category}</span>
            <h1 className="confirm-page__name">{model.name}</h1>
            <p className="confirm-page__desc">{model.description}</p>

            {model.premiumOnly && (
              <div className="confirm-page__premium-note">
                ⭐ Premium Model — Unlocks all customization features
              </div>
            )}

            <div className="confirm-page__actions">
              <button
                className="confirm-page__btn confirm-page__btn--back"
                onClick={() => navigate('/choose-shoe')}
              >
                ← Change Shoe
              </button>
              <button
                className="confirm-page__btn confirm-page__btn--proceed"
                onClick={handleProceed}
              >
                Proceed to Customize →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
