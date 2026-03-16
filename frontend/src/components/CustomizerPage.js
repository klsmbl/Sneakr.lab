import { SubscriptionProvider } from '../context/SubscriptionContext';
import { DesignProvider } from '../context/DesignContext';
import { SneakerSetup } from './SneakerSetup';
import { ColorCustomizer } from './ColorCustomizer';
import { AIHelper } from './AIHelper';
import { Mockup3D } from './Mockup3D';
import { SaveExport } from './SaveExport';
import { OrderSummary } from './OrderSummary';
import { SubscriptionTierToggle } from './SubscriptionTierToggle';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export function CustomizerPage() {
  const navigate = useNavigate();
  const [captureFunction, setCaptureFunction] = useState(null);

  const handleCaptureReady = useCallback((captureFunc) => {
    setCaptureFunction(() => captureFunc);
  }, []);

  const handleTryOnClick = () => {
    if (captureFunction) {
      const shoeImageData = captureFunction();
      if (shoeImageData) {
        localStorage.setItem('shoe_image', shoeImageData);
        navigate('/tryon');
      } else {
        alert('Failed to capture shoe image. Please try again.');
      }
    }
  };

  return (
    <SubscriptionProvider>
      <DesignProvider>
        <div style={{ minHeight: '100vh', padding: 0, margin: 0 }}>
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
              preview in 3D, and use AI to generate your unique logo. Free users have limited access; premium unlocks all features.
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

          </div>
          <Footer />
        </div>
      </DesignProvider>
    </SubscriptionProvider>
  );
}
