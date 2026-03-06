import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { AnimatedBackground } from './AnimatedBackground';
import FAQ from '../FAQ';
import BusinessForm from '../BusinessForm';
import Footer from '../Footer';
import { useUser } from '../context/UserContext';

export function LandingPage() {
  const navigate = useNavigate();
  const { user, signOut } = useUser();

  const handleGetStarted = () => {
    navigate('/customizer');
  };

  const handleProfileClick = () => {
    if (user) {
      if (window.confirm('Do you want to sign out?')) {
        signOut();
      }
    } else {
      navigate('/signin');
    }
  };

  return (
    <div className="home">
      <AnimatedBackground />
      <header className="header">
        <div className="header__content">
          <div className="header__brand">
            <img src="/Sneakr.lab.png" alt="SNEAKR.LAB" className="logo-img" />
          </div>

          <nav className="header__nav">
            <button className="nav-link" onClick={handleGetStarted}>Design a Custom Shoe</button>
            <button className="nav-link" onClick={() => document.getElementById('business-form')?.scrollIntoView({ behavior: 'smooth' })}>Branded Business Shoes</button>
          </nav>

          <div className="header__icons">
            {user && <span className="user-email">{user.email} ({user.role})</span>}
            <button className="icon-button" type="button" aria-label="Cart">
              <img src="/online-shopping.png" alt="Cart" className="icon-img" />
            </button>
            <button className="icon-button" type="button" aria-label="Profile" onClick={handleProfileClick}>
              <img src="/user.png" alt="Profile" className="icon-img" title={user ? 'Sign Out' : 'Sign In'} />
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
              {user ? 'Continue Designing' : 'Get Started'}
            </button>
          </div>
        </div>
      </section>

      <FAQ />
      <BusinessForm />
      <Footer />
    </div>
  );
}
