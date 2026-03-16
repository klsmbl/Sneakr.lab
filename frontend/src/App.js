/**
 * Sneakr.lab - AI Sneaker Customizer
 * DATASTALGO - Web-based application
 * React JS, Bootstrap, Three.js, subscription-based feature gating
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { CustomizerPage } from './components/CustomizerPage';
import { SignIn } from './components/SignIn';
import { SubscriptionPage } from './components/SubscriptionPage';
import { UserProvider } from './context/UserContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import RefundPolicy from './pages/RefundPolicy';
import TermsAndServices from './pages/TermsAndServices';
import WhoAreWe from './pages/WhoAreWe';
import './App.css';

function App() {
  return (
    <UserProvider>
      <SubscriptionProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/customizer" element={<CustomizerPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms" element={<TermsAndServices />} />
            <Route path="/who-are-we" element={<WhoAreWe />} />
          </Routes>
        </Router>
      </SubscriptionProvider>
    </UserProvider>
  );
}

export default App;
