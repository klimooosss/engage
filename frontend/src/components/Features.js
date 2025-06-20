import React from 'react';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="url(#g1)"/><path d="M13 20l5 5 9-9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="g1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#00e6d2"/><stop offset="1" stopColor="#0071e3"/></linearGradient></defs></svg>
    ),
    title: 'AI-Powered Matching',
    description: 'Smart algorithms connect brands with ideal creators.'
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="20" fill="url(#g2)"/><path d="M13 20h14M20 13v14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="g2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#ffb347"/><stop offset="1" stopColor="#ff416c"/></linearGradient></defs></svg>
    ),
    title: 'Seamless Payments',
    description: 'Secure transactions with built-in escrow protection.'
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="20" fill="url(#g3)"/><path d="M13 27V13h14v14H13z" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round"/><path d="M13 20h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/><defs><linearGradient id="g3" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#43e97b"/><stop offset="1" stopColor="#38f9d7"/></linearGradient></defs></svg>
    ),
    title: 'Performance Analytics',
    description: 'Track campaign success with real-time metrics.'
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="20" fill="url(#g4)"/><path d="M20 13v14M13 20h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/><defs><linearGradient id="g4" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#f7971e"/><stop offset="1" stopColor="#ffd200"/></linearGradient></defs></svg>
    ),
    title: 'Automated Negotiations',
    description: 'AI suggests optimal rates for fair deals.'
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="20" fill="url(#g5)"/><path d="M20 13a7 7 0 100 14 7 7 0 000-14z" stroke="#fff" strokeWidth="2.5"/><defs><linearGradient id="g5" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#43cea2"/><stop offset="1" stopColor="#185a9d"/></linearGradient></defs></svg>
    ),
    title: 'Global Reach',
    description: 'Access thousands of influencers and brands worldwide.'
  }
];

const Features = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section
      className={`features-modern-highend fade-in-section${inView ? ' is-visible' : ''}`}
      id="features"
      ref={ref}
    >
      <div className="features-modern-highend-header">
        <h2>
          <span className="features-modern-highend-gradient-text">Key Features</span>
        </h2>
        <div className="features-modern-highend-accent"></div>
      </div>
      <div className="features-modern-highend-grid">
        {features.map((f, i) => (
          <div className="features-modern-highend-card" key={i}>
            <div className="features-modern-highend-icon">{f.icon}</div>
            <div className="features-modern-highend-title">{f.title}</div>
            <div className="features-modern-highend-desc">{f.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features; 