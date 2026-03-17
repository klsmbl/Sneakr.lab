import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './LandingPage.css';
import { AnimatedBackground } from './AnimatedBackground';
import FAQ from '../FAQ';
import BusinessForm from '../BusinessForm';
import Footer from '../Footer';
import { useUser } from '../context/UserContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useCart } from '../context/CartContext';
import { CartPanel } from './CartPanel';

const HOW_TO_STEPS = [
  {
    num: '01',
    title: 'Step 1: Choose Your Shoe Style',
    bullets: [
      'Browse multiple customizable shoe models',
      'Select the base shoe you want to design',
      'Click Customize to begin designing',
    ],
  },
  {
    num: '02',
    title: 'Step 2: Design Your Custom Shoes',
    bullets: [
      'Change colors and materials',
      'Add logos, text, or graphics',
      'Adjust and position design elements easily',
    ],
  },
  {
    num: '03',
    title: 'Step 3: Order Your Shoes',
    bullets: [
      'Review your custom design',
      'Select your size and quantity',
      'Proceed to checkout and place your order',
    ],
  },
];

function HowToSection({ onGetStarted }) {
  return (
    <section className="howto">
      <div className="howto__inner">
        <div className="howto__head">
          <h2 className="howto__title">How to Customize Your Own Shoes</h2>
          <p className="howto__subtitle">Customize your shoes in three simple steps.</p>
        </div>

        <div className="howto__grid">
          {HOW_TO_STEPS.map((step) => (
            <div key={step.num} className="howto__card">
              <div className="howto__card-mockup">
                <img
                  src="/placeholder-ui.svg"
                  alt="UI mockup"
                  className="howto__card-mockup-img"
                />
              </div>
              <div className="howto__card-top">
                <span className="howto__card-num">{step.num}</span>
              </div>
              <h3 className="howto__card-title">{step.title}</h3>
              <ul className="howto__card-list">
                {step.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="howto__cta-wrap">
          <button className="howto__cta" onClick={onGetStarted}>
            Start Designing Your Shoes →
          </button>
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { tier } = useSubscription();
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    if (location.state?.scrollTo === 'faq') {
      setTimeout(() => {
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [location.state]);

  const handleGetStarted = () => {
    navigate('/choose-shoe');
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/account');
    } else {
      navigate('/signin');
    }
  };

  const handleUpgradeClick = () => {
    if (!user) {
      navigate('/signin');
    } else {
      navigate('/subscription');
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
            <button className="icon-button icon-button--cart" type="button" aria-label="Cart" onClick={openCart}>
              <img src="/online-shopping.png" alt="Cart" className="icon-img" />
              {itemCount > 0 && <span className="icon-button__badge">{itemCount}</span>}
            </button>
            <button className="icon-button" type="button" aria-label="Profile" onClick={handleProfileClick}>
              <img src="/user.png" alt="Profile" className="icon-img" title={user ? 'My Account' : 'Sign In'} />
            </button>
            {user && (
              <button
                className={`header-upgrade-btn${tier === 'premium' ? ' is-premium' : ''}`}
                type="button"
                onClick={handleUpgradeClick}
              >
                {tier === 'premium' ? 'Premium' : 'Upgrade'}
              </button>
            )}
            {!user && (
              <button className="header-auth-btn" type="button" onClick={() => navigate('/signin')}>
                Sign In / Create Account
              </button>
            )}
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

      <HowToSection onGetStarted={handleGetStarted} />

      <div className="concept-divider">
        <h2 className="concept-divider__heading">From Concept to Custom Footwear</h2>
        <p className="concept-divider__sub">See how we turn blank shoes into fully custom branded footwear.</p>
      </div>

      <FAQ />
      <BusinessForm />
      <Footer />
      <CartPanel />
    </div>
  );
}
