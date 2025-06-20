import React from 'react';

const Footer = () => (
  <footer className="footer">
    <div>© {new Date().getFullYear()} Engage. All rights reserved.</div>
    <div className="footer-links">
      <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
    </div>
  </footer>
);

export default Footer; 