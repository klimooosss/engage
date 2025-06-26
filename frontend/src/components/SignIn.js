import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const SignIn = () => {
  const navigate = useNavigate();

  const {checkAuth, login} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    role: 'creator'
  });
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [socialSigninMethod, setSocialSigninMethod] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);


  // Refs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const roleOptions = [
    {
      value: 'creator',
      icon: '🎨',
      title: 'Creator',
      description: 'Content creators and influencers'
    },
    {
      value: 'brand',
      icon: '🏢',
      title: 'Brand',
      description: 'Companies and businesses'
    },
    {
      value: 'agency',
      icon: '🚀',
      title: 'Agency',
      description: 'Marketing and talent agencies'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Auto-fill detection
    const checkAutoFill = () => {
      if (emailRef.current && passwordRef.current) {
        const emailFilled = emailRef.current.matches(':autofill');
        const passwordFilled = passwordRef.current.matches(':autofill');
        
        if (emailFilled && passwordFilled) {
          setFormData(prev => ({
            ...prev,
            email: emailRef.current.value,
            password: passwordRef.current.value
          }));
        }
      }
    };

    const timer = setTimeout(checkAutoFill, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {

    const result = await login(formData.email, formData.password);

    alert(result.success, result.error);

    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');



    try {
      // Mock authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate authentication check
      if (formData.email === 'demo@engage.com' && formData.password === 'password123') {
        setSuccess(true);
        // Save role to localStorage for persistence
        localStorage.setItem('userRole', formData.role);
        setTimeout(() => {
          navigate('/dashboard', { state: { role: formData.role } });
        }, 1000);
      } else {
        throw new Error('Invalid email or password');
      }
      
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignin = async (provider) => {
    setLoading(true);
    setError('');
    setSocialSigninMethod(provider);

    try {
      // Mock social signin
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      // Save role to localStorage for persistence
      localStorage.setItem('userRole', formData.role);
      setTimeout(() => {
        navigate('/dashboard', { state: { role: formData.role } });
      }, 1000);
      
    } catch (err) {
      setError(`${provider} signin failed. Please try again.`);
    } finally {
      setLoading(false);
      setSocialSigninMethod(null);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setForgotLoading(true);
    setError('');

    try {
      // Mock password reset
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setForgotSuccess(true);
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotEmail('');
        setForgotSuccess(false);
      }, 3000);
      
    } catch (err) {
      setError('Password reset failed. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      if (showForgotPassword) {
        handleForgotPassword(e);
      } else {
        handleSubmit(e);
      }
    }
  };

  const renderMainSignin = () => (
    <>
      <div className="auth-header">
        <div className="auth-logo">
          <span className="logo-icon">🚀</span>
        </div>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your Engage account</p>
      </div>
      
      <div className="role-selection">
        <label>Select Your Role</label>
        <div className="role-options">
          {roleOptions.map(role => (
            <div
              key={role.value}
              className={`role-option ${formData.role === role.value ? 'active' : ''}`}
              onClick={() => handleChange({ target: { name: 'role', value: role.value } })}
            >
              <div className="role-content">
                <div className="role-icon">{role.icon}</div>
                <div className="role-info">
                  <span className="role-label">{role.title}</span>
                  <span className="role-description">{role.description}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="social-login">
        <button 
          className="social-btn google"
          onClick={() => handleSocialSignin('Google')}
          type="button"
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
        <button 
          className="social-btn apple"
          onClick={() => handleSocialSignin('Apple')}
          type="button"
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Continue with Apple
        </button>
      </div>

      <div className="auth-divider">
        <span>or continue with email</span>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className={`form-group ${isFocused.email ? 'focused' : ''}`}>
          <label htmlFor="email">Email address</label>
          <input
            ref={emailRef}
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => handleFocus('email')}
            onBlur={() => handleBlur('email')}
            onKeyPress={handleKeyPress}
            className={error && !formData.email ? 'error' : ''}
            disabled={loading}
            autoComplete="email"
          />
        </div>

        <div className={`form-group ${isFocused.password ? 'focused' : ''}`}>
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              ref={passwordRef}
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
              onKeyPress={handleKeyPress}
              className={error && !formData.password ? 'error' : ''}
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <div className="form-footer">
          <label className="remember-me">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={loading}
            />
            <span>Remember me for 30 days</span>
          </label>
          <button
            type="button"
            className="forgot-password"
            onClick={() => setShowForgotPassword(true)}
            disabled={loading}
          >
            Forgot password?
          </button>
        </div>

        <button 
          className={`auth-submit ${loading ? 'loading' : ''}`} 
          type="submit" 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Signing in...
            </>
          ) : (
            'Sign in to account'
          )}
        </button>

        {error && (
          <div className="auth-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        {success && (
          <div className="auth-success">
            <span className="success-icon">✅</span>
            Welcome back! Redirecting...
          </div>
        )}
      </form>

      <div className="demo-credentials">
        <div className="demo-header">
          <span className="demo-icon">🔑</span>
          <span>Demo Account</span>
        </div>
        <div className="demo-details">
          <div className="demo-field">
            <span className="demo-label">Email:</span>
            <code>demo@engage.com</code>
          </div>
          <div className="demo-field">
            <span className="demo-label">Password:</span>
            <code>password123</code>
          </div>
        </div>
      </div>

      <p className="auth-footer">
        Don't have an account?{' '}
        <Link to="/signup" className="auth-link">
          Create account
        </Link>
      </p>
    </>
  );

  const renderForgotPassword = () => (
    <>
      <div className="auth-header">
        <button 
          className="back-button"
          onClick={() => setShowForgotPassword(false)}
          type="button"
          disabled={forgotLoading}
        >
          <span className="back-icon">←</span>
          Back to sign in
        </button>
        <div className="auth-logo">
          <span className="logo-icon">🔐</span>
        </div>
        <h2>Reset your password</h2>
        <p className="auth-subtitle">Enter your email to receive reset instructions</p>
      </div>

      <form onSubmit={handleForgotPassword} className="auth-form">
        <div className={`form-group ${isFocused.email ? 'focused' : ''}`}>
          <label htmlFor="forgotEmail">Email address</label>
          <input
            id="forgotEmail"
            type="email"
            name="forgotEmail"
            placeholder="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            onFocus={() => handleFocus('email')}
            onBlur={() => handleBlur('email')}
            onKeyPress={handleKeyPress}
            disabled={forgotLoading}
            autoComplete="email"
          />
        </div>

        <button 
          className={`auth-submit ${forgotLoading ? 'loading' : ''}`} 
          type="submit" 
          disabled={forgotLoading}
        >
          {forgotLoading ? (
            <>
              <span className="loading-spinner"></span>
              Sending reset link...
            </>
          ) : (
            'Send reset link'
          )}
        </button>

        {error && (
          <div className="auth-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        {forgotSuccess && (
          <div className="auth-success">
            <span className="success-icon">✅</span>
            Reset link sent! Check your email for instructions.
          </div>
        )}
      </form>
    </>
  );

  return (
    <div className="auth-page">
      <button 
        className="return-home-btn"
        onClick={() => navigate('/')}
        type="button"
      >
        <span className="return-icon">←</span>
        Return to Home
      </button>
      <div className={`auth-container ${isScrolled ? 'scrolled' : ''}`}>
        {showForgotPassword ? renderForgotPassword() : renderMainSignin()}
      </div>
    </div>
  );
};

export default SignIn; 