/**
 * Sneakr.lab - AI Sneaker Customizer
 * DATASTALGO - Web-based application
 * React JS, Bootstrap, Three.js, subscription-based feature gating
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { CustomizerPage } from './components/CustomizerPage';
import RefundPolicy from './pages/RefundPolicy';
import TermsAndServices from './pages/TermsAndServices';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/customizer" element={<CustomizerPage />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/terms-and-services" element={<TermsAndServices />} />
      </Routes>
    </Router>
  );
}

export default App;
