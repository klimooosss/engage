import React from 'react';
import { useInView } from 'react-intersection-observer';

const MarketOpportunity = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section
      className={`market-opportunity fade-in-section${inView ? ' is-visible' : ''}`}
      ref={ref}
    >
      <h2>Market Opportunity</h2>
      <p>Influencer marketing is a $30B+ industry and growing. Brands are shifting budgets from traditional ads to influencer partnerships. Engage is positioned to disrupt the market by offering a smarter, more efficient connection platform.</p>
    </section>
  );
};

export default MarketOpportunity; 