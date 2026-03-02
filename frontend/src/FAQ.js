import { useState, useEffect, useRef } from 'react';
import './FAQ.css';

function FAQ() {
  // State to track which FAQ items are currently open (array of indices)
  // Multiple FAQs can be open at the same time
  const [openItems, setOpenItems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const faqData = [
    {
      question: 'What is the production process of custom shoes?',
      answer: 'At Sneakr, we use an innovative process to print vibrant designs on custom shoes. However, it is still an involved process, so it takes 10 business days to: set the physical shoe parts up to match software, print on all the parts, dry the parts, sew the parts together, form the shoe, seal the shoe to preserve the design, heat treat again, and then finally ship off.'
    },
    {
      question: 'What are your shipping options & times?',
      answer: 'We offer multiple shipping options to suit your needs: Standard shipping (5-7 business days) at no additional cost, Express shipping (2-3 business days) for expedited orders, and Overnight shipping for urgent orders. International shipping is available to most countries with varying delivery times based on location.'
    },
    {
      question: 'How is the quality of custom shoes?',
      answer: 'We maintain the highest quality standards in our custom shoe production. Each pair undergoes rigorous quality control checks before shipment. Our custom shoes are made with premium materials and our printing process ensures vibrant, durable designs that won\'t fade or peel.'
    },
    {
      question: 'How customizable are the shoes?',
      answer: 'Our custom shoes offer extensive customization options. You can customize colors, patterns, materials, overlays, and add personalized text or logos. Our design tool provides a real-time preview of your customizations. Most shoe styles can be customized on the upper, sole, and heel areas.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept a wide range of payment methods including all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are securely processed and encrypted to protect your financial information.'
    },
    {
      question: 'Can I cancel or modify my order after placing it?',
      answer: 'You can cancel or modify your order within 24 hours of placing it by contacting our customer service team. After 24 hours, once production has begun, we are unable to make changes or cancel the order. Please review your design carefully before confirming your purchase.'
    },
    {
      question: 'What is your return and refund policy?',
      answer: 'We offer a 30-day satisfaction guarantee. If you\'re not completely satisfied with your custom shoes, you can return them within 30 days of delivery for a full refund or exchange. The shoes must be in unworn condition with all original packaging. Custom orders with personalized text or logos may have different return terms.'
    },
    {
      question: 'Do you offer bulk or wholesale pricing for businesses?',
      answer: 'Yes! We offer special pricing for bulk orders and corporate clients. Our business program includes volume discounts, dedicated account management, and priority production. Orders of 50+ pairs qualify for wholesale pricing. Contact our business team for a custom quote.'
    },
    {
      question: 'What shoe sizes do you offer?',
      answer: 'We offer a comprehensive range of sizes for men, women, and children. Men\'s sizes range from US 6-15, women\'s sizes from US 5-12, and kids\' sizes from US 10C-6Y. Half sizes are available for most styles. Wide and narrow width options are also available for select models.'
    },
    {
      question: 'How do I care for my custom shoes?',
      answer: 'To maintain the quality and longevity of your custom shoes, we recommend: cleaning with a soft, damp cloth and mild soap; avoiding machine washing or harsh chemicals; air drying at room temperature away from direct heat; and storing in a cool, dry place. Proper care will ensure your custom design stays vibrant for years.'
    },
    {
      question: 'Can I see a preview before finalizing my order?',
      answer: 'Absolutely! Our 3D customization tool provides a real-time preview of your design from multiple angles. You can rotate, zoom, and view your shoes in different lighting conditions. Before checkout, you\'ll receive a final confirmation screen showing exactly how your custom shoes will look.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 150 countries worldwide. International shipping times vary by destination, typically ranging from 7-21 business days depending on customs processing. Customs duties and taxes are the responsibility of the recipient. Track your order online with the provided tracking number.'
    }
  ];

  // Toggle function: add/remove index from openItems array
  const toggleFAQ = (index) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter(i => i !== index)); // Remove if already open
    } else {
      setOpenItems([...openItems, index]); // Add to open items
    }
  };

  return (
    <section 
      id="faq" 
      className={`faq ${isVisible ? 'faq--visible' : ''}`}
      ref={sectionRef}
    >
      <div className="faq__container">
        <div className="faq__header">
          <h2 className="faq__title">Frequently Asked Questions</h2>
          <p className="faq__subtitle">Everything you need to know before customizing</p>
        </div>

        <div className="faq__items">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`faq__item ${openItems.includes(index) ? 'faq__item--open' : ''}`}
            >
              <button
                className="faq__question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openItems.includes(index)}
              >
                <span className="faq__question-text">{item.question}</span>
                <span className="faq__icon" aria-hidden="true">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              {openItems.includes(index) && (
                <div className="faq__answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
