import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const GetStarted = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const navigate = useNavigate();
  return (
    <section
      className={`get-started fade-in-section${inView ? ' is-visible' : ''}`}
      ref={ref}
    >
      <h2>Get Started Today</h2>
      <div className="get-started-cta">
        <button
          className="cta-btn"
          onClick={() => navigate('/signup', { state: { role: 'creator' } })}
        >
          🚀 Creators – Start Earning
        </button>
        <button
          className="cta-btn secondary"
          onClick={() => navigate('/signup', { state: { role: 'brand' } })}
        >
          💼 Brands – Find Influencers
        </button>
      </div>
      <p>Let's redefine creator-brand partnerships. Join Engage now.</p>
    </section>
  );
};

export default GetStarted; 