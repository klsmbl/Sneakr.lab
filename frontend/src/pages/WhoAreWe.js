import { useEffect } from 'react';
import './WhoAreWe.css';
import Footer from '../Footer';

function WhoAreWe() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="who-are-we">
      {/* Hero Section */}
      <section 
        className="who-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(11, 29, 58, 0.75), rgba(31, 58, 102, 0.65)), url('/Header in Who are we.png')`
        }}
      >
        <div className="who-hero__content">
          <p className="who-hero__subtitle">Welcome to Our Brand</p>
          <h1 className="who-hero__title">SNEAKR.LAB</h1>
          <p className="who-hero__tagline">
            The Digital Shop Of Custom Shoes For Around The Internet
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="who-content">
        
        {/* About Us Section */}
        <section className="who-section">
          <div className="who-card">
            <div className="who-card__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="who-card__title">About Us</h2>
            <p className="who-card__text">
              Welcome to Sneakr.lab, where individuality meets quality in the world of 
              custom footwear. We specialize in creating personalized sneakers that 
              reflect your unique personality. Whether you're searching for a one-of-a-kind 
              pair or want to create matching footwear for a special event, we offer 
              innovative styles for the whole family to bring your ideas to life. At Sneakr.lab, every pair is custom-made to help you step out in style.
            </p>
            <p className="who-card__text">
              We understand that shoes are more than just an accessory—they are a form of 
              self-expression. From bold designs to personalized elements, our process 
              empowers you to create footwear that aligns with your identity. Whether 
              you are purchasing for yourself, your loved ones, or your entire crew, our 
              team is dedicated to helping you bring creative visions to life with 
              precision and care. Every pair tells a story, and we ensure that every design 
              you create is uniquely tailored to your inspiration.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="who-section">
          <div className="who-card who-card--wide">
            <h2 className="who-card__title">Our Story</h2>
            <p className="who-card__text">
              Founded out of a love for creative footwear, Sneakr.lab was born from our unwavering 
              commitment to quality, customization, and personal expression. After years of 
              searching for customizable options that matched our vision, we decided to build our 
              own platform. Starting with a commitment to quality and service, Sneakr.lab 
              has become a go-to destination for those looking for personalized sneakers. From 
              family gatherings to personal statements, we aim to empower our customers to design 
              footwear that reflects their unique personalities and passions throughout their 
              lives.
            </p>
          </div>
        </section>

        {/* Mission and Vision Section */}
        <section className="who-section">
          <div className="who-grid">
            <div className="who-card">
              <h2 className="who-card__title">Our Mission</h2>
              <p className="who-card__text">
                At Sneakr.lab, our mission is to empower individuals to express their creativity through 
                footwear. We aim to deliver custom sneaker design solutions that celebrate beauty, craftsmanship, 
                and authenticity. We are dedicated to providing a seamless online shopping 
                experience, backed by top-quality materials and cutting-edge customization technology. 
                Our purpose is to help our customers bring their personal visions to life, ensuring 
                that each product is more than just footwear—it's an extension of their identity and unique 
                narrative for the important moments that matter most.
              </p>
            </div>
            <div className="who-card">
              <h2 className="who-card__title">Our Vision</h2>
              <p className="who-card__text">
                We envision Sneakr.lab as the leading platform for custom footwear worldwide, creating a 
                community where creativity has no limits. We strive to set the standard by innovation, 
                sustainability, and customer satisfaction. Our long-term vision is to empower 
                individuals from all over the world to customize their sneakers while fostering a sense 
                of individuality and craftsmanship. We want every pair to inspire confidence and 
                celebrate the diverse stories that make us all unique, one design at a time.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="who-section">
          <div className="who-card who-card--wide">
            <h2 className="who-card__title">What We Offer</h2>
            <p className="who-card__text">
              Sneakr.lab is proud to offer a diverse selection of customizable shoe options. Our 
              platform is designed to let you explore your creative side as you personalize every 
              element of your footwear. From vibrant color palettes to personalized graphics and text, 
              you have all the tools at your disposal to design something truly one of a kind. Whether 
              for personal style, events, or branded merchandise, we deliver endless opportunities for 
              creative expression.
            </p>
            <p className="who-card__text">
              Sneakr.lab has transformed the way we create custom shoes for customers that appreciate advanced 
              production technology. We use only premium-grade materials to give each pair exceptional 
              durability, while our printing process ensures vibrant hues and intricate designs that stand 
              the test of time. Our streamlined workflow means an efficient and user-friendly design process, 
              giving you the confidence to craft exactly what you envisioned, with unmatched accessibility 
              for all your demands and our sustainable mission for renewed use of your favorite designs.
            </p>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}

export default WhoAreWe;
