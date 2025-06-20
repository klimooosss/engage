import React from 'react';
import { useInView } from 'react-intersection-observer';

const Vision = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section
      className={`vision fade-in-section${inView ? ' is-visible' : ''}`}
      ref={ref}
    >
      <h2>The Vision</h2>
      <p>Engage isn't just a platform—it's the future of creator monetization. By combining AI, automation, and data-driven decision-making, we are revolutionizing influencer marketing and building a dominant force in the industry.</p>
    </section>
  );
};

export default Vision; 