import { useNavigate } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const navigate = useNavigate();
  // Column 1 - Custom Shoes Collections
  const shoesLinks = [
    'All Custom Shoes',
    'Best Sellers',
    'Custom Basketball Shoes',
    'Custom Low-Tops Sneakers',
    'Custom High-Tops',
    'Custom Boots',
    'Custom Kids Shoes',
    'Custom Sandals',
    'Other Custom Products',
    'All Customizable Products',
    'Cool Shoes'
  ];

  // Column 2 - About Us
  const aboutLinks = [
    'Contact Us',
    'Who We Are',
    'FAQs',
    'Careers',
    'Meet The Team',
    'News',
    'Refund Policy',
    'Terms of Services'
  ];

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__columns">
          {/* Column 1: Custom Shoes Collections */}
          <div className="footer__column">
            <h3 className="footer__title">Custom Shoes Collections</h3>
            <ul className="footer__list">
              {shoesLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="footer__link">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: About Us */}
          <div className="footer__column">
            <h3 className="footer__title">About Us</h3>
            <ul className="footer__list">
              {aboutLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link === 'FAQs' ? '#faq' : link === 'Who We Are' ? '#about' : '#'} 
                    className="footer__link"
                    onClick={(e) => {
                      if (link === 'FAQs') {
                        e.preventDefault();
                        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                      } else if (link === 'Who We Are') {
                        e.preventDefault();
                        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                      } else if (link === 'Refund Policy') {
                        e.preventDefault();
                        navigate('/refund-policy');
                      } else if (link === 'Terms of Services') {
                        e.preventDefault();
                        navigate('/terms-and-services');
                      }
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Information */}
          <div className="footer__column">
            <h3 className="footer__title">Contact Information</h3>
            <div className="footer__contact">
              <p className="footer__contact-item">
                <span className="footer__label">Phone Number:</span>
                <span className="footer__value">+1 (857) 380-2244</span>
              </p>
              <p className="footer__contact-item">
                <span className="footer__label">Email:</span>
                <span className="footer__value">Team@sneakrlab.com</span>
              </p>
              <p className="footer__contact-item">
                <span className="footer__label">Business Address:</span>
                <span className="footer__value">Angeles City, Philippines</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom - Copyright */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2026, Sneakr.lab. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
