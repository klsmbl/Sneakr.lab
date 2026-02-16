import { SubscriptionProvider } from '../context/SubscriptionContext';
import { DesignProvider } from '../context/DesignContext';
import { SneakerSetup } from './SneakerSetup';
import { ColorCustomizer } from './ColorCustomizer';
import { Mockup3D } from './Mockup3D';
import { SaveExport } from './SaveExport';
import { OrderSummary } from './OrderSummary';
import { SubscriptionTierToggle } from './SubscriptionTierToggle';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export function CustomizerPage() {
  const navigate = useNavigate();

  return (
    <SubscriptionProvider>
      <DesignProvider>
        <div className="container py-4">
          <header className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom">
            <div className="d-flex align-items-center gap-3">
              <button 
                className="btn btn-sm btn-outline-secondary" 
                onClick={() => navigate('/')}
              >
                ← Back to Home
              </button>
              <h1 className="h3 mb-0">Sneakr.lab</h1>
            </div>
            <SubscriptionTierToggle />
          </header>
          <p className="text-muted small mb-4">
            Design your sneaker with Nike-style layer customization! Customize each part's color,
            preview in 3D, then save or export. Free users have limited access; premium unlocks all features.
          </p>

          <div className="row">
            <div className="col-lg-6">
              <SneakerSetup />
              <ColorCustomizer />
              <SaveExport />
              <OrderSummary />
            </div>
            <div className="col-lg-6">
              <Mockup3D />
            </div>
          </div>

          <footer className="mt-5 pt-3 border-top text-muted small">
            Sneakr.lab — DATASTALGO project. React JS, Bootstrap, Three.js with Nike-style customization.
          </footer>
        </div>
      </DesignProvider>
    </SubscriptionProvider>
  );
}
