/**
 * Sneakr.lab - AI Sneaker Customizer
 * DATASTALGO - Web-based application
 * React JS, Bootstrap, Three.js, subscription-based feature gating
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { CustomizerPage } from './components/CustomizerPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import FAQ from './FAQ';
import BusinessForm from './BusinessForm';
import Footer from './Footer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/customizer" element={<CustomizerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
