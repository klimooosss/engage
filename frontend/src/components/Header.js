import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToTop = () => {
    if (window.location.pathname === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      navigate('/');
    }
  };

  return (
    <header className={`engage-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo" onClick={scrollToTop} style={{ cursor: 'pointer' }}>Engage</div>
      <nav className={isMobileMenuOpen ? 'mobile-menu-open' : ''}>
        <a href="#features">Features</a>
        <a href="#creators">For Creators</a>
        <a href="#brands">For Brands</a>
        <a href="#agencies">For Agencies</a>
        <button className="cta-btn" onClick={() => navigate('/signin')}>Sign In</button>
      </nav>
      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
      </button>
    </header>
  );
};

export default Header; 