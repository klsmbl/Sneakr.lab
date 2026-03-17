/**
 * Sneakr.lab - AI Sneaker Customizer
 * DATASTALGO - Web-based application
 * React JS, Bootstrap, Three.js, subscription-based feature gating
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { LandingPage } from './components/LandingPage';
import { CustomizerPage } from './components/CustomizerPage';
import { SignIn } from './components/SignIn';
import { SubscriptionPage } from './components/SubscriptionPage';
import { TryOnPage } from './components/TryOnPage';
import WhoAreWe from './pages/WhoAreWe';
import RefundPolicy from './pages/RefundPolicy';
import TermsAndServices from './pages/TermsAndServices';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const initialOptions = {
    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID || "ATRRqU_J1bT_qoi8t5Hz9i8ywtTSY2QSzKmv98ur_k_sjcQlCuVwnqd60kRbmQq0GHMK4flVVzGi8d3K",
    currency: "USD",
    intent: "capture",
  };

  return (
    <UserProvider>
      <SubscriptionProvider>
        <PayPalScriptProvider options={initialOptions}>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/customizer" element={<CustomizerPage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/tryon" element={<TryOnPage />} />
              <Route path="/who-are-we" element={<WhoAreWe />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/terms-and-services" element={<TermsAndServices />} />
            </Routes>
          </Router>
        </PayPalScriptProvider>
      </SubscriptionProvider>
    </UserProvider>
  );
}

export default App;
