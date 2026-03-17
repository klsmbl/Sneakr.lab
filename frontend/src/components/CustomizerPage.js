import { SneakerSetup } from './SneakerSetup';
import { ColorCustomizer } from './ColorCustomizer';
import { Mockup3D } from './Mockup3D';
import { SaveExport } from './SaveExport';
import { OrderSummary } from './OrderSummary';
import { CartPanel } from './CartPanel';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import { useState, useCallback } from 'react';
import { useDesign } from '../context/DesignContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CustomizerPage.css';

function CustomizerLayout() {
  const navigate = useNavigate();
  const { design } = useDesign();
  const [captureFunction, setCaptureFunction] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCaptureReady = useCallback((captureFunc) => {
    setCaptureFunction(() => captureFunc);
  }, []);

  const handleTryOnClick = () => {
    localStorage.setItem('sneakr_current_design', JSON.stringify(design));

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

  const proceedToCheckout = () => {
    if (captureFunction) {
      const shoeImageData = captureFunction();
      if (shoeImageData) {
        localStorage.setItem('checkout_shoe_image', shoeImageData);
      }
    }

    localStorage.setItem('checkout_model_name', design.modelName || 'Custom Sneaker Model');
    localStorage.setItem('checkout_design_name', design.designName || 'Custom Design');
    navigate('/checkout');
  };

  return (
    <div className="customizer-shell">
      <header className="customizer-topbar">
        <div className="customizer-topbar__left">
          <button
            className="customizer-back-btn"
            onClick={() => navigate('/')}
            aria-label="Back to home"
          >
            ←
          </button>
          <div>
            <h1 className="customizer-product-name">{design.modelName || 'Custom Sneaker Model'}</h1>
            <p className="customizer-price">Starting at $120</p>
          </div>
        </div>
      </header>

      <main className="customizer-main">
        <section className="customizer-center-stage">
          <Mockup3D onCaptureReady={handleCaptureReady} minimal />
        </section>

        <section className={`customizer-bottom-panel ${menuOpen ? 'is-expanded' : ''}`}>
          <div className="customizer-bottom-panel__core">
            <SneakerSetup />
            <ColorCustomizer />
          </div>

          <div className="customizer-bottom-panel__extra" hidden={!menuOpen}>
            <div className="card shadow-sm mb-4 customizer-panel-card">
              <div className="card-body">
                <h5 className="h6 mb-3">Virtual Try-On</h5>
                <p className="text-muted small mb-3">See how your custom shoe looks on you.</p>
                <button
                  className="btn btn-primary w-100"
                  onClick={handleTryOnClick}
                  disabled={!captureFunction}
                >
                  Try On Your Shoe
                </button>
              </div>
            </div>

            <SaveExport captureFunction={captureFunction} />
            <OrderSummary captureFunction={captureFunction} />
          </div>

          <div className="customizer-bottom-panel__menu-row">
            <div className="customizer-menu-actions" hidden={!menuOpen}>
              <button
                type="button"
                className="customizer-menu-action-btn customizer-menu-action-btn--primary"
                onClick={proceedToCheckout}
              >
                Proceed to Checkout
              </button>
            </div>

            <button
              type="button"
              className="customizer-menu-btn"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
            >
              {menuOpen ? 'Close Menu' : 'Menu'}
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <CartPanel />
    </div>
  );
}

export function CustomizerPage() {
  return <CustomizerLayout />;
}
