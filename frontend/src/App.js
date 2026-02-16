import './App.css';
import FAQ from './FAQ';
import BusinessForm from './BusinessForm';
import Footer from './Footer';

function App() {
  return (
    <div className="home">
      <section className="hero">
        <header className="hero__top">
          <div className="hero__icons">
            <button className="icon-button" type="button" aria-label="Menu">
              <img src="/menu.png" alt="Menu" className="icon-img" />
            </button>
            <button className="icon-button" type="button" aria-label="Search">
              <img src="/search.png" alt="Search" className="icon-img" />
            </button>
          </div>

          <div className="hero__brand">
            <img src="/Sneakr.lab.png" alt="SNEAKR.LAB" className="logo-img" />
          </div>

          <div className="hero__icons">
            <button className="icon-button" type="button" aria-label="Cart">
              <img src="/online-shopping.png" alt="Cart" className="icon-img" />
            </button>
            <button className="icon-button" type="button" aria-label="Profile">
              <img src="/user.png" alt="Profile" className="icon-img" />
            </button>
          </div>
        </header>

        <div className="hero__body">
          <div className="hero__art" aria-hidden="true">
            <div className="diagonal" />
            <img src="/81708007-12fe-48d1-9d12-4096818c7fbe-removebg-preview.png" alt="Blue sneaker" className="shoe shoe--left" />
            <img src="/de9baa48-6311-4b64-b5a6-a70d6655597a-removebg-preview.png" alt="Purple sneaker" className="shoe shoe--right" />
          </div>

          <div className="hero__copy">
            <h1 className="hero__title">Your Sneakers, Your Design</h1>
            <p className="hero__subtitle">
              Build custom kicks using your branding, colors, and creativity
              where ideas become sneakers
            </p>
            <button className="hero__cta" type="button">
              Get Started
            </button>
          </div>

          <div className="hero__pills" aria-hidden="true">
            <span className="pill pill--light" />
            <span className="pill pill--mid" />
            <span className="pill pill--dark" />
          </div>
        </div>
      </section>

      <FAQ />
      <BusinessForm />
      <Footer />
    </div>
  );
}

export default App;
