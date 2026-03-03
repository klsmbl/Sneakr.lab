import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import './Footer.css';

function Footer() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);
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
    <footer 
      className={`footer ${isVisible ? 'footer--visible' : ''}`}
      ref={footerRef}
    >
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
                    href={link === 'FAQs' ? '#faq' : link === 'Who We Are' ? '/who-are-we' : '#'} 
                    className="footer__link"
                    onClick={(e) => {
                      if (link === 'FAQs') {
                        e.preventDefault();
                        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                      } else if (link === 'Who We Are') {
                        e.preventDefault();
                        navigate('/who-are-we');
                      } else if (link === 'Refund Policy') {
                        e.preventDefault();
                        navigate('/refund-policy');
                      } else if (link === 'Terms of Services') {
                        e.preventDefault();
                        navigate('/terms');
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
                <span className="footer__value">+63 (917) 123-4567</span>
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

        {/* Social Media Links */}
        <div className="footer__social">
          <a 
            href="https://www.facebook.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer__social-link"
            aria-label="Facebook"
          >
            <img src="/facebook (1).png" alt="Facebook" className="footer__social-icon" />
          </a>
          <a 
            href="https://x.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer__social-link"
            aria-label="Twitter"
          >
            <img src="/twitter.png" alt="Twitter" className="footer__social-icon" />
          </a>
          <a 
            href="https://www.instagram.com/sneakrlab" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer__social-link"
            aria-label="Instagram"
          >
            <img src="/instagram.png" alt="Instagram" className="footer__social-icon" />
          </a>
          <a 
            href="https://www.tiktok.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer__social-link"
            aria-label="TikTok"
          >
            <img src="/tik-tok.png" alt="TikTok" className="footer__social-icon" />
          </a>
          <a 
            href="https://www.youtube.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer__social-link"
            aria-label="YouTube"
          >
            <img src="/youtube (1).png" alt="YouTube" className="footer__social-icon" />
          </a>
          <a 
            href="https://www.pinterest.com/sneakrlab" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer__social-link"
            aria-label="Pinterest"
          >
            <img src="/pinterest-logo.png" alt="Pinterest" className="footer__social-icon" />
          </a>
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
