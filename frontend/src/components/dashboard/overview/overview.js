import React from 'react';
import { useNavigate } from 'react-router-dom';
import './overview.css';

const Overview = ({ user, userRole, handleActionButton, handleViewAll, handleTimeFilterChange, handleApplicationAction, handleOfferAction }) => {
  const navigate = useNavigate();

  // Default handlers to navigate to proper destinations
  const defaultHandleActionButton = (action, role) => {
    console.log(`Action button clicked: ${action} for role: ${role}`);
    
    // Navigate based on action and role
    switch (action) {
      case 'browse-deals':
        navigate('/marketplace');
        break;
      case 'update-profile':
        navigate('/profile');
        break;
      case 'create-deal':
        navigate('/marketplace');
        break;
      case 'view-analytics':
        navigate('/analytics');
        break;
      case 'add-creator':
        navigate('/creators');
        break;
      default:
        navigate('/marketplace');
    }
  };

  const defaultHandleViewAll = (section) => {
    console.log(`View all clicked for section: ${section}`);
    
    // Navigate based on section
    switch (section) {
      case 'activity':
        navigate('/analytics');
        break;
      case 'creators':
        navigate('/creators');
        break;
      case 'deals':
        navigate('/marketplace');
        break;
      default:
        navigate('/analytics');
    }
  };

  const defaultHandleTimeFilterChange = (value) => {
    console.log(`Time filter changed to: ${value}`);
    // This could trigger analytics refresh or state update
    // For now, just log the change
  };

  const defaultHandleApplicationAction = (action, applicationId) => {
    console.log(`Application action: ${action} for ID: ${applicationId}`);
    // Navigate to relevant section based on action
    switch (action) {
      case 'view':
        navigate('/marketplace');
        break;
      case 'manage':
        navigate('/marketplace');
        break;
      default:
        navigate('/marketplace');
    }
  };

  const defaultHandleOfferAction = (action, offerId) => {
    console.log(`Offer action: ${action} for ID: ${offerId}`);
    // Navigate to marketplace for offer-related actions
    navigate('/marketplace');
  };

  // Use provided handlers or defaults
  const safeHandleActionButton = handleActionButton || defaultHandleActionButton;
  const safeHandleViewAll = handleViewAll || defaultHandleViewAll;
  const safeHandleTimeFilterChange = handleTimeFilterChange || defaultHandleTimeFilterChange;
  const safeHandleApplicationAction = handleApplicationAction || defaultHandleApplicationAction;
  const safeHandleOfferAction = handleOfferAction || defaultHandleOfferAction;

  // Helper components
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
              onChange={(e) => safeHandleTimeFilterChange(e.target.value)}
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
          onPrimary={() => safeHandleActionButton('browse-deals', 'creator')}
          onSecondary={() => safeHandleActionButton('update-profile', 'creator')}
        />
      </div>

      <div className="overview-stats">
        <StatCard icon="💰" value={`$${user.stats.totalEarnings.toLocaleString()}`} label="Total Earnings" trend="+12.5%" isPrimary />
        <StatCard icon="👥" value={user.stats.followers.toLocaleString()} label="Followers" trend="+8.2%" />
        <StatCard icon="📈" value={`${user.stats.engagementRate}%`} label="Engagement Rate" trend="+0.3%" />
        <StatCard icon="🤝" value={user.stats.activeDeals} label="Active Deals" trend="0" />
        <StatCard icon="🎯" value="94%" label="Completion Rate" trend="+2.1%" />
        <StatCard icon="⭐" value="4.8" label="Average Rating" trend="+0.1" />
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
              { name: 'Summer Collection Campaign', brand: 'Fashion Brand Co.', amount: '$2,500', progress: 75, status: 'active', deadline: '2 days', platform: 'Instagram' },
              { name: 'Tech Review Series', brand: 'Gadget World', amount: '$1,800', progress: 45, status: 'pending', deadline: '5 days', platform: 'YouTube' },
              { name: 'Fitness Challenge', brand: 'HealthPlus', amount: '$3,200', progress: 90, status: 'active', deadline: '1 day', platform: 'TikTok' }
            ].map((deal, index) => (
              <div key={index} className="deal-item">
                <div className="deal-info">
                  <h4>{deal.name}</h4>
                  <p>{deal.brand} • {deal.amount} • {deal.platform}</p>
                  <div className="deal-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${deal.progress}%` }}></div>
                    </div>
                    <span>{deal.progress}% complete</span>
                  </div>
                  <span className="deal-deadline">Due: {deal.deadline}</span>
                </div>
                <span className={`deal-status ${deal.status}`}>{deal.status === 'active' ? 'Active' : 'In Progress'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-card recent-activity">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="view-all-btn" onClick={() => safeHandleViewAll('activity')}>
              View All
            </button>
          </div>
          <div className="activity-list">
            {[
              { icon: '💰', title: 'Payment Received', desc: 'Summer Collection Campaign completed', time: '2 hours ago', amount: '+$2,500', type: 'payment' },
              { icon: '🤝', title: 'Deal Taken', desc: 'Tech Review Series from Gadget World', time: '1 day ago', amount: '$1,800', type: 'deal' },
              { icon: '📈', title: 'Follower Growth', desc: 'Gained 250 new followers', time: '2 days ago', amount: '+250', type: 'growth' },
              { icon: '⭐', title: 'New Rating', desc: 'Received 5-star rating from Fashion Brand', time: '3 days ago', amount: '5.0', type: 'rating' }
            ].map((activity, index) => (
              <div key={index} className={`activity-item ${activity.type}`}>
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
              { name: 'Summer Collection Content', brand: 'Fashion Brand Co.', time: 'Due in 2 days', urgent: true, platform: 'Instagram' },
              { name: 'Tech Review Video', brand: 'Gadget World', time: 'Due in 5 days', urgent: false, platform: 'YouTube' },
              { name: 'Fitness Challenge Post', brand: 'HealthPlus', time: 'Due in 1 day', urgent: true, platform: 'TikTok' }
            ].map((deadline, index) => (
              <div key={index} className={`deadline-item ${deadline.urgent ? 'urgent' : ''}`}>
                <div className="deadline-info">
                  <h4>{deadline.name}</h4>
                  <p>{deadline.brand} • {deadline.platform}</p>
                  <span className="deadline-time">{deadline.time}</span>
                </div>
                <span className={`deadline-status ${deadline.urgent ? 'urgent' : ''}`}>
                  {deadline.urgent ? 'Urgent' : 'On Track'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-card performance-insights">
          <div className="card-header">
            <h3>Performance Insights</h3>
            <span className="insights-period">This month</span>
          </div>
          <div className="insights-grid">
            {[
              { label: 'Best Performing Platform', value: 'Instagram', trend: '+15%' },
              { label: 'Highest Earning Deal', value: '$3,200', trend: 'Fitness Challenge' },
              { label: 'Avg. Response Time', value: '2.3 hours', trend: '-0.5h' },
              { label: 'Brand Satisfaction', value: '4.9/5', trend: '+0.2' }
            ].map((insight, index) => (
              <div key={index} className="insight-item">
                <span className="insight-label">{insight.label}</span>
                <span className="insight-value">{insight.value}</span>
                <span className="insight-trend">{insight.trend}</span>
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
          onPrimary={() => safeHandleActionButton('create-deal', 'brand')}
          onSecondary={() => safeHandleActionButton('view-analytics', 'brand')}
        />
      </div>

      <div className="overview-stats">
        <StatCard icon="💰" value="$45,250" label="Total Spend" trend="+15.3%" isPrimary />
        <StatCard icon="📊" value="2.4%" label="Conversion Rate" trend="+0.8%" />
        <StatCard icon="🤝" value="12" label="Active Deals" trend="+2" />
        <StatCard icon="👥" value="8" label="Selected Creators" trend="+1" />
        <StatCard icon="⚡" value="3.2x" label="Avg. ROI" trend="+0.4x" />
        <StatCard icon="🎯" value="85%" label="Deal Success Rate" trend="+5%" />
      </div>

      <div className="overview-grid">
        <ChartComponent title="Campaign Performance" />
        
        <div className="overview-card top-creators">
          <div className="card-header">
            <h3>Top Performing Creators</h3>
            <button className="view-all-btn" onClick={() => safeHandleViewAll('creators')}>
              View All
            </button>
          </div>
          <div className="creator-list">
            {[
              { avatar: 'TC', name: 'Tech Creator Pro', followers: '3.2M', engagement: '4.8%', roi: '3.5x', reach: '2.1M', earnings: '$8,500', deals: 3, status: 'active' },
              { avatar: 'LC', name: 'Lifestyle Creator', followers: '1.8M', engagement: '5.2%', roi: '4.1x', reach: '1.5M', earnings: '$6,200', deals: 2, status: 'active' },
              { avatar: 'FC', name: 'Fashion Creator', followers: '2.5M', engagement: '6.1%', roi: '3.8x', reach: '1.8M', earnings: '$7,800', deals: 1, status: 'pending' }
            ].map((creator, index) => (
              <div key={index} className="creator-item">
                <div className="creator-avatar">{creator.avatar}</div>
                <div className="creator-info">
                  <h4>{creator.name}</h4>
                  <p>{creator.followers} followers • {creator.engagement} engagement</p>
                  <div className="creator-stats">
                    <span>ROI: {creator.roi}</span>
                    <span>Reach: {creator.reach}</span>
                    <span>Deals: {creator.deals}</span>
                  </div>
                </div>
                <div className="creator-status">
                  <span className="creator-earnings">{creator.earnings}</span>
                  <span className={`status-badge ${creator.status}`}>{creator.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-card recent-deals">
          <div className="card-header">
            <h3>Recent Deal Activity</h3>
            <span className="deal-count">5 deals this week</span>
          </div>
          <div className="deal-list">
            {[
              { name: 'Summer Collection Campaign', creator: 'Fashion Creator', amount: '$2,500', time: 'Taken 2 hours ago', status: 'active', platform: 'Instagram' },
              { name: 'Product Launch Campaign', creator: 'Tech Creator Pro', amount: '$3,200', time: 'Taken 1 day ago', status: 'active', platform: 'YouTube' },
              { name: 'Lifestyle Series', creator: 'Lifestyle Creator', amount: '$1,800', time: 'Taken 3 days ago', status: 'completed', platform: 'TikTok' }
            ].map((deal, index) => (
              <div key={index} className="deal-item">
                <div className="deal-info">
                  <h4>{deal.name}</h4>
                  <p>Taken by {deal.creator} • {deal.amount} • {deal.platform}</p>
                  <span className="deal-time">{deal.time}</span>
                </div>
                <span className={`deal-status ${deal.status}`}>{deal.status}</span>
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
              { label: 'Cost per Result', value: '$2.45', trend: '-12%' },
              { label: 'Total Reach', value: '15.2M', trend: '+8%' },
              { label: 'Engagement Rate', value: '4.8%', trend: '+0.3%' },
              { label: 'Click-through Rate', value: '2.1%', trend: '+0.2%' },
              { label: 'Deal Completion Rate', value: '94%', trend: '+3%' },
              { label: 'Creator Satisfaction', value: '4.7/5', trend: '+0.1' }
            ].map((metric, index) => (
              <div key={index} className="roi-item">
                <span className="roi-label">{metric.label}</span>
                <span className="roi-value">{metric.value}</span>
                <span className={`roi-trend ${metric.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                  {metric.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-card campaign-insights">
          <div className="card-header">
            <h3>Campaign Insights</h3>
            <span className="insights-period">This month</span>
          </div>
          <div className="insights-grid">
            {[
              { label: 'Best Performing Platform', value: 'Instagram', metric: '4.2x ROI' },
              { label: 'Fastest Deal Taken', value: '2.3 hours', metric: 'Tech Review' },
              { label: 'Highest Engagement', value: '6.1%', metric: 'Fashion Creator' },
              { label: 'Most Cost Effective', value: '$1.8k', metric: 'Lifestyle Series' }
            ].map((insight, index) => (
              <div key={index} className="insight-item">
                <span className="insight-label">{insight.label}</span>
                <span className="insight-value">{insight.value}</span>
                <span className="insight-metric">{insight.metric}</span>
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
          primary="Browse Deals"
          secondary="Add Creator"
          onPrimary={() => safeHandleActionButton('browse-deals', 'agency')}
          onSecondary={() => safeHandleActionButton('add-creator', 'agency')}
        />
      </div>

      <div className="overview-stats">
        <StatCard icon="💰" value="$125,750" label="Total Revenue" trend="+18.7%" isPrimary />
        <StatCard icon="👥" value="45" label="Managed Creators" trend="+3" />
        <StatCard icon="🤝" value="28" label="Active Deals" trend="+5" />
        <StatCard icon="📈" value="4.8" label="Avg. Rating" trend="+0.2" />
        <StatCard icon="⚡" value="92%" label="Deal Success Rate" trend="+4%" />
        <StatCard icon="🎯" value="2.8x" label="Avg. Commission" trend="+0.3x" />
      </div>

      <div className="overview-grid">
        <ChartComponent title="Revenue Trend" />
        
        <div className="overview-card top-earners">
          <div className="card-header">
            <h3>Top Earning Creators</h3>
            <button className="view-all-btn" onClick={() => safeHandleViewAll('creators')}>
              View All
            </button>
          </div>
          <div className="creator-list">
            {[
              { avatar: 'SJ', name: 'Sarah Johnson', niche: 'Fashion & Lifestyle', followers: '2.1M', deals: 8, success: '95%', earnings: '$12,500', status: 'active', platform: 'Instagram' },
              { avatar: 'MC', name: 'Mike Chen', niche: 'Tech Reviews', followers: '1.8M', deals: 6, success: '92%', earnings: '$8,900', status: 'active', platform: 'YouTube' },
              { avatar: 'AL', name: 'Alex Lee', niche: 'Fitness & Health', followers: '1.5M', deals: 5, success: '88%', earnings: '$7,200', status: 'pending', platform: 'TikTok' }
            ].map((creator, index) => (
              <div key={index} className="creator-item">
                <div className="creator-avatar">{creator.avatar}</div>
                <div className="creator-info">
                  <h4>{creator.name}</h4>
                  <p>{creator.niche} • {creator.followers} followers • {creator.platform}</p>
                  <div className="creator-stats">
                    <span>Deals: {creator.deals}</span>
                    <span>Success: {creator.success}</span>
                    <span>Status: {creator.status}</span>
                  </div>
                </div>
                <div className="creator-status">
                  <span className="creator-earnings">{creator.earnings}</span>
                  <span className={`status-badge ${creator.status}`}>{creator.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-card active-deals">
          <div className="card-header">
            <h3>Active Deals</h3>
            <span className="deal-count">28 deals in progress</span>
          </div>
          <div className="deal-list">
            {[
              { name: 'Summer Fashion Campaign', creator: 'Sarah Johnson', brand: 'Fashion Brand Co.', amount: '$15,000', progress: 75, status: 'active', platform: 'Instagram' },
              { name: 'Tech Product Launch', creator: 'Mike Chen', brand: 'Gadget World', amount: '$22,000', progress: 45, status: 'active', platform: 'YouTube' },
              { name: 'Fitness Challenge', creator: 'Alex Lee', brand: 'HealthPlus', amount: '$18,500', progress: 90, status: 'near-completion', platform: 'TikTok' }
            ].map((deal, index) => (
              <div key={index} className="deal-item">
                <div className="deal-info">
                  <h4>{deal.name}</h4>
                  <p>{deal.creator} • {deal.brand} • {deal.amount} • {deal.platform}</p>
                  <div className="deal-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${deal.progress}%` }}></div>
                    </div>
                    <span>{deal.progress}% complete</span>
                  </div>
                </div>
                <span className={`deal-status ${deal.status}`}>{deal.status}</span>
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
              { value: '85%', label: 'Success Rate', trend: '+3%' },
              { value: '2.1x', label: 'Avg. Commission', trend: '+0.2x' },
              { value: '4.2', label: 'Avg. Rating', trend: '+0.1' },
              { value: '12', label: 'New Deals', trend: '+2' },
              { value: '3.2', label: 'Avg. Response Time (hrs)', trend: '-0.5' },
              { value: '94%', label: 'Creator Satisfaction', trend: '+2%' }
            ].map((metric, index) => (
              <div key={index} className="metric-item">
                <span className="metric-value">{metric.value}</span>
                <span className="metric-label">{metric.label}</span>
                <span className={`metric-trend ${metric.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                  {metric.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-card agency-insights">
          <div className="card-header">
            <h3>Agency Insights</h3>
            <span className="insights-period">This month</span>
          </div>
          <div className="insights-grid">
            {[
              { label: 'Highest Earning Creator', value: 'Sarah Johnson', metric: '$12,500' },
              { label: 'Best Performing Platform', value: 'Instagram', metric: '95% success' },
              { label: 'Fastest Deal Completion', value: '2.1 days', metric: 'Tech Review' },
              { label: 'Most Profitable Niche', value: 'Fashion & Lifestyle', metric: '3.2x ROI' }
            ].map((insight, index) => (
              <div key={index} className="insight-item">
                <span className="insight-label">{insight.label}</span>
                <span className="insight-value">{insight.value}</span>
                <span className="insight-metric">{insight.metric}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

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

  return renderOverview();
};

export default Overview;
