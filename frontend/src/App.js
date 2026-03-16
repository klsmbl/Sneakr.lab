/**
 * Sneakr.lab - AI Sneaker Customizer
 * DATASTALGO - Web-based application
 * React JS, Bootstrap, Three.js, subscription-based feature gating
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { CustomizerPage } from './components/CustomizerPage';
import { ShoeSelectionPage } from './components/ShoeSelectionPage';
import { ConfirmSelectionPage } from './components/ConfirmSelectionPage';
import { SignIn } from './components/SignIn';
import { SubscriptionPage } from './components/SubscriptionPage';
import { UserProvider } from './context/UserContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { CartProvider } from './context/CartContext';
import RefundPolicy from './pages/RefundPolicy';
import TermsAndServices from './pages/TermsAndServices';
import WhoAreWe from './pages/WhoAreWe';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function AppRoutes() {
  const location = useLocation();
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  useEffect(() => {
    const shouldShowLoader = Boolean(location.state?.showFooterLoader);

    if (!shouldShowLoader) {
      setIsRouteLoading(false);
      return;
    }

    setIsRouteLoading(true);
    const timer = setTimeout(() => {
      setIsRouteLoading(false);
    }, 520);

    return () => clearTimeout(timer);
  }, [location.pathname, location.state]);

  return (
    <>
      {isRouteLoading && (
        <div className="route-loader" role="status" aria-live="polite" aria-label="Loading page">
          <div className="route-loader__brand-wrap" aria-hidden="true">
            <div className="route-loader__brand-mark">SL</div>
            <p className="route-loader__wordmark">SNEAKR.LAB</p>
          </div>
          <div className="route-loader__progress" aria-hidden="true">
            <span className="route-loader__progress-bar" />
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/customizer" element={<CustomizerPage />} />
        <Route path="/choose-shoe" element={<ShoeSelectionPage />} />
        <Route path="/confirm-shoe" element={<ConfirmSelectionPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/terms" element={<TermsAndServices />} />
        <Route path="/who-are-we" element={<WhoAreWe />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/how-to-measure-shoe-size" element={<BlogArticle />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <SubscriptionProvider>
        <CartProvider>
          <Router>
            <AppRoutes />
          </Router>
        </CartProvider>
      </SubscriptionProvider>
    </UserProvider>
  );
}

export default App;
