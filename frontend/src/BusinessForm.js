import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusinessForm.css';

const ROTATING_SHOES = [
  { label: 'Better RX', imageSrc: '/better rx.webp', imageAlt: 'Better RX branded sneaker', imageOnly: true },
  { label: 'CHG', imageSrc: '/chg.webp', imageAlt: 'CHG branded sneaker', imageOnly: true },
  { label: 'Core V1', imageSrc: '/core v1.webp', imageAlt: 'Core V1 branded sneaker', imageOnly: true },
  { label: 'Corporate Edition', imageSrc: '/adblueshoe.webp', imageAlt: 'Blue branded sneaker', imageOnly: true },
  { label: 'Team Collection', imageSrc: '/adyellowshoe.webp', imageAlt: 'Yellow branded sneaker', imageOnly: true },
  { label: 'Net Jets', imageSrc: '/net jets.webp', imageAlt: 'Net Jets branded sneaker', imageOnly: true },
];

function getRandomCards(cards, count = 3) {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result.slice(0, count);
}

function BusinessForm() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [rotatingCards, setRotatingCards] = useState(() => getRandomCards(ROTATING_SHOES));
  const [rotationCycle, setRotationCycle] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.08 }
    );
    if (sectionEl) observer.observe(sectionEl);
    return () => { if (sectionEl) observer.unobserve(sectionEl); };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRotatingCards(getRandomCards(ROTATING_SHOES));
      setRotationCycle((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phoneNumber: '',
    estimatedShoes: '',
    eventDate: '',
    extraNotes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Business Form Data:', formData);
    setFormData({ fullName: '', businessName: '', email: '', phoneNumber: '', estimatedShoes: '', eventDate: '', extraNotes: '' });
  };

  return (
    <section
      id="business-form"
      className={`bf ${isVisible ? 'bf--visible' : ''}`}
      ref={sectionRef}
    >
      <div className="bf__container">

        {/* Section header */}
        <div className="bf__header">
          <p className="bf__eyebrow">For Brands, Teams & Events</p>
          <h2 className="bf__title">Custom Branded Sneakers<br/>for Your Business</h2>
          <p className="bf__description">
            Partner with Sneakr.lab to create fully custom footwear at scale — from corporate gifting
            and brand launches to team uniforms and event merchandise.
          </p>
        </div>

        {/* Two-column body */}
        <div className="bf__body">

          {/* ── Left: showcase ── */}
          <div className="bf__showcase">

            {/* Large hero placeholder */}
            <div className="bf__hero-placeholder">
              <video
                className="bf__hero-video"
                src="/adshoes.mp4"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Branded shoes showcase video"
              />
            </div>

            {/* Three small example cards */}
            <div className="bf__cards">
              {rotatingCards.map((card, index) => (
                <div key={`${rotationCycle}-${index}-${card.label}`} className={`bf__card${card.imageOnly ? ' bf__card--image-only' : ''}`}>
                  {card.imageSrc ? (
                    <img className="bf__card-image bf__card-image--fade-in" src={card.imageSrc} alt={card.imageAlt} />
                  ) : (
                    <div className="bf__card-thumb" aria-hidden="true">👟</div>
                  )}
                  {!card.imageOnly && (
                    <div className="bf__card-info">
                      <span className="bf__card-name">{card.label}</span>
                      <span className="bf__card-tag">{card.tag}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="bf__form-wrap">

            <form className="bf__form" onSubmit={handleSubmit} noValidate>

              <div className="bf__grid">

                <div className="bf__field">
                  <label htmlFor="fullName" className="bf__label">Name</label>
                  <input type="text" id="fullName" name="fullName" value={formData.fullName}
                    onChange={handleInputChange} placeholder="John Doe" required />
                </div>

                <div className="bf__field">
                  <label htmlFor="businessName" className="bf__label">Business Name</label>
                  <input type="text" id="businessName" name="businessName" value={formData.businessName}
                    onChange={handleInputChange} placeholder="Your Company" required />
                </div>

                <div className="bf__field">
                  <label htmlFor="email" className="bf__label">Email</label>
                  <input type="email" id="email" name="email" value={formData.email}
                    onChange={handleInputChange} placeholder="john@company.com" required />
                </div>

                <div className="bf__field">
                  <label htmlFor="phoneNumber" className="bf__label">Phone Number</label>
                  <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber}
                    onChange={handleInputChange} placeholder="+63 (912) 345-6789" required />
                </div>

                <div className="bf__field">
                  <label htmlFor="estimatedShoes" className="bf__label">Estimated Order Quantity</label>
                  <input type="number" id="estimatedShoes" name="estimatedShoes" value={formData.estimatedShoes}
                    onChange={handleInputChange} placeholder="250" min="1" required />
                </div>

                <div className="bf__field">
                  <label htmlFor="eventDate" className="bf__label">
                    Event Date <span className="bf__optional">(Optional)</span>
                  </label>
                  <input type="date" id="eventDate" name="eventDate" value={formData.eventDate}
                    onChange={handleInputChange} />
                </div>

                <div className="bf__field bf__field--full">
                  <label htmlFor="extraNotes" className="bf__label">Project Description</label>
                  <textarea id="extraNotes" name="extraNotes" value={formData.extraNotes}
                    onChange={handleInputChange}
                    placeholder="Tell us about your brand, timeline, and any special requirements…"
                    rows="4" />
                </div>
              </div>

              <button type="submit" className="bf__submit">Book a Call</button>

              <p className="bf__disclaimer">
                By submitting, you agree to occasional SMS updates. Msg &amp; data rates may apply.{' '}
                <button type="button" onClick={() => navigate('/terms')} className="bf__terms-link">
                  Terms &amp; Services
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BusinessForm;
