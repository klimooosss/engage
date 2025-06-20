import React from 'react';
import { useInView } from 'react-intersection-observer';

const WhyEngage = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section
      className={`why-engage fade-in-section${inView ? ' is-visible' : ''}`}
      id="creators"
      ref={ref}
    >
      <h2>Why Engage?</h2>
      <div className="why-cards">
        <div className="why-card">
          <h3>For Creators</h3>
          <p>Monetize your audience effortlessly by securing brand deals tailored to your niche.</p>
        </div>
        <div className="why-card" id="brands">
          <h3>For Brands</h3>
          <p>Find the perfect influencers to promote your products with real-time analytics and AI-driven matching.</p>
        </div>
        <div className="why-card" id="agencies">
          <h3>For Agencies</h3>
          <p>Manage multiple creators and campaigns in one seamless dashboard.</p>
        </div>
      </div>
    </section>
  );
};

export default WhyEngage; 