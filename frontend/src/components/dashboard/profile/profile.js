import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import './profile.css';

const Profile = () => {
  // Mock user data - in real app this would come from context or API
  const [user, setUser] = useState({
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'creator',
    avatar: null,
    bio: 'Passionate content creator specializing in tech reviews and lifestyle content.',
    location: 'San Francisco, CA',
    website: 'https://alexjohnson.com',
    phone: '+1 (555) 123-4567',
    socialLinks: {
      instagram: '@alexjohnson',
      youtube: '@alexjohnson',
      twitter: '@alexjohnson',
      tiktok: '@alexjohnson'
    },
    stats: {
      followers: 125000,
      following: 850,
      posts: 342,
      engagement: 4.8
    },
    categories: ['Technology', 'Lifestyle', 'Gaming'],
    verified: true
  });

  const [profileData, setProfileData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [notifications, setNotifications] = useState([]);

  // Create notification function
  const createNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type, timestamp: new Date() };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // Avatar upload component
  const AvatarUpload = ({ avatar, onUpload, onRemove }) => {
    const fileInputRef = useRef(null);
    
    const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          createNotification('Image size should be less than 5MB', 'error');
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          createNotification('Please upload an image file', 'error');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          onUpload(e.target.result);
          createNotification('Profile photo updated successfully', 'success');
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="profile-avatar-section">
        <div className="avatar-preview">
          {avatar ? (
            <img src={avatar} alt="Profile" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              {profileData.name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
          {profileData.verified && (
            <div className="verified-badge">
              <span>✓</span>
            </div>
          )}
        </div>
        {isEditing && (
          <div className="avatar-actions">
            <button 
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="btn-icon">📷</span>
              Change Photo
            </button>
            {avatar && (
              <button 
                className="remove-btn"
                onClick={() => {
                  onRemove();
                  createNotification('Profile photo removed', 'success');
                }}
              >
                <span className="btn-icon">🗑️</span>
                Remove
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        )}
      </div>
    );
  };

  // Profile field component
  const ProfileField = ({ label, value, onChange, type = 'text', error, placeholder, required, disabled = false }) => {
    const [focused, setFocused] = useState(false);
    const id = useMemo(() => `profile-${label.toLowerCase().replace(/\s+/g, '-')}`, [label]);

    return (
      <div className={`profile-field ${focused ? 'focused' : ''} ${error ? 'error' : ''}`}>
        <label htmlFor={id}>
          {label}
          {required && <span className="required">*</span>}
        </label>
        {type === 'textarea' ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            rows={4}
            disabled={disabled}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
          />
        )}
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  };

  // Social link field component
  const SocialLinkField = ({ platform, value, onChange, icon }) => {
    return (
      <div className="social-link-field">
        <div className="social-icon">{icon}</div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Your ${platform} username`}
          disabled={!isEditing}
        />
      </div>
    );
  };

  // Validation function
  const validateProfile = useCallback((profile) => {
    const errors = {};
    
    if (!profile.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!profile.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (profile.phone && !/^\+?[\d\s-()]+$/.test(profile.phone)) {
      errors.phone = 'Invalid phone number format';
    }
    
    if (profile.website && !/^https?:\/\/.+/.test(profile.website)) {
      errors.website = 'Please enter a valid website URL starting with http:// or https://';
    }
    
    return errors;
  }, []);

  // Save handler
  const handleSave = async () => {
    const errors = validateProfile(profileData);
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSaving(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(profileData);
        setIsEditing(false);
        createNotification('Profile updated successfully', 'success');
      } catch (error) {
        createNotification('Failed to update profile', 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Cancel handler
  const handleCancel = () => {
    setProfileData(user);
    setIsEditing(false);
    setErrors({});
  };

  // Profile change handler
  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="profile-section">
      <div className="profile-header">
        <div className="profile-title">
          <h2>Creator Profile</h2>
          <p>Manage your creator profile and showcase your content</p>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button 
                className={`save-btn ${isSaving ? 'loading' : ''}`}
                onClick={handleSave}
                disabled={isSaving || Object.keys(errors).length > 0}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-grid">
          {/* Left Column - Avatar and Stats */}
          <div className="profile-left">
            <div className="profile-card">
              <AvatarUpload
                avatar={profileData.avatar}
                onUpload={(avatar) => handleProfileChange('avatar', avatar)}
                onRemove={() => handleProfileChange('avatar', null)}
              />
              
              <div className="profile-info">
                <h3>{profileData.name}</h3>
                <p className="profile-role">Content Creator</p>
                {profileData.bio && (
                  <p className="profile-bio">{profileData.bio}</p>
                )}
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">125K</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">850</span>
                  <span className="stat-label">Following</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">342</span>
                  <span className="stat-label">Posts</span>
                </div>
              </div>

              <div className="profile-categories">
                <h4>Categories</h4>
                <div className="category-tags">
                  {profileData.categories.map((category, index) => (
                    <span key={index} className="category-tag">{category}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="profile-metrics-card">
              <h4>Performance Metrics</h4>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-value">4.8%</span>
                  <span className="metric-label">Engagement Rate</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">98%</span>
                  <span className="metric-label">Response Rate</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">24h</span>
                  <span className="metric-label">Avg Response Time</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">4.9</span>
                  <span className="metric-label">Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="profile-right">
            <div className="profile-form-card">
              <div className="form-section">
                <div className="form-row">
                  <ProfileField
                    label="Full Name"
                    value={profileData.name}
                    onChange={(value) => handleProfileChange('name', value)}
                    error={errors.name}
                    placeholder="Enter your full name"
                    required
                    disabled={!isEditing}
                  />
                  <ProfileField
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(value) => handleProfileChange('email', value)}
                    error={errors.email}
                    placeholder="Enter your email"
                    required
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-row">
                  <ProfileField
                    label="Phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(value) => handleProfileChange('phone', value)}
                    error={errors.phone}
                    placeholder="Enter your phone number"
                    disabled={!isEditing}
                  />
                  <ProfileField
                    label="Location"
                    value={profileData.location}
                    onChange={(value) => handleProfileChange('location', value)}
                    placeholder="Enter your location"
                    disabled={!isEditing}
                  />
                </div>

                <ProfileField
                  label="Website"
                  type="url"
                  value={profileData.website}
                  onChange={(value) => handleProfileChange('website', value)}
                  error={errors.website}
                  placeholder="Enter your website URL"
                  disabled={!isEditing}
                />

                <ProfileField
                  label="Bio"
                  type="textarea"
                  value={profileData.bio}
                  onChange={(value) => handleProfileChange('bio', value)}
                  placeholder="Tell us about yourself"
                  disabled={!isEditing}
                />
              </div>

              <div className="form-section">
                <h4>Social Media Links</h4>
                <div className="social-links-grid">
                  <SocialLinkField
                    platform="instagram"
                    value={profileData.socialLinks?.instagram || ''}
                    onChange={(value) => handleProfileChange('socialLinks', { ...profileData.socialLinks, instagram: value })}
                    icon="📷"
                  />
                  <SocialLinkField
                    platform="youtube"
                    value={profileData.socialLinks?.youtube || ''}
                    onChange={(value) => handleProfileChange('socialLinks', { ...profileData.socialLinks, youtube: value })}
                    icon="📺"
                  />
                  <SocialLinkField
                    platform="twitter"
                    value={profileData.socialLinks?.twitter || ''}
                    onChange={(value) => handleProfileChange('socialLinks', { ...profileData.socialLinks, twitter: value })}
                    icon="🐦"
                  />
                  <SocialLinkField
                    platform="tiktok"
                    value={profileData.socialLinks?.tiktok || ''}
                    onChange={(value) => handleProfileChange('socialLinks', { ...profileData.socialLinks, tiktok: value })}
                    icon="🎵"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 