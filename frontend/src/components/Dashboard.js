import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';

// Import individual dashboard components
import Overview from './dashboard/overview/overview';
import Marketplace from './dashboard/marketplace/marketplace';
import Creators from './dashboard/creators/creators';
import Analytics from './dashboard/analytics/analytics';
import Messages from './dashboard/messages/messages';
import Settings from './dashboard/settings/settings';
import Profile from './dashboard/profile/profile';
import Payouts from './dashboard/payout/payout';
import Billing from './dashboard/billing/billing';

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
      role: userRole,
      stats: {
        totalEarnings: 15750,
        followers: 85000,
        engagementRate: 4.8,
        activeDeals: 3
      }
    };
  }, [userRole]);

  // Memoized marketplace data
  const marketplaceData = useMemo(() => {
    return {
      availableDeals: [
        {
          id: 1,
          brand: 'TechCorp',
          brandLogo: '💻',
          category: 'Technology',
          title: 'Product Launch Campaign',
          description: 'Help us launch our new AI-powered productivity tool',
          budget: '$2,000 - $5,000',
          engagement: '4.2%',
          reach: '50K - 100K',
          requirements: ['Tech content creator', '10K+ followers', 'Engagement rate >3%'],
          tags: ['Technology', 'AI', 'Productivity'],
          deadline: '2024-02-15',
          applications: 12,
          status: 'active'
        },
        {
          id: 2,
          brand: 'FashionForward',
          brandLogo: '👗',
          category: 'Fashion',
          title: 'Spring Collection Showcase',
          description: 'Showcase our latest spring fashion collection',
          budget: '$1,500 - $3,000',
          engagement: '5.1%',
          reach: '25K - 75K',
          requirements: ['Fashion influencer', '5K+ followers', 'Style-focused content'],
          tags: ['Fashion', 'Spring', 'Lifestyle'],
          deadline: '2024-02-20',
          applications: 8,
          status: 'active'
        }
      ],
      availableCreators: [
        {
          id: 1,
          name: 'Sarah Tech',
          avatar: '👩‍💻',
          category: 'Technology',
          followers: '45K',
          engagement: '4.8',
          rating: '4.9',
          reach: '35K - 60K',
          avgDealValue: '$2,500',
          responseRate: '95',
          tags: ['Tech Reviews', 'AI', 'Gadgets'],
          availability: 'Available',
          priceRange: '$1,500 - $4,000'
        },
        {
          id: 2,
          name: 'Mike Fitness',
          avatar: '💪',
          category: 'Fitness',
          followers: '32K',
          engagement: '6.2',
          rating: '4.7',
          reach: '25K - 45K',
          avgDealValue: '$1,800',
          responseRate: '88',
          tags: ['Workouts', 'Nutrition', 'Motivation'],
          availability: 'Available',
          priceRange: '$1,000 - $3,000'
        }
      ],
      appliedDeals: [
        {
          id: 1,
          title: 'Summer Campaign',
          brand: 'BeachWear',
          status: 'pending',
          appliedDate: '2024-01-15',
          expectedResponse: '2024-01-25'
        }
      ],
      recommendedDeals: [
        {
          id: 1,
          title: 'Gaming Accessories Review',
          matchScore: 92,
          reason: 'Based on your gaming content and audience'
        }
      ],
      activeCampaigns: [
        {
          id: 1,
          title: 'Winter Collection',
          creator: 'Fashion Influencer',
          status: 'active',
          progress: 65,
          budget: '$3,500',
          startDate: '2024-01-01',
          endDate: '2024-02-15'
        }
      ],
      topCategories: [
        {
          category: 'Technology',
          creators: 45,
          avgEngagement: '4.2'
        },
        {
          category: 'Fashion',
          creators: 38,
          avgEngagement: '5.1'
        }
      ],
      creatorNetwork: [
        {
          id: 1,
          name: 'Alex Creator',
          category: 'Lifestyle',
          followers: '28K',
          engagement: '5.5',
          successRate: '92'
        }
      ]
    };
  }, []);

  // Memoized menu items
  const menuItems = useMemo(() => {
    if (user.role === 'creator') {
      return [
      { id: 'overview', label: 'Overview', icon: '📊', description: 'Snapshot: earnings, top creators, recent activity' },
      { id: 'marketplace', label: 'Marketplace', icon: '🏪', description: 'Browse offers, assign to creators, manage deals' },
        { id: 'profile', label: 'Profile', icon: '👤', description: 'Update niche, audience stats, linked accounts' },
      { id: 'analytics', label: 'Analytics', icon: '📈', description: 'Deep metrics: top creators, campaign ROI, revenue trends' },
        { id: 'payouts', label: 'Payouts', icon: '💰', description: 'Pending + completed payments' },
      { id: 'messages', label: 'Messages', icon: '💬', description: 'DM with creators & brands' },
      { id: 'settings', label: 'Settings', icon: '⚙️', description: 'Account info, billing, permissions' }
    ];
    } else if (user.role === 'brand') {
      return [
        { id: 'overview', label: 'Overview', icon: '📊', description: 'Snapshot: earnings, top creators, recent activity' },
        { id: 'marketplace', label: 'Marketplace', icon: '🏪', description: 'Browse offers, assign to creators, manage deals' },
        { id: 'creators', label: 'Creators', icon: '👥', description: 'Manage and monitor linked creators' },
        { id: 'analytics', label: 'Analytics', icon: '📈', description: 'Deep metrics: top creators, campaign ROI, revenue trends' },
        { id: 'billing', label: 'Billing', icon: '💳', description: 'Add funds, invoices, transaction history' },
        { id: 'messages', label: 'Messages', icon: '💬', description: 'DM with creators & brands' },
        { id: 'settings', label: 'Settings', icon: '⚙️', description: 'Account info, billing, permissions' }
      ];
    } else {
      // Agency
      return [
        { id: 'overview', label: 'Overview', icon: '📊', description: 'Snapshot: earnings, top creators, recent activity' },
        { id: 'marketplace', label: 'Marketplace', icon: '🏪', description: 'Browse offers, assign to creators, manage deals' },
        { id: 'creators', label: 'Creators', icon: '👥', description: 'Manage and monitor linked creators' },
        { id: 'analytics', label: 'Analytics', icon: '📈', description: 'Deep metrics: top creators, campaign ROI, revenue trends' },
        { id: 'messages', label: 'Messages', icon: '💬', description: 'DM with creators & brands' },
        { id: 'settings', label: 'Settings', icon: '⚙️', description: 'Account info, billing, permissions' }
      ];
    }
  }, [user.role]);

  // Navigation handler
  const handleNavigation = useCallback((section) => {
    setActiveSection(section);
    navigate(`/${section}`);
  }, [navigate]);

  // Logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('userRole');
    navigate('/');
  }, [navigate]);

  // Main content renderer
  const renderMainContent = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview user={user} userRole={userRole} />;
      case 'marketplace':
        return <Marketplace user={user} userRole={userRole} marketplaceData={marketplaceData} createNotification={createNotification} />;
      case 'creators':
        return <Creators user={user} userRole={userRole} />;
      case 'analytics':
        return <Analytics user={user} userRole={userRole} analyticsInitialized={analyticsInitialized} />;
      case 'messages':
        return <Messages user={user} userRole={userRole} />;
      case 'settings':
        return <Settings 
          user={user} 
          userRole={userRole} 
          settingsData={settingsData}
          setSettingsData={setSettingsData}
          toggleStates={toggleStates}
          handleToggle={handleToggle}
          createNotification={createNotification}
          activeSettingsTab={activeSettingsTab}
          setActiveSettingsTab={setActiveSettingsTab}
          sectionOpened={sectionOpened}
          setSectionOpened={setSectionOpened}
        />;
      case 'profile':
        return <Profile user={user} userRole={userRole} />;
      case 'payouts':
        return <Payouts user={user} userRole={userRole} />;
      case 'billing':
        return <Billing user={user} userRole={userRole} />;
      default:
        return <Overview user={user} userRole={userRole} />;
    }
  };

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