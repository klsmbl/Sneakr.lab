import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import AboutUs from './AboutUs';
import FAQ from '../FAQ';
import BusinessForm from '../BusinessForm';
import Footer from '../Footer';

export function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/customizer');
  };

  return (
    <div className="home">
      <header className="header">
        <div className="header__content">
          <div className="header__icons">
            <button className="icon-button" type="button" aria-label="Menu">
              <img src="/menu.png" alt="Menu" className="icon-img" />
            </button>
            <button className="icon-button" type="button" aria-label="Search">
              <img src="/search.png" alt="Search" className="icon-img" />
            </button>
          </div>

          <div className="header__brand">
            <img src="/Sneakr.lab.png" alt="SNEAKR.LAB" className="logo-img" />
          </div>

          <div className="header__icons">
            <button className="icon-button" type="button" aria-label="Cart">
              <img src="/online-shopping.png" alt="Cart" className="icon-img" />
            </button>
            <button className="icon-button" type="button" aria-label="Profile">
              <img src="/user.png" alt="Profile" className="icon-img" />
            </button>
          </div>
        </div>
      </header>

      <section className="hero">

        <div className="hero__body">
          <div className="hero__copy">
            <h1 className="hero__title">Your Sneakers, Your Design</h1>
            <p className="hero__subtitle">
              Build custom kicks using your branding, colors, and creativity
              where ideas become sneakers
            </p>
            <button className="hero__cta" type="button" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
        </div>
      </section>

      <AboutUs />
      <FAQ />
      <BusinessForm />
      <Footer />
    </div>
  );
}
