import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDesign } from '../context/DesignContext';
import { StepIndicator } from './StepIndicator';
import { AnimatedBackground } from './AnimatedBackground';
import { Mockup3D } from './Mockup3D';
import { SNEAKER_MODELS } from '../data/sneakerOptions';
import './LandingPage.css';
import './ConfirmSelectionPage.css';

export function ConfirmSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { design, setModel } = useDesign();

  const modelId = searchParams.get('model') || 'classic-1';
  const model = SNEAKER_MODELS.find((m) => m.id === modelId) || SNEAKER_MODELS[0];

  // Update design context with selected model when it changes
  if (design.modelId !== model.id) {
    setModel(model.id, model.name);
  }

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
          {/* Left: 3D model preview */}
          <div className="confirm-page__preview">
            <Mockup3D />
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
