import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';
import { SNEAKER_MODELS } from '../data/sneakerOptions';
import { StepIndicator } from './StepIndicator';
import { AnimatedBackground } from './AnimatedBackground';
import './LandingPage.css';
import './ShoeSelectionPage.css';

export function ShoeSelectionPage() {
  const navigate = useNavigate();
  const { canAccessAllModels } = useSubscription();

  const handleSelect = (model) => {
    navigate(`/confirm-shoe?model=${model.id}&name=${encodeURIComponent(model.name)}`);
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
            <button className="nav-link" onClick={() => navigate('/')}>
              ← Back to Home
            </button>
          </div>
        </div>
      </header>

      <div className="selection-page">
        <StepIndicator currentStep={1} />

        <div className="selection-page__header">
          <h1 className="selection-page__title">Choose Your Shoe</h1>
          <p className="selection-page__subtitle">
            Select a silhouette to begin your custom design journey
          </p>
        </div>

        <div className="shoe-grid">
          {SNEAKER_MODELS.map((model) => {
            const isLocked = model.premiumOnly && !canAccessAllModels();
            return (
              <div
                key={model.id}
                className={`shoe-card${isLocked ? ' shoe-card--locked' : ''}`}
              >
                <div className="shoe-card__image">
                  <span className="shoe-card__icon">{model.icon}</span>
                  {model.premiumOnly && (
                    <span className="shoe-card__premium-badge">⭐ Premium</span>
                  )}
                </div>
                <div className="shoe-card__body">
                  <span className="shoe-card__category">{model.category}</span>
                  <h3 className="shoe-card__name">{model.name}</h3>
                  <p className="shoe-card__desc">{model.description}</p>
                  <button
                    className={`shoe-card__btn${isLocked ? ' shoe-card__btn--locked' : ''}`}
                    onClick={() =>
                      isLocked ? navigate('/subscription') : handleSelect(model)
                    }
                  >
                    {isLocked ? '🔒 Unlock Premium' : 'Select'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
