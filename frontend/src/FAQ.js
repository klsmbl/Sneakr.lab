import { useState } from 'react';
import './FAQ.css';

function FAQ() {
  // State to track which FAQ item is currently open (by index)
  // Only one FAQ can be open at a time
  const [openIndex, setOpenIndex] = useState(null);

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
    }
  ];

  // Toggle function: if clicking the same item, close it; otherwise, open the new one
  const toggleFAQ = (index) => {
    if (openIndex === index) {
      setOpenIndex(null); // Close if already open
    } else {
      setOpenIndex(index); // Open the new one
    }
  };

  return (
    <section className="faq">
      <div className="faq__container">
        <div className="faq__header">
          <h2 className="faq__title">Frequently Asked Questions</h2>
          <p className="faq__subtitle">Everything you need to know before customizing</p>
        </div>

        <div className="faq__items">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`faq__item ${openIndex === index ? 'faq__item--open' : ''}`}
            >
              <button
                className="faq__question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
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

              {openIndex === index && (
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
