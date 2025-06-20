import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Profile from './Profile';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper functions
  const getCurrentSection = useCallback(() => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/overview') return 'overview';
    if (path === '/marketplace') return 'marketplace';
    if (path === '/creators') return 'creators';
    if (path === '/analytics') return 'analytics';
    if (path === '/messages') return 'messages';
    if (path === '/settings') return 'settings';
    if (path === '/profile') return 'profile';
    if (path === '/payouts') return 'payouts';
    if (path === '/billing') return 'billing';
    return 'overview';
  }, [location.pathname]);

  // State management
  const [notifications, setNotifications] = useState([]);
  const [toggleStates, setToggleStates] = useState({});
  const [activeSection, setActiveSection] = useState(getCurrentSection());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');
  const [sectionOpened, setSectionOpened] = useState({
    profile: false,
    account: false,
    notifications: false,
    security: false,
    billing: false
  });
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'creator');
  const [timeFilter, setTimeFilter] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('engagement');
  const [analyticsInitialized, setAnalyticsInitialized] = useState(false);
  const [settingsData, setSettingsData] = useState({
    profile: {
          name: 'Demo User',
          email: 'demo@example.com',
      bio: 'This is a demo user profile.',
      avatar: null,
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      website: 'https://example.com'
    },
    account: {
      username: 'demo_user',
      language: 'en',
      timezone: 'America/New_York',
      currency: 'USD'
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      deals: true,
      messages: true,
      payments: true,
      marketing: false
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: 30
    },
    billing: {
      plan: 'Pro',
      nextBilling: '2024-02-15',
      paymentMethod: 'Visa ending in 4242',
      autoRenew: true
    }
  });

  // Profile validation function - moved to top to avoid hoisting issues
  const validateProfile = useCallback((profileData) => {
    const errors = {};
    
    if (!profileData.name || profileData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    
    if (!profileData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (profileData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(profileData.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (profileData.website && !/^https?:\/\/.+/.test(profileData.website)) {
      errors.website = 'Please enter a valid website URL starting with http:// or https://';
    }
    
    return errors;
  }, []);

  // Notification system
  const createNotification = useCallback((message, type = 'success') => {
    const newNotification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, newNotification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 3000);
  }, []);

  // Simulate backend call
  const simulateBackendCall = useCallback((key, newValue) => {
    return new Promise((resolve, reject) => {
      // Simulate random success/failure with 80% success rate
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve();
        } else {
          reject(new Error('Failed to update setting'));
        }
      }, 600); // Simulate network delay
    });
  }, []);

  // Generic toggle handler for all settings
  const handleToggle = useCallback(async (section, key, checked) => {
    // Set loading state
    setToggleStates(prev => ({
      ...prev,
      [`${section}.${key}`]: { loading: true }
    }));

    try {
      // Simulate backend call
      await simulateBackendCall(key, checked);

      // Update state
      setSettingsData(prev => ({
        ...prev,
        [section]: { ...prev[section], [key]: checked }
      }));

      // Show success state
      setToggleStates(prev => ({
        ...prev,
        [`${section}.${key}`]: { success: true }
      }));

      // Clear success state after animation
      setTimeout(() => {
        setToggleStates(prev => ({
          ...prev,
          [`${section}.${key}`]: {}
        }));
      }, 1000);

      createNotification(`${key.charAt(0).toUpperCase() + key.slice(1)} ${checked ? 'enabled' : 'disabled'}`, 'success');
    } catch (error) {
      // Show error state
      setToggleStates(prev => ({
        ...prev,
        [`${section}.${key}`]: { error: true }
      }));

      // Clear error state after animation
      setTimeout(() => {
        setToggleStates(prev => ({
          ...prev,
          [`${section}.${key}`]: {}
        }));
      }, 1000);

      createNotification(error.message, 'error');
    }
  }, [createNotification, simulateBackendCall]);

  // Sync active tab with URL
  useEffect(() => {
    const currentSection = getCurrentSection();
    setActiveSection(currentSection);
  }, [location.pathname, getCurrentSection]);

  // Set analytics as initialized when analytics section is first rendered
  useEffect(() => {
    if (activeSection === 'analytics' && !analyticsInitialized) {
      setAnalyticsInitialized(true);
    }
  }, [activeSection, analyticsInitialized]);

  // Memoized user data
  const user = useMemo(() => {
    return {
      name: 'Demo User',
      email: 'demo@example.com',
      role: location.state?.role || userRole,
      bio: 'This is a demo user profile.',
      stats: {
        followers: 12500,
        engagementRate: 3.2,
        totalEarnings: 15750,
        activeDeals: 3
      }
    };
  }, [location.state?.role, userRole]);

  // Save role to localStorage when it's provided via location.state
  useEffect(() => {
    if (location.state?.role) {
      localStorage.setItem('userRole', location.state.role);
      setUserRole(location.state.role);
    }
  }, [location.state?.role]);

  // Redirect to sign in if no role is provided
  useEffect(() => {
    console.log('Location state:', location.state);
    console.log('Stored role:', localStorage.getItem('userRole'));
    const hasRole = location.state?.role || localStorage.getItem('userRole');
    if (!hasRole) {
      console.log('No role found, redirecting to signin');
      navigate('/signin');
    }
  }, [location.state, navigate]);

  // Redirect from /dashboard to /overview for better UX
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      navigate('/overview', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Navigation handler
  const handleNavigation = useCallback((section) => {
    setActiveSection(section);
    navigate(`/${section}`);
  }, [navigate]);

  // Optimized handlers with useCallback
  const handleLogout = useCallback(() => {
    localStorage.removeItem('userRole');
    setUserRole('creator');
    navigate('/signin');
  }, [navigate]);

  const handleActionButton = useCallback((action, role) => {
    const actionMap = {
      'browse-deals': 'marketplace',
      'update-profile': 'profile',
      'create-deal': 'marketplace',
      'view-analytics': 'analytics',
      'browse-offers': 'marketplace',
      'add-creator': 'creators'
    };
    
    const targetTab = actionMap[action];
    if (targetTab) {
      handleNavigation(targetTab);
    } else {
      console.log(`Action: ${action} for role: ${role}`);
    }
  }, [handleNavigation]);

  const handleDealAction = useCallback((dealId, action) => {
    console.log(`${action} deal: ${dealId}`);
    createNotification(`Deal ${action} successfully`);
  }, [createNotification]);

  const handleApplicationAction = useCallback((applicationId, action) => {
    console.log(`${action} application: ${applicationId}`);
    createNotification(`Application ${action} successfully`);
  }, [createNotification]);

  const handleOfferAction = useCallback((offerId, action) => {
    console.log(`${action} offer: ${offerId}`);
    createNotification(`Offer ${action} successfully`);
  }, [createNotification]);

  const handleViewAll = useCallback((section) => {
    const sectionMap = {
      'activity': 'analytics',
      'creators': 'creators',
      'offers': 'marketplace'
    };
    
    const targetTab = sectionMap[section];
    if (targetTab) {
      handleNavigation(targetTab);
    } else {
      console.log(`View all ${section}`);
    }
  }, [handleNavigation]);

  const handleTimeFilterChange = useCallback((timeframe) => {
    console.log(`Time filter changed to: ${timeframe}`);
  }, []);

  const handleSettingsSave = useCallback(async (section, data) => {
    try {
      await simulateBackendCall(section, data);
      createNotification(`${section} settings saved successfully`, 'success');
    } catch (error) {
      createNotification(`Failed to save ${section} settings`, 'error');
    }
  }, [simulateBackendCall, createNotification]);

  const handleFileUpload = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSettingsData(prev => ({
        ...prev,
        profile: { ...prev.profile, avatar: e.target.result }
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDeleteAccount = useCallback(() => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
      localStorage.removeItem('userRole');
      setUserRole('creator');
    navigate('/signin');
    }
  }, [navigate]);

  const handleUpdatePaymentMethod = useCallback(() => {
    createNotification('Payment method update feature coming soon!', 'info');
  }, [createNotification]);

  const handleChangePassword = useCallback(() => {
    createNotification('Password change feature coming soon!', 'info');
  }, [createNotification]);

  const handleExportData = useCallback(() => {
    createNotification('Data export feature coming soon!', 'info');
  }, [createNotification]);

  const handleDownloadInvoice = useCallback(() => {
    createNotification('Invoice download feature coming soon!', 'info');
  }, [createNotification]);

  const handleUpgradePlan = useCallback(() => {
    createNotification('Plan upgrade feature coming soon!', 'info');
  }, [createNotification]);

  const handleCancelSubscription = useCallback(() => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
      createNotification('Subscription cancellation request submitted', 'warning');
    }
  }, [createNotification]);

  // Memoized menu items
  const menuItems = useMemo(() => {
    const baseItems = [
      { id: 'overview', label: 'Overview', icon: '📊', description: 'Snapshot: earnings, top creators, recent activity' },
      { id: 'marketplace', label: 'Marketplace', icon: '🏪', description: 'Browse offers, assign to creators, manage deals' },
      { id: 'creators', label: 'Creators', icon: '👥', description: 'Manage and monitor linked creators' },
      { id: 'analytics', label: 'Analytics', icon: '📈', description: 'Deep metrics: top creators, campaign ROI, revenue trends' },
      { id: 'messages', label: 'Messages', icon: '💬', description: 'DM with creators & brands' },
      { id: 'settings', label: 'Settings', icon: '⚙️', description: 'Account info, billing, permissions' }
    ];

    if (user.role === 'agency') {
      return baseItems;
    } else if (user.role === 'brand') {
      return [
        ...baseItems.slice(0, 5),
        { id: 'billing', label: 'Billing', icon: '💳', description: 'Add funds, invoices, transaction history' },
        baseItems[5]
      ];
    } else {
      // Creator
      return [
        baseItems[0],
        baseItems[1],
        { id: 'profile', label: 'Profile', icon: '👤', description: 'Update niche, audience stats, linked accounts' },
        baseItems[3],
        baseItems[4],
        { id: 'payouts', label: 'Payouts', icon: '💰', description: 'Pending + completed payments' },
        baseItems[5]
      ];
    }
  }, [user.role]);

  // Reusable components
  const StatCard = ({ icon, value, label, trend, isPrimary = false }) => (
    <div className={`stat-card ${isPrimary ? 'primary' : ''}`}>
      <div className="stat-header">
        <span className="stat-icon">{icon}</span>
        {trend && <span className={`stat-trend ${trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral'}`}>
          {trend > 0 ? '+' : ''}{trend}
        </span>}
      </div>
      <div className="stat-info">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );

  const ChartComponent = ({ title, timeFilter = true }) => (
    <div className="overview-card earnings-chart">
      <div className="card-header">
        <h3>{title}</h3>
        {timeFilter && (
          <div className="card-actions">
            <select 
              className="time-filter"
              onChange={(e) => handleTimeFilterChange(e.target.value)}
            >
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last 6 months</option>
            </select>
          </div>
        )}
      </div>
      <div className="chart-container">
        <div className="chart-bars">
          {[60, 80, 40, 90, 70, 85].map((height, index) => (
            <div key={index} className="chart-bar" style={{ height: `${height}%` }}></div>
          ))}
        </div>
        <div className="chart-labels">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
    </div>
  );

  const ActionButtons = ({ primary, secondary, onPrimary, onSecondary }) => (
    <div className="overview-actions">
      <button className="action-btn primary" onClick={onPrimary}>
        {primary}
      </button>
      <button className="action-btn secondary" onClick={onSecondary}>
        {secondary}
      </button>
    </div>
  );

  // Overview renderers
  const renderCreatorOverview = () => (
    <div className="dashboard-content">
      <div className="overview-header">
        <div className="overview-welcome">
          <h2>Creator Overview</h2>
          <p>Track your growth, earnings, and upcoming opportunities</p>
        </div>
        <ActionButtons
          primary="Browse New Deals"
          secondary="Update Profile"
          onPrimary={() => handleActionButton('browse-deals', 'creator')}
          onSecondary={() => handleActionButton('update-profile', 'creator')}
        />
      </div>

      <div className="overview-stats">
        <StatCard icon="💰" value={`$${user.stats.totalEarnings.toLocaleString()}`} label="Total Earnings" trend="+12.5%" isPrimary />
        <StatCard icon="👥" value={user.stats.followers.toLocaleString()} label="Followers" trend="+8.2%" />
        <StatCard icon="📈" value={`${user.stats.engagementRate}%`} label="Engagement Rate" trend="+0.3%" />
        <StatCard icon="🤝" value={user.stats.activeDeals} label="Active Deals" trend="0" />
      </div>

      <div className="overview-grid">
        <ChartComponent title="Earnings Trend" />
        
        <div className="overview-card active-deals">
          <div className="card-header">
            <h3>Active Deals</h3>
            <span className="deal-count">{user.stats.activeDeals} deals</span>
          </div>
          <div className="deal-list">
            {[
              { name: 'Summer Collection Campaign', brand: 'Fashion Brand Co.', amount: '$2,500', progress: 75, status: 'active' },
              { name: 'Tech Review Series', brand: 'Gadget World', amount: '$1,800', progress: 45, status: 'pending' }
            ].map((deal, index) => (
              <div key={index} className="deal-item">
                <div className="deal-info">
                  <h4>{deal.name}</h4>
                  <p>{deal.brand} • {deal.amount}</p>
                  <div className="deal-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${deal.progress}%` }}></div>
                    </div>
                    <span>{deal.progress}% complete</span>
                  </div>
                </div>
                <span className={`deal-status ${deal.status}`}>{deal.status === 'active' ? 'Active' : 'In Progress'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-card recent-activity">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="view-all-btn" onClick={() => handleViewAll('activity')}>
              View All
            </button>
          </div>
          <div className="activity-list">
            {[
              { icon: '💰', title: 'Payment Received', desc: 'Summer Collection Campaign completed', time: '2 hours ago', amount: '+$2,500' },
              { icon: '🤝', title: 'New Deal Accepted', desc: 'Tech Review Series from Gadget World', time: '1 day ago', amount: '$1,800' },
              { icon: '📈', title: 'Follower Growth', desc: 'Gained 250 new followers', time: '2 days ago', amount: '+250' }
            ].map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <h4>{activity.title}</h4>
                  <p>{activity.desc}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
                <span className="activity-amount">{activity.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-card upcoming-deadlines">
          <div className="card-header">
            <h3>Upcoming Deadlines</h3>
            <span className="deadline-count">3 due this week</span>
          </div>
          <div className="deadline-list">
            {[
              { name: 'Summer Collection Content', brand: 'Fashion Brand Co.', time: 'Due in 2 days', urgent: true },
              { name: 'Tech Review Video', brand: 'Gadget World', time: 'Due in 5 days', urgent: false }
            ].map((deadline, index) => (
              <div key={index} className={`deadline-item ${deadline.urgent ? 'urgent' : ''}`}>
                <div className="deadline-info">
                  <h4>{deadline.name}</h4>
                  <p>{deadline.brand}</p>
                  <span className="deadline-time">{deadline.time}</span>
                </div>
                <span className={`deadline-status ${deadline.urgent ? 'urgent' : ''}`}>
                  {deadline.urgent ? 'Urgent' : 'On Track'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBrandOverview = () => (
    <div className="dashboard-content">
      <div className="overview-header">
        <div className="overview-welcome">
          <h2>Brand Overview</h2>
          <p>Monitor your campaigns, creator performance, and ROI</p>
        </div>
        <ActionButtons
          primary="Create New Deal"
          secondary="View Analytics"
          onPrimary={() => handleActionButton('create-deal', 'brand')}
          onSecondary={() => handleActionButton('view-analytics', 'brand')}
        />
      </div>

      <div className="overview-stats">
        <StatCard icon="💰" value="$45,250" label="Total Spend" trend="+15.3%" isPrimary />
        <StatCard icon="📊" value="2.4%" label="Conversion Rate" trend="+0.8%" />
        <StatCard icon="🤝" value="12" label="Active Deals" trend="+2" />
        <StatCard icon="👥" value="8" label="Selected Creators" trend="+1" />
      </div>

      <div className="overview-grid">
        <ChartComponent title="Campaign Performance" />
        
        <div className="overview-card top-creators">
          <div className="card-header">
            <h3>Top Performing Creators</h3>
            <button className="view-all-btn" onClick={() => handleViewAll('creators')}>
              View All
            </button>
          </div>
          <div className="creator-list">
            {[
              { avatar: 'TC', name: 'Tech Creator Pro', followers: '3.2M', engagement: '4.8%', roi: '3.5x', reach: '2.1M', earnings: '$8,500' },
              { avatar: 'LC', name: 'Lifestyle Creator', followers: '1.8M', engagement: '5.2%', roi: '4.1x', reach: '1.5M', earnings: '$6,200' }
            ].map((creator, index) => (
              <div key={index} className="creator-item">
                <div className="creator-avatar">{creator.avatar}</div>
                <div className="creator-info">
                  <h4>{creator.name}</h4>
                  <p>{creator.followers} followers • {creator.engagement} engagement</p>
                  <div className="creator-stats">
                    <span>ROI: {creator.roi}</span>
                    <span>Reach: {creator.reach}</span>
                  </div>
                </div>
                <span className="creator-earnings">{creator.earnings}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-card recent-applications">
          <div className="card-header">
            <h3>Recent Applications</h3>
            <span className="application-count">5 pending</span>
          </div>
          <div className="application-list">
            {[
              { name: 'Fashion Influencer', campaign: 'Summer Collection Campaign', time: '2 hours ago', id: 'app1' },
              { name: 'Tech Reviewer', campaign: 'Product Launch Campaign', time: '1 day ago', id: 'app2' }
            ].map((app, index) => (
              <div key={index} className="application-item">
                <div className="application-info">
                  <h4>{app.name}</h4>
                  <p>Applied for {app.campaign}</p>
                  <span className="application-time">{app.time}</span>
                </div>
                <div className="application-actions">
                  <button className="btn-approve" onClick={() => handleApplicationAction(app.id, 'approved')}>
                    Approve
                  </button>
                  <button className="btn-reject" onClick={() => handleApplicationAction(app.id, 'rejected')}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-card roi-breakdown">
          <div className="card-header">
            <h3>ROI Breakdown</h3>
            <span className="roi-summary">Avg. ROI: 3.2x</span>
          </div>
          <div className="roi-metrics">
            {[
              { label: 'Cost per Result', value: '$2.45' },
              { label: 'Total Reach', value: '15.2M' },
              { label: 'Engagement Rate', value: '4.8%' },
              { label: 'Click-through Rate', value: '2.1%' }
            ].map((metric, index) => (
              <div key={index} className="roi-item">
                <span className="roi-label">{metric.label}</span>
                <span className="roi-value">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAgencyOverview = () => (
    <div className="dashboard-content">
      <div className="overview-header">
        <div className="overview-welcome">
          <h2>Agency Overview</h2>
          <p>Manage your creators, track revenue, and monitor performance</p>
        </div>
        <ActionButtons
          primary="Browse Offers"
          secondary="Add Creator"
          onPrimary={() => handleActionButton('browse-offers', 'agency')}
          onSecondary={() => handleActionButton('add-creator', 'agency')}
        />
      </div>

      <div className="overview-stats">
        <StatCard icon="💰" value="$125,750" label="Total Revenue" trend="+18.7%" isPrimary />
        <StatCard icon="👥" value="45" label="Managed Creators" trend="+3" />
        <StatCard icon="🤝" value="28" label="Active Deals" trend="+5" />
        <StatCard icon="📈" value="4.8" label="Avg. Rating" trend="+0.2" />
      </div>

      <div className="overview-grid">
        <ChartComponent title="Revenue Trend" />
        
        <div className="overview-card top-earners">
          <div className="card-header">
            <h3>Top Earning Creators</h3>
            <button className="view-all-btn" onClick={() => handleViewAll('creators')}>
              View All
            </button>
          </div>
          <div className="creator-list">
            {[
              { avatar: 'SJ', name: 'Sarah Johnson', niche: 'Fashion & Lifestyle', followers: '2.1M', deals: 8, success: '95%', earnings: '$12,500' },
              { avatar: 'MC', name: 'Mike Chen', niche: 'Tech Reviews', followers: '1.8M', deals: 6, success: '92%', earnings: '$8,900' }
            ].map((creator, index) => (
              <div key={index} className="creator-item">
                <div className="creator-avatar">{creator.avatar}</div>
                <div className="creator-info">
                  <h4>{creator.name}</h4>
                  <p>{creator.niche} • {creator.followers} followers</p>
                  <div className="creator-stats">
                    <span>Deals: {creator.deals}</span>
                    <span>Success: {creator.success}</span>
                  </div>
                </div>
                <span className="creator-earnings">{creator.earnings}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-card pending-offers">
          <div className="card-header">
            <h3>Pending Offers</h3>
            <span className="offer-count">12 offers</span>
          </div>
          <div className="offer-list">
            {[
              { name: 'Summer Fashion Campaign', brand: 'Fashion Brand Co.', amount: '$15,000', time: 'Received 2 hours ago', id: 'offer1' },
              { name: 'Tech Product Launch', brand: 'Gadget World', amount: '$22,000', time: 'Received 1 day ago', id: 'offer2' }
            ].map((offer, index) => (
              <div key={index} className="offer-item">
                <div className="offer-info">
                  <h4>{offer.name}</h4>
                  <p>{offer.brand} • {offer.amount}</p>
                  <span className="offer-time">{offer.time}</span>
                </div>
                <div className="offer-actions">
                  <button className="btn-accept" onClick={() => handleOfferAction(offer.id, 'accepted')}>
                    Accept
                  </button>
                  <button className="btn-negotiate" onClick={() => handleOfferAction(offer.id, 'negotiated')}>
                    Negotiate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-card performance-metrics">
          <div className="card-header">
            <h3>Performance Metrics</h3>
            <span className="metrics-summary">This month</span>
          </div>
          <div className="metrics-grid">
            {[
              { value: '85%', label: 'Success Rate' },
              { value: '2.1x', label: 'Avg. Commission' },
              { value: '4.2', label: 'Avg. Rating' },
              { value: '12', label: 'New Deals' }
            ].map((metric, index) => (
              <div key={index} className="metric-item">
                <span className="metric-value">{metric.value}</span>
                <span className="metric-label">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Settings components
  const SettingsTab = ({ tab, isActive, onClick }) => {
    const handleClick = () => {
      onClick(tab.id);
      // Reset all sections to not opened
      setSectionOpened(prev => Object.keys(prev).reduce((acc, key) => ({
        ...acc,
        [key]: false
      }), {}));
      
      // Set the clicked section as opened
      setTimeout(() => {
        setSectionOpened(prev => ({
          ...prev,
          [tab.id]: true
        }));
      }, 50);

      // Remove the opened state after animation completes
      setTimeout(() => {
        setSectionOpened(prev => ({
          ...prev,
          [tab.id]: false
        }));
      }, 900); // 0.5s for fadeInUp + 0.4s max delay = 0.9s total
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

  // Enhanced ToggleSwitch component with proper event handling
  const ToggleSwitch = ({ section, itemKey, checked, onChange, label, description, disabled }) => {
    const toggleState = toggleStates[`${section}.${itemKey}`] || {};
    
    const handleToggleChange = () => {
      if (!disabled && !toggleState.loading) {
        onChange();
      }
    };

  return (
      <div className="toggle-item">
        <div className="toggle-info">
          <label htmlFor={`toggle-${section}-${itemKey}`}>{label}</label>
          {description && <p className="toggle-description">{description}</p>}
      </div>
        <div 
          className="toggle-control"
          onClick={handleToggleChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggleChange();
            }
          }}
          role="switch"
          aria-checked={checked}
          tabIndex={disabled ? -1 : 0}
        >
          <input
            id={`toggle-${section}-${itemKey}`}
            type="checkbox"
            checked={checked}
            onChange={handleToggleChange}
            disabled={disabled || toggleState.loading}
          />
          <span 
            className={`toggle-slider ${toggleState.loading ? 'loading' : ''} ${toggleState.error ? 'error' : ''} ${toggleState.success ? 'success' : ''}`}
          />
        </div>
      </div>
    );
  };

  const FormField = ({ label, type = 'text', value, onChange, options = [], fullWidth = false, required = false }) => {
    const fieldId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
      <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
        <label htmlFor={fieldId}>
          {label}
          {required && <span className="required">*</span>}
        </label>
        {type === 'select' ? (
          <select id={fieldId} value={value} onChange={onChange}>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={fieldId}
            value={value}
            onChange={onChange}
            rows={4}
          />
        ) : (
          <input
            id={fieldId}
            type={type}
            value={value}
            onChange={onChange}
          />
        )}
      </div>
    );
  };

  // Profile section state
  const [profileData, setProfileData] = useState(settingsData.profile);
  const [profileErrors, setProfileErrors] = useState({});
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  // Profile section handlers
  const handleProfileChange = useCallback((field, value) => {
    setProfileData(prev => {
      const updated = { ...prev, [field]: value };
      const validationErrors = validateProfile(updated);
      setProfileErrors(validationErrors);
      return updated;
    });
  }, [validateProfile]);

  const handleProfileSave = useCallback(async () => {
    const validationErrors = validateProfile(profileData);
    setProfileErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      createNotification('Please fix the errors before saving', 'error');
      return;
    }

    setIsProfileSaving(true);
    try {
      await simulateBackendCall('profile', profileData);
      setSettingsData(prev => ({ ...prev, profile: profileData }));
      setIsProfileEditing(false);
      createNotification('Profile updated successfully', 'success');
    } catch (error) {
      createNotification('Failed to update profile', 'error');
    } finally {
      setIsProfileSaving(false);
    }
  }, [profileData, validateProfile, createNotification, simulateBackendCall]);

  const handleProfileCancel = useCallback(() => {
    setProfileData(settingsData.profile);
    setProfileErrors({});
    setIsProfileEditing(false);
  }, [settingsData.profile]);

  // Profile section renderer
  const renderProfileSection = () => {
    return <Profile />;
  };

  // Social link field component
  const SocialLinkField = ({ platform, value, onChange, icon, disabled = false }) => {
    return (
      <div className="social-link-field">
        <div className="social-icon">{icon}</div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Your ${platform} username`}
          disabled={disabled}
        />
      </div>
    );
  };

  // Settings renderers
  const renderSettings = () => (
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

  // Overview renderer
  const renderOverview = () => {
    console.log('Rendering overview for role:', user.role);
    try {
      switch (user.role) {
        case 'creator':
          console.log('Rendering creator overview');
          return renderCreatorOverview();
        case 'brand':
          console.log('Rendering brand overview');
          return renderBrandOverview();
        case 'agency':
          console.log('Rendering agency overview');
          return renderAgencyOverview();
        default:
          console.log('Rendering default creator overview');
          return renderCreatorOverview();
      }
    } catch (error) {
      console.error('Error rendering overview:', error);
      return (
        <div className="overview-header">
          <div className="overview-welcome">
            <h2>Overview</h2>
            <p>Welcome to your dashboard! Role: {user.role}</p>
          </div>
        </div>
      );
    }
  };

  // Main content renderer
  const renderMainContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'marketplace':
        return renderMarketplace();
      case 'creators':
        return renderCreators();
      case 'analytics':
        return renderAnalytics();
      case 'messages':
        return renderMessages();
      case 'settings':
        return renderSettings();
      case 'profile':
        return renderProfileSection();
      case 'payouts':
        return renderPayouts();
      case 'billing':
        return renderBilling();
      default:
        return renderOverview();
    }
  };

  // Settings renderers
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

  // Missing render functions for other sections
  const renderMarketplace = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <div className="section-title">
          <h2>Marketplace</h2>
          <p>Discover and connect with brands and creators</p>
        </div>
      </div>
      <div className="section-content">
        <p>Marketplace section coming soon...</p>
      </div>
    </div>
  );

  const renderCreators = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <div className="section-title">
          <h2>Creators</h2>
          <p>Manage your creator network and collaborations</p>
        </div>
      </div>
      <div className="section-content">
        <p>Creators section coming soon...</p>
      </div>
    </div>
  );

  const renderAnalytics = () => {
    // Mock analytics data for different roles
    const analyticsData = {
      creator: {
        overview: {
          totalEarnings: 15750,
          totalEngagement: 125000,
          totalReach: 890000,
          totalCollaborations: 24,
          growthRate: 12.5,
          avgEngagementRate: 4.8
        },
        trends: {
          earnings: [1200, 1800, 2100, 1900, 2400, 2800, 3200, 2900, 3500, 3800, 4200, 4500],
          engagement: [8500, 9200, 10800, 12500, 14200, 15800, 17500, 19200, 21000, 22800, 24500, 26200],
          reach: [65000, 72000, 85000, 98000, 112000, 128000, 145000, 162000, 180000, 198000, 217000, 236000],
          collaborations: [2, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8]
        },
        topContent: [
          { id: 1, title: 'Tech Review: Latest Smartphone', platform: 'YouTube', engagement: 15420, reach: 89000, earnings: 1200 },
          { id: 2, title: 'Lifestyle Vlog: Day in the Life', platform: 'Instagram', engagement: 12850, reach: 67000, earnings: 950 },
          { id: 3, title: 'Gaming Stream: New Release', platform: 'Twitch', engagement: 11200, reach: 45000, earnings: 800 },
          { id: 4, title: 'Tutorial: Photography Tips', platform: 'YouTube', engagement: 9850, reach: 52000, earnings: 650 },
          { id: 5, title: 'Behind the Scenes', platform: 'TikTok', engagement: 8750, reach: 38000, earnings: 550 }
        ],
        platformPerformance: [
          { platform: 'YouTube', followers: 45000, engagement: 3.2, reach: 180000, earnings: 6800 },
          { platform: 'Instagram', followers: 32000, engagement: 4.8, reach: 120000, earnings: 4200 },
          { platform: 'TikTok', followers: 28000, engagement: 6.1, reach: 95000, earnings: 2800 },
          { platform: 'Twitter', followers: 15000, engagement: 2.9, reach: 45000, earnings: 1200 },
          { platform: 'Twitch', followers: 8000, engagement: 8.5, reach: 35000, earnings: 750 }
        ],
        // New creator-specific data
        topPayingBrands: [
          { brand: 'TechCorp Inc.', totalPaid: 4200, deals: 3, avgPerDeal: 1400 },
          { brand: 'Fashion Forward', totalPaid: 3800, deals: 2, avgPerDeal: 1900 },
          { brand: 'HealthPlus', totalPaid: 3200, deals: 4, avgPerDeal: 800 },
          { brand: 'Foodie Delights', totalPaid: 2800, deals: 3, avgPerDeal: 933 },
          { brand: 'Travel Dreams', totalPaid: 2200, deals: 2, avgPerDeal: 1100 }
        ],
        dealStats: {
          pendingEarnings: 3200,
          paidEarnings: 12550,
          approvalRate: 87,
          applicationToAcceptance: 0.23
        },
        dealTimeline: [
          { month: 'Jan', completed: 2, pending: 1, rejected: 0 },
          { month: 'Feb', completed: 3, pending: 2, rejected: 1 },
          { month: 'Mar', completed: 4, pending: 1, rejected: 0 },
          { month: 'Apr', completed: 2, pending: 3, rejected: 1 },
          { month: 'May', completed: 5, pending: 2, rejected: 0 },
          { month: 'Jun', completed: 3, pending: 1, rejected: 1 }
        ],
        clicksViewsPerDeal: [
          { deal: 'Tech Review', clicks: 15420, views: 89000, conversion: 17.3 },
          { deal: 'Lifestyle Post', clicks: 12850, views: 67000, conversion: 19.2 },
          { deal: 'Gaming Stream', clicks: 11200, views: 45000, conversion: 24.9 },
          { deal: 'Tutorial Video', clicks: 9850, views: 52000, conversion: 18.9 },
          { deal: 'Behind Scenes', clicks: 8750, views: 38000, conversion: 23.0 }
        ]
      },
      brand: {
        overview: {
          totalSpent: 45000,
          totalReach: 2500000,
          totalEngagement: 180000,
          totalCampaigns: 12,
          avgROI: 3.2,
          avgCPM: 18.5
        },
        trends: {
          spend: [3000, 4200, 3800, 5000, 4500, 6000, 5500, 7000, 6500, 8000, 7500, 9000],
          reach: [180000, 220000, 200000, 280000, 250000, 320000, 300000, 380000, 350000, 420000, 400000, 480000],
          engagement: [12000, 15000, 14000, 20000, 18000, 25000, 23000, 30000, 28000, 35000, 33000, 40000],
          campaigns: [1, 2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 7]
        },
        topCampaigns: [
          { id: 1, title: 'Summer Product Launch', creator: 'TechGuru', reach: 450000, engagement: 32000, spend: 8500, roi: 4.2 },
          { id: 2, title: 'Holiday Special', creator: 'LifestylePro', reach: 380000, engagement: 28000, spend: 7200, roi: 3.8 },
          { id: 3, title: 'Brand Awareness', creator: 'GamingMaster', reach: 320000, engagement: 22000, spend: 6500, roi: 3.1 },
          { id: 4, title: 'Product Demo', creator: 'FitnessCoach', reach: 280000, engagement: 19000, spend: 5800, roi: 2.9 },
          { id: 5, title: 'Behind the Scenes', creator: 'TravelVlogger', reach: 240000, engagement: 16000, spend: 5200, roi: 2.6 }
        ],
        creatorPerformance: [
          { creator: 'TechGuru', followers: 85000, engagement: 4.2, reach: 450000, cost: 8500, roi: 4.2 },
          { creator: 'LifestylePro', followers: 62000, engagement: 5.1, reach: 380000, cost: 7200, roi: 3.8 },
          { creator: 'GamingMaster', followers: 45000, engagement: 6.8, reach: 320000, cost: 6500, roi: 3.1 },
          { creator: 'FitnessCoach', followers: 38000, engagement: 4.9, reach: 280000, cost: 5800, roi: 2.9 },
          { creator: 'TravelVlogger', followers: 32000, engagement: 5.3, reach: 240000, cost: 5200, roi: 2.6 }
        ],
        // New brand-specific data
        dealStatus: {
          pending: 8,
          active: 15,
          completed: 24,
          rejected: 3
        },
        creatorResponseRate: 94,
        impressionsVsClicks: [
          { month: 'Jan', impressions: 180000, clicks: 12000, conversions: 2400 },
          { month: 'Feb', impressions: 220000, clicks: 15000, conversions: 3000 },
          { month: 'Mar', impressions: 200000, clicks: 14000, conversions: 2800 },
          { month: 'Apr', impressions: 280000, clicks: 20000, conversions: 4000 },
          { month: 'May', impressions: 250000, clicks: 18000, conversions: 3600 },
          { month: 'Jun', impressions: 320000, clicks: 25000, conversions: 5000 }
        ],
        costPerConversion: {
          cpc: 0.85,
          cpi: 0.12,
          cpa: 4.25
        },
        revenueAttribution: [
          { deal: 'Tech Review', revenue: 8500, attributed: 7200, attribution: 84.7 },
          { deal: 'Lifestyle Post', revenue: 7200, attributed: 6100, attribution: 84.7 },
          { deal: 'Gaming Stream', revenue: 6500, attributed: 5200, attribution: 80.0 },
          { deal: 'Tutorial Video', revenue: 5800, attributed: 4600, attribution: 79.3 },
          { deal: 'Behind Scenes', revenue: 5200, attributed: 4100, attribution: 78.8 }
        ]
      },
      agency: {
        overview: {
          totalRevenue: 125000,
          totalClients: 18,
          totalCampaigns: 45,
          avgClientValue: 6944,
          growthRate: 8.7,
          avgCampaignSuccess: 92
        },
        trends: {
          revenue: [8000, 12000, 11000, 15000, 14000, 18000, 17000, 22000, 21000, 25000, 24000, 28000],
          clients: [12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18],
          campaigns: [35, 37, 36, 39, 38, 41, 40, 43, 42, 45, 44, 47],
          success: [88, 89, 87, 91, 90, 93, 92, 94, 93, 95, 94, 96]
        },
        topClients: [
          { id: 1, name: 'TechCorp Inc.', industry: 'Technology', revenue: 25000, campaigns: 8, avgROI: 3.8 },
          { id: 2, name: 'Fashion Forward', industry: 'Fashion', revenue: 22000, campaigns: 6, avgROI: 4.2 },
          { id: 3, name: 'HealthPlus', industry: 'Healthcare', revenue: 18000, campaigns: 5, avgROI: 3.5 },
          { id: 4, name: 'Foodie Delights', industry: 'Food & Beverage', revenue: 15000, campaigns: 4, avgROI: 3.9 },
          { id: 5, name: 'Travel Dreams', industry: 'Travel', revenue: 12000, campaigns: 3, avgROI: 3.2 }
        ],
        campaignPerformance: [
          { type: 'Brand Awareness', count: 15, avgReach: 350000, avgEngagement: 25000, successRate: 93 },
          { type: 'Product Launch', count: 12, avgReach: 280000, avgEngagement: 22000, successRate: 89 },
          { type: 'Lead Generation', count: 8, avgReach: 200000, avgEngagement: 18000, successRate: 87 },
          { type: 'Sales Promotion', count: 6, avgReach: 180000, avgEngagement: 15000, successRate: 91 },
          { type: 'Event Marketing', count: 4, avgReach: 120000, avgEngagement: 12000, successRate: 95 }
        ],
        // New agency-specific data
        topPerformingCreators: [
          { creator: 'TechGuru', totalEarnings: 8500, deals: 8, avgDealValue: 1062, conversionRate: 92 },
          { creator: 'LifestylePro', totalEarnings: 7200, deals: 6, avgDealValue: 1200, conversionRate: 88 },
          { creator: 'GamingMaster', totalEarnings: 6500, deals: 7, avgDealValue: 928, conversionRate: 85 },
          { creator: 'FitnessCoach', totalEarnings: 5800, deals: 5, avgDealValue: 1160, conversionRate: 90 },
          { creator: 'TravelVlogger', totalEarnings: 5200, deals: 4, avgDealValue: 1300, conversionRate: 87 }
        ],
        dealConversionRates: [
          { creator: 'TechGuru', applied: 12, accepted: 8, conversion: 66.7 },
          { creator: 'LifestylePro', applied: 10, accepted: 6, conversion: 60.0 },
          { creator: 'GamingMaster', applied: 15, accepted: 7, conversion: 46.7 },
          { creator: 'FitnessCoach', applied: 8, accepted: 5, conversion: 62.5 },
          { creator: 'TravelVlogger', applied: 11, accepted: 4, conversion: 36.4 }
        ],
        avgDealValuePerCreator: [
          { creator: 'TechGuru', avgValue: 1062, totalDeals: 8 },
          { creator: 'LifestylePro', avgValue: 1200, totalDeals: 6 },
          { creator: 'GamingMaster', avgValue: 928, totalDeals: 7 },
          { creator: 'FitnessCoach', avgValue: 1160, totalDeals: 5 },
          { creator: 'TravelVlogger', avgValue: 1300, totalDeals: 4 }
        ],
        acceptedVsRejectedDeals: {
          accepted: 30,
          rejected: 8,
          pending: 12
        },
        creatorActivityTimeline: [
          { month: 'Jan', activeCreators: 8, newDeals: 12, completedDeals: 10 },
          { month: 'Feb', activeCreators: 10, newDeals: 15, completedDeals: 12 },
          { month: 'Mar', activeCreators: 12, newDeals: 18, completedDeals: 15 },
          { month: 'Apr', activeCreators: 11, newDeals: 16, completedDeals: 14 },
          { month: 'May', activeCreators: 14, newDeals: 20, completedDeals: 18 },
          { month: 'Jun', activeCreators: 15, newDeals: 22, completedDeals: 20 }
        ],
        revenueBreakdownByBrand: [
          { brand: 'TechCorp Inc.', revenue: 25000, percentage: 20 },
          { brand: 'Fashion Forward', revenue: 22000, percentage: 17.6 },
          { brand: 'HealthPlus', revenue: 18000, percentage: 14.4 },
          { brand: 'Foodie Delights', revenue: 15000, percentage: 12 },
          { brand: 'Travel Dreams', revenue: 12000, percentage: 9.6 },
          { brand: 'Others', revenue: 33000, percentage: 26.4 }
        ]
      }
    };

    const currentData = analyticsData[userRole] || analyticsData.creator;

    // Chart data generator
    const generateChartData = (metric) => {
      const data = currentData.trends[metric];
      return data.map((value, index) => ({
        month: new Date(2024, index, 1).toLocaleDateString('en-US', { month: 'short' }),
        value: value
      }));
    };

    // Enhanced Chart component with different types
    const Chart = ({ title, data, color = '#007bff', type = 'line', analyticsInitialized = false }) => (
      <div className={`chart-container ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
        <h3 className={analyticsInitialized ? 'analytics-initialized' : ''}>{title}</h3>
        <div className={`chart ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
          <svg width="100%" height="200" viewBox="0 0 400 200" className={analyticsInitialized ? 'analytics-initialized' : ''}>
            <defs>
              <linearGradient id={`chartGradient-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {type === 'line' && (
              <>
                <path
                  className={analyticsInitialized ? 'analytics-initialized' : ''}
                  d={data.map((point, index) => {
                    const x = (index / (data.length - 1)) * 360 + 20;
                    const y = 180 - (point.value / Math.max(...data.map(d => d.value))) * 140;
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  stroke={color}
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d={data.map((point, index) => {
                    const x = (index / (data.length - 1)) * 360 + 20;
                    const y = 180 - (point.value / Math.max(...data.map(d => d.value))) * 140;
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ') + ` L ${(data.length - 1) / (data.length - 1) * 360 + 20} 180 L 20 180 Z`}
                  fill={`url(#chartGradient-${title.replace(/\s+/g, '')})`}
                />
          </>
        )}
            {type === 'bar' && data.map((point, index) => {
              const x = (index / (data.length - 1)) * 360 + 20;
              const barWidth = 320 / data.length - 4;
              const barHeight = (point.value / Math.max(...data.map(d => d.value))) * 140;
              const y = 180 - barHeight;
              return (
                <rect
                  key={index}
                  className={analyticsInitialized ? 'analytics-initialized' : ''}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  rx="2"
                />
              );
            })}
            {data.map((point, index) => {
              const x = (index / (data.length - 1)) * 360 + 20;
              const y = type === 'bar' ? 180 - (point.value / Math.max(...data.map(d => d.value))) * 140 - 3 : 180 - (point.value / Math.max(...data.map(d => d.value))) * 140;
              return (
                <circle
                  key={index}
                  className={analyticsInitialized ? 'analytics-initialized' : ''}
                  cx={x}
                  cy={y}
                  r="3"
                  fill={color}
                />
              );
            })}
          </svg>
          <div className={`chart-labels ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
            {data.map((point, index) => (
              <span key={index} className={`chart-label ${analyticsInitialized ? 'analytics-initialized' : ''}`}>{point.month}</span>
            ))}
          </div>
        </div>
      </div>
    );

    // Pie Chart component
    const PieChart = ({ title, data, colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'], analyticsInitialized = false }) => (
      <div className={`chart-container ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
        <h3 className={analyticsInitialized ? 'analytics-initialized' : ''}>{title}</h3>
        <div className={`pie-chart ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
          <svg width="200" height="200" viewBox="0 0 200 200" className={analyticsInitialized ? 'analytics-initialized' : ''}>
            {data.map((item, index) => {
              const total = data.reduce((sum, d) => sum + d.value, 0);
              const percentage = item.value / total;
              const angle = percentage * 360;
              const startAngle = data.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 360, 0);
              const endAngle = startAngle + angle;
              
              const x1 = 100 + 60 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 100 + 60 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 100 + 60 * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = 100 + 60 * Math.sin((endAngle - 90) * Math.PI / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              return (
                <path
                  key={index}
                  className={analyticsInitialized ? 'analytics-initialized' : ''}
                  d={`M 100 100 L ${x1} ${y1} A 60 60 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={colors[index % colors.length]}
                />
              );
            })}
          </svg>
          <div className={`pie-legend ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
            {data.map((item, index) => (
              <div key={index} className={`legend-item ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
                <span className={`legend-color ${analyticsInitialized ? 'analytics-initialized' : ''}`} style={{ backgroundColor: colors[index % colors.length] }}></span>
                <span className="legend-label">{item.label}</span>
                <span className="legend-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    // Metric card component
    const MetricCard = ({ title, value, change, icon, color = 'blue' }) => (
      <div className={`metric-card ${color}`}>
        <div className="metric-header">
          <span className="metric-icon">{icon}</span>
          <span className="metric-title">{title}</span>
        </div>
        <div className="metric-value">{value}</div>
        <div className={`metric-change ${change >= 0 ? 'positive' : 'negative'}`}>
          {change >= 0 ? '↗' : '↘'} {Math.abs(change)}%
        </div>
      </div>
    );

    // Render different content based on role
    const renderCreatorAnalytics = () => (
      <>
        {/* Overview Metrics */}
        <div className="metrics-grid">
          <MetricCard
            title="Total Earnings"
            value={`$${currentData.overview.totalEarnings.toLocaleString()}`}
            change={currentData.overview.growthRate}
            icon="💰"
            color="green"
          />
          <MetricCard
            title="Pending Earnings"
            value={`$${currentData.dealStats.pendingEarnings.toLocaleString()}`}
            change={5.2}
            icon="⏳"
            color="orange"
          />
          <MetricCard
            title="Deal Approval Rate"
            value={`${currentData.dealStats.approvalRate}%`}
            change={2.1}
            icon="✅"
            color="blue"
          />
          <MetricCard
            title="Application Success"
            value={`${(currentData.dealStats.applicationToAcceptance * 100).toFixed(1)}%`}
            change={-1.5}
            icon="📈"
            color="purple"
          />
        </div>

        {/* Charts Row 1 */}
        <div className={`charts-row ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
          <Chart 
            title="Earnings Over Time" 
            data={generateChartData('earnings')} 
            color="#28a745"
            analyticsInitialized={analyticsInitialized}
          />
          <Chart 
            title="Deal Completion Timeline" 
            data={currentData.dealTimeline.map(item => ({
              month: item.month,
              value: item.completed
            }))}
            color="#007bff"
            type="bar"
            analyticsInitialized={analyticsInitialized}
          />
        </div>

        {/* Charts Row 2 */}
        <div className={`charts-row ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
          <Chart 
            title="Clicks/Views Generated per Deal" 
            data={currentData.clicksViewsPerDeal.map(item => ({
              month: item.deal,
              value: item.clicks
            }))}
            color="#f59e0b"
            type="bar"
            analyticsInitialized={analyticsInitialized}
          />
          <PieChart
            title="Pending vs Paid Earnings"
            data={[
              { label: 'Paid', value: currentData.dealStats.paidEarnings },
              { label: 'Pending', value: currentData.dealStats.pendingEarnings }
            ]}
            colors={['#10b981', '#f59e0b']}
            analyticsInitialized={analyticsInitialized}
          />
        </div>

        {/* Top Paying Brands and Platform Performance */}
        <div className="analytics-bottom">
          <div className="analytics-left">
            <div className="table-container">
              <h3>Top Paying Brands</h3>
              <div className="table">
                <div className="table-header">
                  <div className="table-cell">Brand</div>
                  <div className="table-cell">Total Paid</div>
                  <div className="table-cell">Deals</div>
                  <div className="table-cell">Avg/Deal</div>
                </div>
                {currentData.topPayingBrands.map((brand, index) => (
                  <div key={index} className="table-row">
                    <div className="table-cell content-title">{brand.brand}</div>
                    <div className="table-cell platform">${brand.totalPaid}</div>
                    <div className="table-cell engagement">{brand.deals}</div>
                    <div className="table-cell reach">${brand.avgPerDeal}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="analytics-right">
            <div className="platform-performance">
              <h3>Platform Performance</h3>
              <div className="platform-grid">
                {currentData.platformPerformance.map(platform => (
                  <div key={platform.platform} className="platform-card">
                    <div className="platform-header">
                      <span className="platform-name">{platform.platform}</span>
                      <span className="platform-followers">{platform.followers.toLocaleString()}</span>
                    </div>
                    <div className="platform-metrics">
                      <div className="platform-metric">
                        <span className="metric-label">Engagement</span>
                        <span className="metric-value">{platform.engagement}%</span>
                      </div>
                      <div className="platform-metric">
                        <span className="metric-label">Reach</span>
                        <span className="metric-value">{platform.reach.toLocaleString()}</span>
                      </div>
                      <div className="platform-metric">
                        <span className="metric-label">Earnings</span>
                        <span className="metric-value">${platform.earnings}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );

    const renderBrandAnalytics = () => (
      <>
        {/* Overview Metrics */}
        <div className="metrics-grid">
          <MetricCard
            title="Total Spent"
            value={`$${currentData.overview.totalSpent.toLocaleString()}`}
            change={12.5}
            icon="💸"
            color="red"
          />
          <MetricCard
            title="Creator Response Rate"
            value={`${currentData.creatorResponseRate}%`}
            change={3.2}
            icon="📱"
            color="green"
          />
          <MetricCard
            title="Avg Cost per Conversion"
            value={`$${currentData.costPerConversion.cpa}`}
            change={-8.7}
            icon="🎯"
            color="blue"
          />
          <MetricCard
            title="Total Campaigns"
            value={currentData.overview.totalCampaigns}
            change={8.7}
            icon="📊"
            color="purple"
          />
        </div>

        {/* Charts Row 1 */}
        <div className={`charts-row ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
          <Chart 
            title="Campaign Spend Over Time" 
            data={generateChartData('spend')} 
            color="#ef4444"
            analyticsInitialized={analyticsInitialized}
          />
          <Chart 
            title="Impressions vs Clicks vs Conversions" 
            data={currentData.impressionsVsClicks.map(item => ({
              month: item.month,
              value: item.impressions
            }))}
            color="#007bff"
            analyticsInitialized={analyticsInitialized}
          />
        </div>

        {/* Charts Row 2 */}
        <div className={`charts-row ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
          <PieChart
            title="Deal Status Breakdown"
            data={[
              { label: 'Pending', value: currentData.dealStatus.pending },
              { label: 'Active', value: currentData.dealStatus.active },
              { label: 'Completed', value: currentData.dealStatus.completed },
              { label: 'Rejected', value: currentData.dealStatus.rejected }
            ]}
            colors={['#f59e0b', '#3b82f6', '#10b981', '#ef4444']}
            analyticsInitialized={analyticsInitialized}
          />
          <Chart 
            title="Revenue Attribution per Deal" 
            data={currentData.revenueAttribution.map(item => ({
              month: item.deal,
              value: item.attributed
            }))}
            color="#8b5cf6"
            type="bar"
            analyticsInitialized={analyticsInitialized}
          />
        </div>

        {/* Creator Performance and Top Campaigns */}
        <div className="analytics-bottom">
          <div className="analytics-left">
            <div className="table-container">
              <h3>Top Performing Creators (ROI)</h3>
              <div className="table">
                <div className="table-header">
                  <div className="table-cell">Creator</div>
                  <div className="table-cell">Followers</div>
                  <div className="table-cell">Engagement</div>
                  <div className="table-cell">ROI</div>
                </div>
                {currentData.creatorPerformance.map(creator => (
                  <div key={creator.creator} className="table-row">
                    <div className="table-cell content-title">{creator.creator}</div>
                    <div className="table-cell platform">{creator.followers.toLocaleString()}</div>
                    <div className="table-cell engagement">{creator.engagement}%</div>
                    <div className="table-cell reach">{creator.roi}x</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="analytics-right">
            <div className="table-container">
              <h3>Top Campaigns</h3>
              <div className="table">
                <div className="table-header">
                  <div className="table-cell">Campaign</div>
                  <div className="table-cell">Creator</div>
                  <div className="table-cell">Reach</div>
                  <div className="table-cell">ROI</div>
                </div>
                {currentData.topCampaigns.map(item => (
                  <div key={item.id} className="table-row">
                    <div className="table-cell content-title">{item.title}</div>
                    <div className="table-cell platform">{item.creator}</div>
                    <div className="table-cell engagement">{item.reach.toLocaleString()}</div>
                    <div className="table-cell earnings">{item.roi}x</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );

    const renderAgencyAnalytics = () => (
      <>
        {/* Overview Metrics */}
        <div className="metrics-grid">
          <MetricCard
            title="Total Revenue"
            value={`$${currentData.overview.totalRevenue.toLocaleString()}`}
            change={currentData.overview.growthRate}
            icon="💰"
            color="green"
          />
          <MetricCard
            title="Total Clients"
            value={currentData.overview.totalClients}
            change={5.9}
            icon="👥"
            color="blue"
          />
          <MetricCard
            title="Campaign Success Rate"
            value={`${currentData.overview.avgCampaignSuccess}%`}
            change={2.1}
            icon="✅"
            color="purple"
          />
          <MetricCard
            title="Avg Client Value"
            value={`$${currentData.overview.avgClientValue.toLocaleString()}`}
            change={8.3}
            icon="📈"
            color="orange"
          />
        </div>

        {/* Charts Row 1 */}
        <div className={`charts-row ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
          <Chart 
            title="Total Earnings Over Time" 
            data={generateChartData('revenue')} 
            color="#28a745"
            analyticsInitialized={analyticsInitialized}
          />
          <Chart 
            title="Creator Activity Timeline" 
            data={currentData.creatorActivityTimeline.map(item => ({
              month: item.month,
              value: item.activeCreators
            }))}
            color="#007bff"
            analyticsInitialized={analyticsInitialized}
          />
        </div>

        {/* Charts Row 2 */}
        <div className={`charts-row ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
          <Chart 
            title="Top Performing Creators" 
            data={currentData.topPerformingCreators.map(creator => ({
              month: creator.creator,
              value: creator.totalEarnings
            }))}
            color="#f59e0b"
            type="bar"
            analyticsInitialized={analyticsInitialized}
          />
          <PieChart
            title="Accepted vs Rejected Deals"
            data={[
              { label: 'Accepted', value: currentData.acceptedVsRejectedDeals.accepted },
              { label: 'Rejected', value: currentData.acceptedVsRejectedDeals.rejected },
              { label: 'Pending', value: currentData.acceptedVsRejectedDeals.pending }
            ]}
            colors={['#10b981', '#ef4444', '#f59e0b']}
            analyticsInitialized={analyticsInitialized}
          />
        </div>

        {/* Charts Row 3 */}
        <div className={`charts-row ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
          <Chart 
            title="Deal Conversion Rates" 
            data={currentData.dealConversionRates.map(item => ({
              month: item.creator,
              value: item.conversion
            }))}
            color="#8b5cf6"
            type="bar"
            analyticsInitialized={analyticsInitialized}
          />
          <Chart 
            title="Average Deal Value per Creator" 
            data={currentData.avgDealValuePerCreator.map(item => ({
              month: item.creator,
              value: item.avgValue
            }))}
            color="#06b6d4"
            type="bar"
            analyticsInitialized={analyticsInitialized}
          />
        </div>

        {/* Revenue Breakdown and Top Clients */}
        <div className="analytics-bottom">
          <div className="analytics-left">
            <PieChart
              title="Revenue Breakdown by Brand"
              data={currentData.revenueBreakdownByBrand.map(brand => ({
                label: brand.brand,
                value: brand.revenue
              }))}
              colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']}
              analyticsInitialized={analyticsInitialized}
            />
          </div>
          <div className="analytics-right">
            <div className="table-container">
              <h3>Top Clients</h3>
              <div className="table">
                <div className="table-header">
                  <div className="table-cell">Client</div>
                  <div className="table-cell">Industry</div>
                  <div className="table-cell">Revenue</div>
                  <div className="table-cell">Avg ROI</div>
                </div>
                {currentData.topClients.map(item => (
                  <div key={item.id} className="table-row">
                    <div className="table-cell content-title">{item.name}</div>
                    <div className="table-cell platform">{item.industry}</div>
                    <div className="table-cell engagement">${item.revenue.toLocaleString()}</div>
                    <div className="table-cell earnings">{item.avgROI}x</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );

    return (
      <div className={`analytics-section ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
        <div className={`analytics-header ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
          <div className="analytics-title">
            <h2 className={analyticsInitialized ? 'analytics-initialized' : ''}>{userRole === 'creator' ? 'Creator Analytics' : userRole === 'brand' ? 'Brand Analytics' : 'Agency Analytics'}</h2>
            <p className={analyticsInitialized ? 'analytics-initialized' : ''}>
              {userRole === 'creator' && 'Track your content performance and earnings'}
              {userRole === 'brand' && 'Monitor your campaign performance and ROI'}
              {userRole === 'agency' && 'Manage your client campaigns and revenue'}
            </p>
          </div>
          <div className={`analytics-controls ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className={`time-filter ${analyticsInitialized ? 'analytics-initialized' : ''}`}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        <div className={`analytics-content ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
          {userRole === 'creator' && renderCreatorAnalytics()}
          {userRole === 'brand' && renderBrandAnalytics()}
          {userRole === 'agency' && renderAgencyAnalytics()}
      </div>
      </div>
    );
  };

  const renderMessages = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <div className="section-title">
          <h2>Messages</h2>
          <p>Communicate with your network</p>
        </div>
      </div>
      <div className="section-content">
        <p>Messages section coming soon...</p>
      </div>
    </div>
  );

  const renderPayouts = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <div className="section-title">
          <h2>Payouts</h2>
          <p>Manage your earnings and payments</p>
        </div>
      </div>
      <div className="section-content">
        <p>Payouts section coming soon...</p>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <div className="section-title">
          <h2>Billing</h2>
          <p>Manage your subscription and billing</p>
        </div>
      </div>
      <div className="section-content">
        <p>Billing section coming soon...</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Notification System */}
      <div className="notification-container">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            <span className="notification-message">{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <aside className={`dashboard-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="logo">🚀</span>
          <h1>Engage</h1>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleNavigation(item.id)}
              title={item.description}
            >
              <span className="nav-icon">{item.icon}</span>
              <div className="nav-content">
                <span className="nav-label">{item.label}</span>
                <span className="nav-description">{item.description}</span>
              </div>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="main-header">
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
          <div className="user-welcome">
            <h1>Welcome back, {user.name}!</h1>
            <p>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          <div className="user-profile">
            <span className="profile-avatar">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        </header>

        {renderMainContent()}
      </main>
    </div>
  );
};

export default Dashboard; 