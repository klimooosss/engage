import React, { useMemo } from 'react';
import './settings.css';

const Settings = ({ 
  user, 
  settingsData, 
  setSettingsData, 
  activeSettingsTab, 
  setActiveSettingsTab, 
  sectionOpened, 
  handleSettingsSave, 
  handleToggle, 
  handleFileUpload 
}) => {
  // Settings Tab Component
  const SettingsTab = ({ tab, isActive, onClick }) => {
    const handleClick = () => {
      onClick(tab.id);
    };

    return (
      <button
        className={`settings-tab ${isActive ? 'active' : ''}`}
        onClick={handleClick}
      >
        <span className="tab-icon">{tab.icon}</span>
        <span className="tab-label">{tab.label}</span>
      </button>
    );
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ section, itemKey, checked, onChange, label, description, disabled }) => {
    const handleToggleChange = () => {
      if (!disabled) {
        onChange();
      }
    };

    return (
      <div className="toggle-item">
        <div className="toggle-info">
          <label onClick={handleToggleChange}>{label}</label>
          <p className="toggle-description">{description}</p>
        </div>
        <div className="toggle-control">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleToggleChange}
            disabled={disabled}
          />
          <span className={`toggle-slider ${checked ? 'success' : 'error'}`}></span>
        </div>
      </div>
    );
  };

  // Form Field Component
  const FormField = ({ label, type = 'text', value, onChange, options = [], fullWidth = false, required = false }) => {
    const fieldId = `form-${label.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
        <label htmlFor={fieldId}>
          {label}
          {required && <span className="required">*</span>}
        </label>
        {type === 'select' ? (
          <select
            id={fieldId}
            value={value || ''}
            onChange={onChange}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={fieldId}
            value={value || ''}
            onChange={onChange}
            rows={4}
          />
        ) : (
          <input
            id={fieldId}
            type={type}
            value={value || ''}
            onChange={onChange}
          />
        )}
      </div>
    );
  };

  // Avatar Upload Component
  const AvatarUpload = ({ avatar, onUpload, onRemove }) => {
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onUpload(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="avatar-upload">
        <div className="avatar-preview">
          {avatar ? (
            <img src={avatar} alt="Profile" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              {settingsData.profile.name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </div>
        <div className="avatar-actions">
          <label className="upload-btn">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            Upload Photo
          </label>
          {avatar && (
            <button className="remove-btn" onClick={onRemove}>
              Remove
            </button>
          )}
        </div>
      </div>
    );
  };

  // Profile Field Component
  const ProfileField = ({ label, type = 'text', value, onChange, error, placeholder, required = false, disabled = false }) => {
    const fieldId = `profile-${label.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <div className={`profile-field ${error ? 'error' : ''}`}>
        <label htmlFor={fieldId}>
          {label}
          {required && <span className="required">*</span>}
        </label>
        {type === 'textarea' ? (
          <textarea
            id={fieldId}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={4}
          />
        ) : (
          <input
            id={fieldId}
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
          />
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  };

  // Profile Settings Renderer
  const renderProfileSettings = () => (
    <div className={`settings-section ${sectionOpened.profile ? 'section-opened profile-opened' : ''}`}>
      <div className="settings-header">
        <h3>Profile Settings</h3>
        <p>Update your personal information and profile details</p>
      </div>
      
      <div className="settings-content">
        <div className="avatar-section">
          <div className="avatar-preview">
            {settingsData.profile.avatar ? (
              <img src={settingsData.profile.avatar} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {settingsData.profile.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          <div className="avatar-actions">
            <label className="upload-btn">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                style={{ display: 'none' }}
              />
              Upload Photo
            </label>
            <button className="remove-btn" onClick={() => setSettingsData(prev => ({ ...prev, profile: { ...prev.profile, avatar: null } }))}>
              Remove
            </button>
          </div>
        </div>

        <div className="form-grid">
          {[
            { label: 'Full Name', value: settingsData.profile.name, onChange: (e) => setSettingsData(prev => ({ ...prev, profile: { ...prev.profile, name: e.target.value } })) },
            { label: 'Email', type: 'email', value: settingsData.profile.email, onChange: (e) => setSettingsData(prev => ({ ...prev, profile: { ...prev.profile, email: e.target.value } })) },
            { label: 'Phone', type: 'tel', value: settingsData.profile.phone, onChange: (e) => setSettingsData(prev => ({ ...prev, profile: { ...prev.profile, phone: e.target.value } })) },
            { label: 'Location', value: settingsData.profile.location, onChange: (e) => setSettingsData(prev => ({ ...prev, profile: { ...prev.profile, location: e.target.value } })) },
            { label: 'Website', type: 'url', value: settingsData.profile.website, onChange: (e) => setSettingsData(prev => ({ ...prev, profile: { ...prev.profile, website: e.target.value } })), fullWidth: true },
            { label: 'Bio', type: 'textarea', value: settingsData.profile.bio, onChange: (e) => setSettingsData(prev => ({ ...prev, profile: { ...prev.profile, bio: e.target.value } })), fullWidth: true }
          ].map((field, index) => (
            <FormField key={index} {...field} />
          ))}
        </div>

        <div className="settings-actions">
          <button className="save-btn" onClick={() => handleSettingsSave('profile', settingsData.profile)}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  // Account Settings Renderer
  const renderAccountSettings = () => (
    <div className={`settings-section ${sectionOpened.account ? 'section-opened account-opened' : ''}`}>
      <div className="settings-header">
        <h3>Account Settings</h3>
        <p>Manage your account preferences and basic settings</p>
      </div>
      
      <div className="settings-content">
        <div className="form-grid">
          {[
            { label: 'Username', value: settingsData.account.username, onChange: (e) => setSettingsData(prev => ({ ...prev, account: { ...prev.account, username: e.target.value } })) },
            { label: 'Language', type: 'select', value: settingsData.account.language, onChange: (e) => setSettingsData(prev => ({ ...prev, account: { ...prev.account, language: e.target.value } })), options: [
              { value: 'en', label: 'English' }, { value: 'es', label: 'Spanish' }, { value: 'fr', label: 'French' }, { value: 'de', label: 'German' }
            ]},
            { label: 'Timezone', type: 'select', value: settingsData.account.timezone, onChange: (e) => setSettingsData(prev => ({ ...prev, account: { ...prev.account, timezone: e.target.value } })), options: [
              { value: 'America/New_York', label: 'Eastern Time' }, { value: 'America/Chicago', label: 'Central Time' }, { value: 'America/Denver', label: 'Mountain Time' },
              { value: 'America/Los_Angeles', label: 'Pacific Time' }, { value: 'Europe/London', label: 'London' }, { value: 'Europe/Paris', label: 'Paris' }
            ]},
            { label: 'Currency', type: 'select', value: settingsData.account.currency, onChange: (e) => setSettingsData(prev => ({ ...prev, account: { ...prev.account, currency: e.target.value } })), options: [
              { value: 'USD', label: 'USD ($)' }, { value: 'EUR', label: 'EUR (€)' }, { value: 'GBP', label: 'GBP (£)' }, { value: 'CAD', label: 'CAD (C$)' }
            ]}
          ].map((field, index) => (
            <FormField key={index} {...field} />
          ))}
        </div>

        <div className="settings-actions">
          <button className="save-btn" onClick={() => handleSettingsSave('account', settingsData.account)}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  // Notification Settings Renderer
  const renderNotificationSettings = () => (
    <div className={`settings-section ${sectionOpened.notifications ? 'section-opened notifications-opened' : ''}`}>
      <div className="settings-header">
        <h3>Notification Settings</h3>
        <p>Choose how and when you want to be notified</p>
      </div>
      
      <div className="settings-content">
        <div className="notification-categories">
          <div className="notification-category">
            <h4>Notification Channels</h4>
            <div className="toggle-group">
              {[
                { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                { key: 'push', label: 'Push Notifications', description: 'Get instant notifications in your browser' },
                { key: 'sms', label: 'SMS Notifications', description: 'Get text messages for important updates' }
              ].map(item => (
                <ToggleSwitch
                  key={item.key}
                  section="notifications"
                  itemKey={item.key}
                  checked={settingsData.notifications[item.key]}
                  onChange={() => handleToggle('notifications', item.key, !settingsData.notifications[item.key])}
                  label={item.label}
                  description={item.description}
                />
              ))}
            </div>
          </div>

          <div className="notification-category">
            <h4>Notification Types</h4>
            <div className="toggle-group">
              {[
                { key: 'deals', label: 'New Deals & Offers', description: 'Get notified about new collaboration opportunities' },
                { key: 'messages', label: 'Messages', description: 'Receive notifications for new messages and replies' },
                { key: 'payments', label: 'Payment Updates', description: 'Stay informed about payment status changes' },
                { key: 'marketing', label: 'Marketing & Updates', description: 'Receive platform news and marketing updates' }
              ].map(item => (
                <ToggleSwitch
                  key={item.key}
                  section="notifications"
                  itemKey={item.key}
                  checked={settingsData.notifications[item.key]}
                  onChange={() => handleToggle('notifications', item.key, !settingsData.notifications[item.key])}
                  label={item.label}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button className="save-btn" onClick={() => handleSettingsSave('notifications', settingsData.notifications)}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  // Security Settings Renderer
  const renderSecuritySettings = () => (
    <div className={`settings-section ${sectionOpened.security ? 'section-opened security-opened' : ''}`}>
      <div className="settings-header">
        <h3>Security Settings</h3>
        <p>Manage your account security and privacy</p>
      </div>
      
      <div className="settings-content">
        <div className="security-options">
          {[
            { key: 'twoFactor', label: 'Two-Factor Authentication', description: 'Add an extra layer of security to your account' },
            { key: 'loginAlerts', label: 'Login Alerts', description: 'Get notified when someone logs into your account' }
          ].map(item => (
            <ToggleSwitch
              key={item.key}
              section="security"
              itemKey={item.key}
              checked={settingsData.security[item.key]}
              onChange={() => handleToggle('security', item.key, !settingsData.security[item.key])}
              label={item.label}
              description={item.description}
            />
          ))}
        </div>

        <div className="settings-actions">
          <button className="save-btn" onClick={() => handleSettingsSave('security', settingsData.security)}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  // Billing Settings Renderer
  const renderBillingSettings = () => (
    <div className={`settings-section ${sectionOpened.billing ? 'section-opened billing-opened' : ''}`}>
      <div className="settings-header">
        <h3>Billing Settings</h3>
        <p>Manage your subscription and payment methods</p>
      </div>
      
      <div className="settings-content">
        <div className="billing-overview">
          <div className="plan-info">
            <h4>Current Plan</h4>
            <div className="plan-details">
              <span className="plan-name">{settingsData.billing.plan}</span>
              <span className="plan-price">$29/month</span>
            </div>
            <p>Next billing date: {settingsData.billing.nextBilling}</p>
            <ToggleSwitch
              section="billing"
              itemKey="autoRenew"
              checked={settingsData.billing.autoRenew}
              onChange={() => handleToggle('billing', 'autoRenew', !settingsData.billing.autoRenew)}
              label="Auto-renew subscription"
              description="Automatically renew your subscription when it expires"
            />
          </div>
        </div>

        <div className="settings-actions">
          <button className="save-btn" onClick={() => handleSettingsSave('billing', settingsData.billing)}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  // Memoized settings tabs
  const settingsTabs = useMemo(() => {
    const baseTabs = [
      { id: 'profile', label: 'Profile', icon: '👤' },
      { id: 'account', label: 'Account', icon: '⚙️' },
      { id: 'notifications', label: 'Notifications', icon: '🔔' },
      { id: 'security', label: 'Security', icon: '🔒' }
    ];

    if (user.role === 'brand' || user.role === 'agency') {
      baseTabs.push({ id: 'billing', label: 'Billing', icon: '💳' });
    }

    return baseTabs;
  }, [user.role]);

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        {settingsTabs.map(tab => (
          <SettingsTab
            key={tab.id}
            tab={tab}
            isActive={activeSettingsTab === tab.id}
            onClick={setActiveSettingsTab}
          />
        ))}
      </div>

      <div className="settings-main">
        {activeSettingsTab === 'profile' && renderProfileSettings()}
        {activeSettingsTab === 'account' && renderAccountSettings()}
        {activeSettingsTab === 'notifications' && renderNotificationSettings()}
        {activeSettingsTab === 'security' && renderSecuritySettings()}
        {activeSettingsTab === 'billing' && renderBillingSettings()}
      </div>
    </div>
  );
};

export default Settings; 