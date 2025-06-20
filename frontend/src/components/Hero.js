import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const Hero = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const navigate = useNavigate();
  return (
    <section
      className={`hero fade-in-section${inView ? ' is-visible' : ''}`}
      ref={ref}
    >
      <h1>Engage – The Ultimate Creator-Brand Connection Platform</h1>
      <p>Connecting content creators and brands for high-impact collaborations. Streamline partnerships, maximize earnings, and empower brands with AI-driven influencer marketing.</p>
      <div className="hero-cta">
        <button
          className="cta-btn"
          onClick={() => navigate('/signup', { state: { role: 'creator' } })}
        >
          🚀 Sign up as Creator
        </button>
        <button
          className="cta-btn secondary"
          onClick={() => navigate('/signup', { state: { role: 'brand' } })}
        >
          💼 Sign up as Brand
        </button>
      </div>
    </section>
  );
};

export default Hero; 