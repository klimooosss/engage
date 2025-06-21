import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isFocused, setIsFocused] = useState({});
  const [socialSignupMethod, setSocialSignupMethod] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formAppear, setFormAppear] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { user, sayHello } = useAuthStore();

  console.log("user is here: ", user)

  const formRefs = {
    email: useRef(null),
    password: useRef(null),
    firstName: useRef(null),
    lastName: useRef(null)
  };

  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'creator',
    firstName: '',
    lastName: '',
    companyName: '',
    bio: '',
    interests: [],
    // Creator-specific fields
    contentTypes: [],
    socialLinks: {
      instagram: '',
      youtube: '',
      tiktok: ''
    },
    // Brand-specific fields
    industry: '',
    brandSize: '',
    marketingBudget: '',
    // Agency-specific fields
    agencySize: '',
    clientTypes: [],
    servicesOffered: []
  });

  console.log(setForm.email)

  const roleOptions = [
    {
      value: 'creator',
      icon: '🎨',
      title: 'Creator',
      description: 'I create content and build my brand'
    },
    {
      value: 'brand',
      icon: '🏢',
      title: 'Brand',
      description: 'I represent a company or product'
    },
    {
      value: 'agency',
      icon: '🚀',
      title: 'Agency',
      description: 'I manage multiple brands or creators'
    }
  ];

  const contentTypeOptions = [
    'Video', 'Photography', 'Writing', 'Music', 'Art', 'Gaming', 'Education', 'Lifestyle'
  ];

  const industryOptions = [
    'Technology', 'Fashion', 'Food & Beverage', 'Health & Wellness', 'Entertainment',
    'Beauty', 'Sports', 'Travel', 'Education', 'Other'
  ];

  const clientTypeOptions = [
    'Creators', 'Small Businesses', 'Enterprise Brands', 'Non-profits', 'Start-ups'
  ];

  const serviceOptions = [
    'Content Creation', 'Brand Strategy', 'Social Media Management',
    'Influencer Marketing', 'Performance Marketing', 'PR & Communications'
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    setFormAppear(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      return { ...prev, [name]: value };
    });
    setError('');
  };

  const handleArrayChange = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        if (!form.email || !form.password) {
          setError('Please fill in all required fields');
          return false;
        }
        if (!form.email.includes('@')) {
          setError('Please enter a valid email address');
          return false;
        }
        if (form.password.length < 8) {
          setError('Password must be at least 8 characters long');
          return false;
        }
        break;
      case 2:
        if (!form.firstName || !form.lastName || !form.role) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 3:
        if (!form.bio) {
          setError('Please fill in your bio');
          return false;
        }
        break;
      case 4:
        switch (form.role) {
          case 'creator':
            if (form.contentTypes.length === 0) {
              setError('Please select at least one content type');
              return false;
            }
            break;
          case 'brand':
            if (!form.industry || !form.brandSize) {
              setError('Please fill in all required fields');
              return false;
            }
            break;
          case 'agency':
            if (!form.agencySize || form.clientTypes.length === 0) {
              setError('Please fill in all required fields');
              return false;
            }
            break;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleNext = () => {

    sayHello();

    if (validateStep(step)) {
      setFormAppear(false);
      setTimeout(() => {
        setStep(prev => prev + 1);
        setFormAppear(true);
      }, 300);
      setError('');
    }
  };

  const handleBack = () => {
    setFormAppear(false);
    setTimeout(() => {
      setStep(prev => prev - 1);
      setFormAppear(true);
    }, 300);
    setError('');
  };

  const handleSocialSignup = async (provider) => {
    setLoading(true);
    setError('');
    setSocialSignupMethod(provider);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setForm(prev => ({
        ...prev,
        email: 'demo@gmail.com',
      }));
      setFormAppear(false);
      setTimeout(() => {
        setStep(2);
        setFormAppear(true);
      }, 300);
    } catch (err) {
      setError(`${provider} signup failed. Please try again.`);
    } finally {
      setLoading(false);
      setSocialSignupMethod(null);
    }
  };

  const handleSubmit = async (e) => {

    sayHello();

    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className={`signup-step ${formAppear ? 'appear' : ''}`}>
      <div className="auth-header">
        <div className="auth-logo">
          <div className="rocket-container">
            <span className="logo-icon">🚀</span>
          </div>
        </div>
        <h2>Create Your Account</h2>
        <p className="auth-subtitle">Join the Engage community</p>
      </div>

      <div className="social-login">
        <button 
          className={`social-btn google ${socialSignupMethod === 'Google' ? 'loading' : ''}`}
          onClick={() => handleSocialSignup('Google')}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {socialSignupMethod === 'Google' ? 'Connecting...' : 'Continue with Google'}
        </button>
        <button 
          className={`social-btn apple ${socialSignupMethod === 'Apple' ? 'loading' : ''}`}
          onClick={() => handleSocialSignup('Apple')}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          {socialSignupMethod === 'Apple' ? 'Connecting...' : 'Continue with Apple'}
        </button>
      </div>

      <div className="auth-divider">
        <span>or continue with email</span>
      </div>

      <div className={`form-group ${isFocused.email ? 'focused' : ''}`}>
        <label htmlFor="email">Email</label>
        <input
          ref={formRefs.email}
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          onFocus={() => handleFocus('email')}
          onBlur={() => handleBlur('email')}
          placeholder="Enter your email"
          disabled={loading}
          className={error && !form.email ? 'error' : ''}
        />
      </div>

      <div className={`form-group ${isFocused.password ? 'focused' : ''}`}>
        <label htmlFor="password">Password</label>
        <div className="password-input">
          <input
            ref={formRefs.password}
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            onFocus={() => handleFocus('password')}
            onBlur={() => handleBlur('password')}
            placeholder="Create a password"
            disabled={loading}
            className={error && !form.password ? 'error' : ''}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>

      <button 
        type="button" 
        className={`next-btn ${loading ? 'loading' : ''}`}
        onClick={handleNext}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Continue'}
      </button>

      <p className="auth-footer">
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );

  const renderStep2 = () => (
    <div className={`signup-step ${formAppear ? 'appear' : ''}`}>
      <div className="auth-header">
        <h3>Tell Us About Yourself</h3>
        <p className="auth-subtitle">Help us personalize your experience</p>
      </div>

      <div className="form-row">
        <div className={`form-group ${isFocused.firstName ? 'focused' : ''}`}>
          <label htmlFor="firstName">First Name</label>
          <input
            ref={formRefs.firstName}
            id="firstName"
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            onFocus={() => handleFocus('firstName')}
            onBlur={() => handleBlur('firstName')}
            placeholder="Enter your first name"
            disabled={loading}
            className={error && !form.firstName ? 'error' : ''}
          />
        </div>

        <div className={`form-group ${isFocused.lastName ? 'focused' : ''}`}>
          <label htmlFor="lastName">Last Name</label>
          <input
            ref={formRefs.lastName}
            id="lastName"
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            onFocus={() => handleFocus('lastName')}
            onBlur={() => handleBlur('lastName')}
            placeholder="Enter your last name"
            disabled={loading}
            className={error && !form.lastName ? 'error' : ''}
          />
        </div>
      </div>

      <div className="role-selection">
        <label className="role-label">I am a...</label>
        <div className="role-options">
          {roleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`role-option ${form.role === option.value ? 'active' : ''}`}
              onClick={() => handleChange({ target: { name: 'role', value: option.value } })}
              disabled={loading}
            >
              <div className="role-icon">{option.icon}</div>
              <div className="role-info">
                <span className="role-title">{option.title}</span>
                <span className="role-description">{option.description}</span>
              </div>
              <div className="role-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="button-group">
        <button 
          type="button" 
          className="back-btn" 
          onClick={handleBack}
          disabled={loading}
        >
          Back
        </button>
        <button 
          type="button" 
          className="next-btn" 
          onClick={handleNext}
          disabled={loading}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={`signup-step ${formAppear ? 'appear' : ''}`}>
      <div className="auth-header">
        <h3>Complete Your Profile</h3>
        <p className="auth-subtitle">Tell us more about your work</p>
      </div>

      <div className={`form-group ${isFocused.companyName ? 'focused' : ''}`}>
        <label htmlFor="companyName">
          {form.role === 'brand' ? 'Brand Name' : 
           form.role === 'agency' ? 'Agency Name' : 
           'Company Name'} {form.role === 'creator' ? '(Optional)' : ''}
        </label>
        <input
          id="companyName"
          type="text"
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          onFocus={() => handleFocus('companyName')}
          onBlur={() => handleBlur('companyName')}
          placeholder={`Enter your ${form.role === 'brand' ? 'brand' : 
                                   form.role === 'agency' ? 'agency' : 
                                   'company'} name`}
          disabled={loading}
          required={form.role !== 'creator'}
        />
      </div>

      <div className={`form-group ${isFocused.bio ? 'focused' : ''}`}>
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          value={form.bio}
          onChange={handleChange}
          onFocus={() => handleFocus('bio')}
          onBlur={() => handleBlur('bio')}
          placeholder={form.role === 'creator' ? "Tell us about your content and what inspires you" :
                      form.role === 'brand' ? "Tell us about your brand and its mission" :
                      "Tell us about your agency and its expertise"}
          rows={4}
          disabled={loading}
        />
      </div>

      <div className="button-group">
        <button 
          type="button" 
          className="back-btn" 
          onClick={handleBack}
          disabled={loading}
        >
          Back
        </button>
        <button 
          type="button" 
          className="next-btn" 
          onClick={handleNext}
          disabled={loading}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className={`signup-step ${formAppear ? 'appear' : ''}`}>
      <div className="auth-header">
        <div className="step-icon">
          {form.role === 'creator' ? '🎨' : form.role === 'brand' ? '🏢' : '🚀'}
        </div>
        <h3>
          {form.role === 'creator' ? 'Your Creative Journey' :
           form.role === 'brand' ? 'Brand Discovery' :
           'Agency Profile'}
        </h3>
        <p className="auth-subtitle">
          {form.role === 'creator' ? 'Let\'s understand your content and audience' :
           form.role === 'brand' ? 'Help us tailor the perfect experience for your brand' :
           'Tell us about your agency\'s expertise and capabilities'}
        </p>
      </div>

      {form.role === 'creator' && (
        <div className="role-specific-form">
          <div className="form-section">
            <div className="section-header">
              <span className="section-icon">📱</span>
              <h4>Content Types</h4>
              <p>What type of content do you create? (Select all that apply)</p>
            </div>
            <div className="content-type-grid">
              {contentTypeOptions.map(type => (
                <div
                  key={type}
                  className={`content-type-card ${form.contentTypes.includes(type) ? 'selected' : ''}`}
                  onClick={() => handleArrayChange('contentTypes', type)}
                >
                  <div className="content-type-icon">
                    {type === 'Video' ? '🎥' : 
                     type === 'Photography' ? '📸' :
                     type === 'Writing' ? '✍️' :
                     type === 'Music' ? '🎵' :
                     type === 'Art' ? '🎨' :
                     type === 'Gaming' ? '🎮' :
                     type === 'Education' ? '📚' :
                     type === 'Lifestyle' ? '🌟' : '📱'}
                  </div>
                  <span className="content-type-label">{type}</span>
                  <div className="selection-indicator">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <span className="section-icon">🌐</span>
              <h4>Social Presence</h4>
              <p>Connect your social media accounts (optional)</p>
            </div>
            <div className="social-links-grid">
              <div className={`social-link-card ${isFocused['socialLinks.instagram'] ? 'focused' : ''}`}>
                <div className="social-link-icon">📸</div>
                <div className="social-link-input">
                  <input
                    type="text"
                    name="socialLinks.instagram"
                    value={form.socialLinks.instagram}
                    onChange={handleChange}
                    onFocus={() => handleFocus('socialLinks.instagram')}
                    onBlur={() => handleBlur('socialLinks.instagram')}
                    placeholder="@your_handle"
                    disabled={loading}
                  />
                </div>
                <span className="social-link-label">Instagram</span>
              </div>

              <div className={`social-link-card ${isFocused['socialLinks.youtube'] ? 'focused' : ''}`}>
                <div className="social-link-icon">🎥</div>
                <div className="social-link-input">
                  <input
                    type="text"
                    name="socialLinks.youtube"
                    value={form.socialLinks.youtube}
                    onChange={handleChange}
                    onFocus={() => handleFocus('socialLinks.youtube')}
                    onBlur={() => handleBlur('socialLinks.youtube')}
                    placeholder="Channel name"
                    disabled={loading}
                  />
                </div>
                <span className="social-link-label">YouTube</span>
              </div>

              <div className={`social-link-card ${isFocused['socialLinks.tiktok'] ? 'focused' : ''}`}>
                <div className="social-link-icon">🎵</div>
                <div className="social-link-input">
                  <input
                    type="text"
                    name="socialLinks.tiktok"
                    value={form.socialLinks.tiktok}
                    onChange={handleChange}
                    onFocus={() => handleFocus('socialLinks.tiktok')}
                    onBlur={() => handleBlur('socialLinks.tiktok')}
                    placeholder="@your_handle"
                    disabled={loading}
                  />
                </div>
                <span className="social-link-label">TikTok</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {form.role === 'brand' && (
        <div className="role-specific-form">
          <div className="form-section">
            <div className="section-header">
              <span className="section-icon">🏭</span>
              <h4>Industry & Size</h4>
              <p>Help us understand your business better</p>
            </div>
            <div className="brand-info-grid">
              <div className={`form-group ${isFocused.industry ? 'focused' : ''}`}>
                <label htmlFor="industry">
                  <span className="label-icon">🏭</span>
                  Industry
                </label>
                <div className="select-wrapper">
                  <select
                    id="industry"
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    onFocus={() => handleFocus('industry')}
                    onBlur={() => handleBlur('industry')}
                    disabled={loading}
                    className={error && !form.industry ? 'error' : ''}
                  >
                    <option value="">Choose your industry</option>
                    {industryOptions.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                  <div className="select-arrow">▼</div>
                </div>
              </div>

              <div className={`form-group ${isFocused.brandSize ? 'focused' : ''}`}>
                <label htmlFor="brandSize">
                  <span className="label-icon">👥</span>
                  Company Size
                </label>
                <div className="select-wrapper">
                  <select
                    id="brandSize"
                    name="brandSize"
                    value={form.brandSize}
                    onChange={handleChange}
                    onFocus={() => handleFocus('brandSize')}
                    onBlur={() => handleBlur('brandSize')}
                    disabled={loading}
                    className={error && !form.brandSize ? 'error' : ''}
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                  <div className="select-arrow">▼</div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <span className="section-icon">💰</span>
              <h4>Marketing Budget</h4>
              <p>This helps us recommend the right solutions (optional)</p>
            </div>
            <div className="budget-slider-container">
              <div className={`form-group ${isFocused.marketingBudget ? 'focused' : ''}`}>
                <div className="select-wrapper">
                  <select
                    id="marketingBudget"
                    name="marketingBudget"
                    value={form.marketingBudget}
                    onChange={handleChange}
                    onFocus={() => handleFocus('marketingBudget')}
                    onBlur={() => handleBlur('marketingBudget')}
                    disabled={loading}
                  >
                    <option value="">Select budget range</option>
                    <option value="0-1000">$0 - $1,000</option>
                    <option value="1001-5000">$1,001 - $5,000</option>
                    <option value="5001-10000">$5,001 - $10,000</option>
                    <option value="10001-50000">$10,001 - $50,000</option>
                    <option value="50000+">$50,000+</option>
                  </select>
                  <div className="select-arrow">▼</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {form.role === 'agency' && (
        <div className="role-specific-form">
          <div className="form-section">
            <div className="section-header">
              <span className="section-icon">🏢</span>
              <h4>Agency Details</h4>
              <p>Tell us about your agency structure</p>
            </div>
            <div className="agency-info-grid">
              <div className={`form-group ${isFocused.agencySize ? 'focused' : ''}`}>
                <label htmlFor="agencySize">
                  <span className="label-icon">👥</span>
                  Agency Size
                </label>
                <div className="select-wrapper">
                  <select
                    id="agencySize"
                    name="agencySize"
                    value={form.agencySize}
                    onChange={handleChange}
                    onFocus={() => handleFocus('agencySize')}
                    onBlur={() => handleBlur('agencySize')}
                    disabled={loading}
                    className={error && !form.agencySize ? 'error' : ''}
                  >
                    <option value="">Select agency size</option>
                    <option value="1-5">1-5 employees</option>
                    <option value="6-20">6-20 employees</option>
                    <option value="21-50">21-50 employees</option>
                    <option value="51-100">51-100 employees</option>
                    <option value="100+">100+ employees</option>
        </select>
                  <div className="select-arrow">▼</div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <span className="section-icon">🎯</span>
              <h4>Client Types</h4>
              <p>What types of clients do you work with?</p>
            </div>
            <div className="client-types-grid">
              {clientTypeOptions.map(type => (
                <div
                  key={type}
                  className={`client-type-card ${form.clientTypes.includes(type) ? 'selected' : ''}`}
                  onClick={() => handleArrayChange('clientTypes', type)}
                >
                  <div className="client-type-icon">
                    {type === 'Creators' ? '🎨' :
                     type === 'Small Businesses' ? '🏪' :
                     type === 'Enterprise Brands' ? '🏢' :
                     type === 'Non-profits' ? '🤝' :
                     type === 'Start-ups' ? '🚀' : '💼'}
                  </div>
                  <span className="client-type-label">{type}</span>
                  <div className="selection-indicator">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <span className="section-icon">⚡</span>
              <h4>Services Offered</h4>
              <p>What services does your agency provide?</p>
            </div>
            <div className="services-grid">
              {serviceOptions.map(service => (
                <div
                  key={service}
                  className={`service-card ${form.servicesOffered.includes(service) ? 'selected' : ''}`}
                  onClick={() => handleArrayChange('servicesOffered', service)}
                >
                  <div className="service-icon">
                    {service === 'Content Creation' ? '✍️' :
                     service === 'Brand Strategy' ? '🎯' :
                     service === 'Social Media Management' ? '📱' :
                     service === 'Influencer Marketing' ? '🌟' :
                     service === 'Performance Marketing' ? '📊' :
                     service === 'PR & Communications' ? '📢' : '⚡'}
                  </div>
                  <span className="service-label">{service}</span>
                  <div className="selection-indicator">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="button-group">
        <button 
          type="button" 
          className="back-btn" 
          onClick={handleBack}
          disabled={loading}
        >
          <span className="btn-icon">←</span>
          Back
        </button>
        <button 
          type="submit" 
          className={`submit-btn ${loading ? 'loading' : ''} ${success ? 'success' : ''}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Creating Account...
            </>
          ) : success ? (
            <>
              <span className="success-icon">✓</span>
              Account Created!
            </>
          ) : (
            <>
              <span className="btn-icon">🚀</span>
              Create Account
            </>
          )}
        </button>
      </div>
    </div>
  );

  const totalSteps = 4;

  return (
    <div className="signup-page">
      <button 
        className="return-home-btn"
        onClick={() => navigate('/')}
        type="button"
      >
        <span className="return-icon">←</span>
        Return to Home
      </button>
      <div className={`auth-container ${isScrolled ? 'scrolled' : ''}`}>
        <div className="signup-progress">
          {[...Array(totalSteps)].map((_, idx) => (
            <React.Fragment key={idx + 1}>
              <div className={`progress-step ${step >= idx + 1 ? 'active' : ''} ${step === idx + 1 ? 'current' : ''}`}>
                {step > idx + 1 ? '✓' : idx + 1}
              </div>
              {idx < totalSteps - 1 && <div className={`progress-line ${step > idx + 1 ? 'active' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <form className="auth-form" onSubmit={e => e.preventDefault()}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          
        {error && <div className="auth-error">{error}</div>}
      </form>
      </div>
    </div>
  );
};

export default SignUp; 