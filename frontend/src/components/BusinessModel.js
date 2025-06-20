import React from 'react';
import { useInView } from 'react-intersection-observer';

const BusinessModel = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section
      className={`business-model fade-in-section${inView ? ' is-visible' : ''}`}
      id="pricing"
      ref={ref}
    >
      <h2>Business Model</h2>
      <div className="business-cards">
        <div className="business-card">
          <strong>Transaction Fees</strong>
          <p>A small percentage on every completed deal.</p>
        </div>
        <div className="business-card">
          <strong>Premium Plans</strong>
          <p>Subscription-based model for advanced analytics & AI features.</p>
        </div>
        <div className="business-card">
          <strong>Advertising & Promotions</strong>
          <p>Brands can boost visibility for exclusive collaborations.</p>
        </div>
      </div>
    </section>
  );
};

export default BusinessModel; 