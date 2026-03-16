import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './PrivacyPolicy.css';
import Footer from '../Footer';

function PrivacyPolicy() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEmbed = new URLSearchParams(location.search).get('embed') === '1';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`privacy-policy ${isEmbed ? 'privacy-policy--embed' : ''}`}>
      <div className="privacy-policy__container">
        {!isEmbed && (
          <button
            className="privacy-policy__back"
            onClick={() => navigate('/')}
            aria-label="Go back to homepage"
          >
            ← Back to Home
          </button>
        )}

        <div className="privacy-policy__header">
          <h1 className="privacy-policy__title">Privacy Policy</h1>
          <p className="privacy-policy__updated">Last Updated: March 17, 2026</p>
        </div>

        <section className="privacy-section">
          <h2 className="privacy-section__title">1. Overview</h2>
          <div className="privacy-section__content">
            <p>
              Sneakr.lab respects your privacy and is committed to protecting your personal information.
              This Privacy Policy explains what data we collect, how we use it, and the choices you have
              regarding your information.
            </p>
            <p>
              By using our website, customizer tools, checkout services, and related features, you agree to
              the practices described in this policy.
            </p>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section__title">2. Information We Collect</h2>
          <div className="privacy-section__content">
            <p>We may collect the following categories of information:</p>
            <ul className="privacy-list">
              <li>
                <strong>Account Data:</strong> Name, email address, and login credentials when you create
                an account.
              </li>
              <li>
                <strong>Order Data:</strong> Shipping address, billing details, order history, and sizing
                preferences.
              </li>
              <li>
                <strong>Design Data:</strong> Uploaded artwork, chosen colors, logos, text, and other
                custom sneaker configurations.
              </li>
              <li>
                <strong>Technical Data:</strong> Device type, browser version, IP address, and activity
                logs used for platform security and diagnostics.
              </li>
            </ul>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section__title">3. How We Use Your Information</h2>
          <div className="privacy-section__content">
            <p>We process personal information to:</p>
            <ul className="privacy-list">
              <li>Provide account access and authenticate users securely.</li>
              <li>Process payments, fulfill orders, and send shipping updates.</li>
              <li>Render and store your custom sneaker designs for production.</li>
              <li>Improve platform performance and user experience.</li>
              <li>Respond to support requests and resolve technical issues.</li>
              <li>Communicate important legal, billing, and policy notices.</li>
            </ul>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section__title">4. Legal Bases for Processing</h2>
          <div className="privacy-section__content">
            <p>
              Depending on your location, we rely on one or more legal bases for processing, including
              contractual necessity, legitimate business interests, legal obligations, and consent where
              required.
            </p>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section__title">5. Cookies and Tracking</h2>
          <div className="privacy-section__content">
            <p>
              We use cookies and similar technologies to keep you signed in, remember preferences, analyze
              traffic patterns, and improve platform stability.
            </p>
            <p>
              You can control cookies through browser settings, but disabling essential cookies may limit
              certain features of the website.
            </p>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section__title">6. Sharing of Information</h2>
          <div className="privacy-section__content">
            <p>We may share information with trusted service providers only when necessary, such as:</p>
            <ul className="privacy-list">
              <li>Payment processors for secure transaction handling.</li>
              <li>Shipping partners for order delivery and tracking.</li>
              <li>Cloud and infrastructure providers for hosting and reliability.</li>
              <li>Legal authorities when required by law or valid legal process.</li>
            </ul>
            <p>
              We do not sell your personal information to third parties for unrelated advertising purposes.
            </p>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section__title">7. Data Retention</h2>
          <div className="privacy-section__content">
            <p>
              We retain personal data only for as long as reasonably necessary to provide services,
              maintain legal records, resolve disputes, and enforce agreements.
            </p>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section__title">8. Security Measures</h2>
          <div className="privacy-section__content">
            <p>
              We use administrative, technical, and physical safeguards designed to protect personal
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p>
              While no method is completely secure, we continuously review and improve our protective
              controls.
            </p>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section__title">9. Your Privacy Rights</h2>
          <div className="privacy-section__content">
            <p>You may have rights to access, update, delete, or export your data depending on local laws.</p>
            <p>
              You may also request restriction of processing or object to certain processing activities.
              Requests can be submitted through our support channels.
            </p>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section__title">10. International Data Transfers</h2>
          <div className="privacy-section__content">
            <p>
              If you access our services from outside the country where our primary systems are hosted,
              your information may be transferred across international borders.
            </p>
            <p>
              Where required, we use appropriate safeguards to help protect transferred data and maintain
              a level of protection consistent with applicable data protection regulations.
            </p>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section__title">11. Children's Privacy</h2>
          <div className="privacy-section__content">
            <p>
              Our platform is not directed to children under the age of 13, and we do not knowingly
              collect personal information from children.
            </p>
            <p>
              If you believe a child has submitted personal information to us, please contact us so we can
              investigate and take appropriate action.
            </p>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section__title">12. Account and Communication Preferences</h2>
          <div className="privacy-section__content">
            <p>
              You can update your account profile and communication preferences at any time through your
              account settings where available.
            </p>
            <p>
              You may opt out of non-essential marketing messages by using unsubscribe links in emails.
              Service-related messages such as order confirmations and security alerts may still be sent
              when necessary.
            </p>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section__title">13. Payment Information</h2>
          <div className="privacy-section__content">
            <p>
              Payments are processed by third-party payment providers that maintain their own security and
              compliance standards. We do not store full card numbers or full payment authentication data
              on our platform.
            </p>
            <p>
              Payment transactions are encrypted in transit and are subject to the terms and privacy
              practices of the payment provider used at checkout.
            </p>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section__title">14. Data Breach Response</h2>
          <div className="privacy-section__content">
            <p>
              We maintain incident response procedures designed to identify, contain, and assess potential
              security events.
            </p>
            <p>
              If a data incident is determined to create a significant risk to individuals, we will notify
              affected users and relevant authorities in accordance with applicable legal requirements.
            </p>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section__title">15. Third-Party Services and Links</h2>
          <div className="privacy-section__content">
            <p>
              Our platform may include links to third-party websites, integrations, or social platforms.
              These external services operate independently and may have different privacy practices.
            </p>
            <p>
              We recommend reviewing the privacy policies of third-party services before sharing
              information with them.
            </p>
          </div>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-section__title">16. Policy Updates</h2>
          <div className="privacy-section__content">
            <p>
              We may update this Privacy Policy from time to time to reflect legal, technical, or
              operational changes.
            </p>
            <p>
              When updates are made, we revise the Last Updated date and may provide additional notice for
              material changes where required.
            </p>
          </div>
        </section>

        <section className="privacy-section privacy-section--contact">
          <h2 className="privacy-section__title">17. Contact Us</h2>
          <div className="privacy-section__content">
            <p>
              If you have questions about this Privacy Policy or how your information is handled, contact
              us anytime:
            </p>
            <p className="privacy-contact-info">
              <strong>Email:</strong>{' '}
              <a href="mailto:team.sneakrlab@gmail.com" className="privacy-link">
                team.sneakrlab@gmail.com
              </a>
              <br />
              <strong>Business:</strong>{' '}
              <a href="mailto:business.sneakrlab@gmail.com" className="privacy-link">
                business.sneakrlab@gmail.com
              </a>
            </p>
          </div>
        </section>
      </div>

      {!isEmbed && <Footer />}
    </div>
  );
}

export default PrivacyPolicy;
