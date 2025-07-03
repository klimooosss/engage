import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import WhyEngage from './components/WhyEngage';
import Features from './components/Features';
import BusinessModel from './components/BusinessModel';
import MarketOpportunity from './components/MarketOpportunity';
import Vision from './components/Vision';
import GetStarted from './components/GetStarted';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

function AppContent() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  // Check if we're on auth pages (signin or signup)
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';
  const isDashboardPage = location.pathname.startsWith('/dashboard') || 
                         location.pathname.startsWith('/overview') || 
                         location.pathname.startsWith('/marketplace') || 
                         location.pathname.startsWith('/creators') || 
                         location.pathname.startsWith('/analytics') || 
                         location.pathname.startsWith('/messages') || 
                         location.pathname.startsWith('/settings') || 
                         location.pathname.startsWith('/profile') || 
                         location.pathname.startsWith('/payouts') || 
                         location.pathname.startsWith('/billing');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      setScrollProgress(scrollPercent * 100);
      setShowScrollTop(scrollTop > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="engage-root">
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>
      {!isAuthPage && !isDashboardPage && <Header />}
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <WhyEngage />
            <Features />
            <BusinessModel />
            <MarketOpportunity />
            <Vision />
            <GetStarted />
            {showScrollTop && (
              <button className="scroll-top-btn" onClick={scrollToTop}>
                ↑
              </button>
            )}
            <button className="floating-cta-btn" onClick={() => window.location.href = '/signup'}>
              Get Started
            </button>
          </>
        } />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/overview" element={<Dashboard />} />
        <Route path="/marketplace" element={<Dashboard />} />
        <Route path="/creators" element={<Dashboard />} />
        <Route path="/analytics" element={<Dashboard />} />
        <Route path="/messages" element={<Dashboard />} />
        <Route path="/settings" element={<Dashboard />} />
        <Route path="/profile" element={<Dashboard />} />
        <Route path="/payouts" element={<Dashboard />} />
        <Route path="/billing" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      {!isAuthPage && !isDashboardPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
