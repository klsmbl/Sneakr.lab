import { useEffect, useState } from 'react';
import './ContactUs.css';
import Footer from '../Footer';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus('Your message has been received. We will get back to you shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero__content">
          <p className="contact-hero__eyebrow">SUPPORT</p>
          <h1 className="contact-hero__title">Contact Us</h1>
          <h2 className="contact-hero__subtitle">Need Help? We're Here for You</h2>
          <p className="contact-hero__desc">
            Whether you have a question about your custom sneaker design, an existing order, or business
            collaborations, our team is ready to assist you.
          </p>
          <p className="contact-hero__desc">
            We aim to respond to all inquiries as quickly as possible so you can get back to creating your
            perfect pair of sneakers.
          </p>
        </div>
      </section>

      <main className="contact-content">
        <section className="contact-section">
          <h3 className="contact-section__title">How Can We Help?</h3>
          <div className="contact-help-grid">
            <article className="contact-help-card">
              <h4>Customer Support</h4>
              <p>
                Need help with your order, customization process, or sizing? Our support team is here to
                guide you every step of the way.
              </p>
            </article>

            <article className="contact-help-card">
              <h4>Business Inquiries</h4>
              <p>
                Looking to create custom branded sneakers for your company, event, or team? Contact our
                business team to discuss bulk orders and branding options.
              </p>
            </article>

            <article className="contact-help-card">
              <h4>Technical Support</h4>
              <p>
                Experiencing issues with the sneaker customizer or website features? Let us know and we'll
                help resolve it quickly.
              </p>
            </article>
          </div>
        </section>

        <section className="contact-grid-section">
          <section className="contact-panel contact-panel--form">
            <h3 className="contact-section__title">Send Us a Message</h3>
            <p className="contact-panel__subtitle">
              Fill out the form below and a member of our team will get back to you shortly.
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                required
              />

              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              />

              <button className="contact-submit" type="submit">
                Send Message
              </button>

              {status && <p className="contact-status">{status}</p>}
            </form>
          </section>

          <aside className="contact-panel contact-panel--info">
            <h3 className="contact-section__title">Contact Information</h3>
            <p>
              <span className="contact-info__label">Email:</span> team.sneakrlab@gmail.com
            </p>
            <p>
              <span className="contact-info__label">Business inquiries:</span> business.sneakrlab@gmail.com
            </p>
            <p className="contact-info__note">
              Our team typically responds within 24-48 hours during business days.
            </p>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ContactUs;
