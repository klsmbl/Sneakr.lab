import { useEffect, useRef, useState } from 'react';
import './AboutUs.css';

function AboutUs() {
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

  return (
    <section 
      id="about" 
      className={`about ${isVisible ? 'about--visible' : ''}`}
      ref={sectionRef}
    >
      <div className="about__container">
        <div className="about__header">
          <h2 className="about__title">About Sneakr.lab</h2>
        </div>
        
        <div className="about__content">
          <p className="about__text">
            Sneakr.lab is a custom sneaker design platform that allows users to create personalized footwear that represents their identity. The idea started as a passion project to give people the freedom to design shoes that match their creativity and brand vision.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
