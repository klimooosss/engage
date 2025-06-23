import React, { useState } from 'react';
import './analytics.css';

const Analytics = ({ userRole, timeFilter, setTimeFilter, analyticsInitialized }) => {
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

  // Modal component
  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    // Prevent scroll inside modal
    const handleWheel = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };
    // Use window.innerHeight/Width and scrollY/scrollX to center modal in user's viewport, but offset more to the left and up
    const modalStyle = {
      position: 'absolute',
      top: `calc(20vh + ${window.scrollY}px)`, // move up from center
      left: `calc(35vw + ${window.scrollX}px)`, // move more to the left from center
      transform: 'translate(-50%, -50%)',
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      minWidth: '320px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflow: 'hidden',
      boxShadow: '0 12px 48px 0 rgba(30,41,59,0.25), 0 1.5rem 3rem rgba(0,0,0,0.10)', // modal shadow
      zIndex: 1001,
      pointerEvents: 'auto',
    };
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1000
      }}>
        <div
          style={modalStyle}
          onWheel={handleWheel}
        >
          <button onClick={onClose} style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#64748b'
          }}>&times;</button>
          {children}
        </div>
      </div>
    );
  };

  // Replace all individual modal states with a single state
  const [openModal, setOpenModal] = useState(null);

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
        <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('earnings')}>
          <Chart 
            title="Earnings Over Time" 
            data={generateChartData('earnings')} 
            color="#28a745"
            analyticsInitialized={analyticsInitialized}
          />
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('dealTimeline')}>
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
      </div>

      {/* Modals for Row 1 */}
      <Modal isOpen={openModal === 'earnings'} onClose={() => setOpenModal(null)}>
        <h2 style={{ marginTop: 0 }}>Earnings Over Time - Details</h2>
        <p>This graph shows your total earnings for each month. Use this data to track your revenue growth and identify trends in your income over time.</p>
        <ul>
          {generateChartData('earnings').map((point, idx) => (
            <li key={idx}><strong>{point.month}:</strong> ${point.value.toLocaleString()}</li>
          ))}
        </ul>
      </Modal>
      <Modal isOpen={openModal === 'dealTimeline'} onClose={() => setOpenModal(null)}>
        <h2 style={{ marginTop: 0 }}>Deal Completion Timeline - Details</h2>
        <p>This graph shows the number of deals you completed each month. Use this to monitor your deal flow and identify busy or slow periods.</p>
        <ul>
          {currentData.dealTimeline.map((item, idx) => (
            <li key={idx}><strong>{item.month}:</strong> {item.completed} completed</li>
          ))}
        </ul>
      </Modal>

      {/* Charts Row 2 */}
      <div className={`charts-row ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
        <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('clicksViews')}>
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
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('pendingPaid')}>
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
      </div>

      {/* Modals for Row 2 */}
      <Modal isOpen={openModal === 'clicksViews'} onClose={() => setOpenModal(null)}>
        <h2 style={{ marginTop: 0 }}>Clicks/Views Generated per Deal - Details</h2>
        <p>This graph shows the number of clicks generated for each deal. Use this to see which deals drove the most engagement.</p>
        <ul>
          {currentData.clicksViewsPerDeal.map((item, idx) => (
            <li key={idx}><strong>{item.deal}:</strong> {item.clicks} clicks, {item.views} views, {item.conversion}% conversion</li>
          ))}
        </ul>
      </Modal>
      <Modal isOpen={openModal === 'pendingPaid'} onClose={() => setOpenModal(null)}>
        <h2 style={{ marginTop: 0 }}>Pending vs Paid Earnings - Details</h2>
        <p>This pie chart shows the breakdown of your earnings that are still pending versus those that have been paid out.</p>
        <ul>
          <li><strong>Paid:</strong> ${currentData.dealStats.paidEarnings.toLocaleString()}</li>
          <li><strong>Pending:</strong> ${currentData.dealStats.pendingEarnings.toLocaleString()}</li>
        </ul>
      </Modal>

      {/* Top Paying Brands and Platform Performance */}
      <div className="analytics-bottom">
        <div className="analytics-left">
          <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('topPayingBrands')}>
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
        </div>
        <div className="analytics-right">
          <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('platformPerformance')}>
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
      </div>
      {/* Modals for Bottom Section */}
      <Modal isOpen={openModal === 'topPayingBrands'} onClose={() => setOpenModal(null)}>
        <h2 style={{ marginTop: 0 }}>Top Paying Brands - Details</h2>
        <p>This table shows the brands that have paid you the most. Use this to identify your most valuable brand partners.</p>
        <ul>
          {currentData.topPayingBrands.map((brand, idx) => (
            <li key={idx}><strong>{brand.brand}:</strong> ${brand.totalPaid} total, {brand.deals} deals, avg ${brand.avgPerDeal}/deal</li>
          ))}
        </ul>
      </Modal>
      <Modal isOpen={openModal === 'platformPerformance'} onClose={() => setOpenModal(null)}>
        <h2 style={{ marginTop: 0 }}>Platform Performance - Details</h2>
        <p>This section shows your performance on each platform, including followers, engagement, reach, and earnings.</p>
        <ul>
          {currentData.platformPerformance.map((platform, idx) => (
            <li key={idx}><strong>{platform.platform}:</strong> {platform.followers.toLocaleString()} followers, {platform.engagement}% engagement, {platform.reach.toLocaleString()} reach, ${platform.earnings} earnings</li>
          ))}
        </ul>
      </Modal>
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
        <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('campaignSpend')}>
          <Chart 
            title="Campaign Spend Over Time" 
            data={generateChartData('spend')} 
            color="#ef4444"
            analyticsInitialized={analyticsInitialized}
          />
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('impressions')}>
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
      </div>

      {/* Modals for Row 1 */}
      <Modal isOpen={openModal === 'campaignSpend'} onClose={() => setOpenModal(null)}>
        <h2 style={{ marginTop: 0 }}>Campaign Spend Over Time - Details</h2>
        <p>This graph shows your campaign spending for each month. Use this to track your marketing budget and spending trends.</p>
        <ul>
          {generateChartData('spend').map((point, idx) => (
            <li key={idx}><strong>{point.month}:</strong> ${point.value.toLocaleString()}</li>
          ))}
        </ul>
      </Modal>
      <Modal isOpen={openModal === 'impressions'} onClose={() => setOpenModal(null)}>
        <h2 style={{ marginTop: 0 }}>Impressions vs Clicks vs Conversions - Details</h2>
        <p>This graph shows the number of impressions your campaigns received each month. Use this to monitor your reach and engagement.</p>
        <ul>
          {currentData.impressionsVsClicks.map((item, idx) => (
            <li key={idx}><strong>{item.month}:</strong> {item.impressions} impressions, {item.clicks} clicks, {item.conversions} conversions</li>
          ))}
        </ul>
      </Modal>

      {/* Charts Row 2 */}
      <div className={`charts-row ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
        <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('dealStatus')}>
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
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('revenueAttribution')}>
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
      </div>

      {/* Modals for Row 2 */}
      <Modal isOpen={openModal === 'dealStatus'} onClose={() => setOpenModal(null)}>
        <h2 style={{ marginTop: 0 }}>Deal Status Breakdown - Details</h2>
        <p>This pie chart shows the status of your deals: pending, active, completed, and rejected.</p>
        <ul>
          <li><strong>Pending:</strong> {currentData.dealStatus.pending}</li>
          <li><strong>Active:</strong> {currentData.dealStatus.active}</li>
          <li><strong>Completed:</strong> {currentData.dealStatus.completed}</li>
          <li><strong>Rejected:</strong> {currentData.dealStatus.rejected}</li>
        </ul>
      </Modal>
      <Modal isOpen={openModal === 'revenueAttribution'} onClose={() => setOpenModal(null)}>
        <h2 style={{ marginTop: 0 }}>Revenue Attribution per Deal - Details</h2>
        <p>This graph shows the revenue attributed to each deal. Use this to see which deals contributed most to your revenue.</p>
        <ul>
          {currentData.revenueAttribution.map((item, idx) => (
            <li key={idx}><strong>{item.deal}:</strong> ${item.attributed.toLocaleString()} attributed</li>
          ))}
        </ul>
      </Modal>
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
        <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('agencyEarnings')}>
          <Chart 
            title="Total Earnings Over Time" 
            data={generateChartData('revenue')} 
            color="#28a745"
            analyticsInitialized={analyticsInitialized}
          />
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('creatorActivity')}>
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
      </div>

      {/* Modals for Row 1 */}
      <Modal isOpen={openModal === 'agencyEarnings'} onClose={() => setOpenModal(null)}>
        <h2 style={{ marginTop: 0 }}>Total Earnings Over Time - Details</h2>
        <p>This graph shows your agency's total earnings for each month. Use this to track revenue growth and trends.</p>
        <ul>
          {generateChartData('revenue').map((point, idx) => (
            <li key={idx}><strong>{point.month}:</strong> ${point.value.toLocaleString()}</li>
          ))}
        </ul>
      </Modal>
      <Modal isOpen={openModal === 'creatorActivity'} onClose={() => setOpenModal(null)}>
        <h2 style={{ marginTop: 0 }}>Creator Activity Timeline - Details</h2>
        <p>This graph shows the number of active creators each month. Use this to monitor creator engagement and activity.</p>
        <ul>
          {currentData.creatorActivityTimeline.map((item, idx) => (
            <li key={idx}><strong>{item.month}:</strong> {item.activeCreators} active creators</li>
          ))}
        </ul>
      </Modal>

      {/* Charts Row 2 */}
      <div className={`charts-row ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
        <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('topCreators')}>
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
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('acceptedRejected')}>
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
      </div>

      {/* Modals for Row 2 */}
      <Modal isOpen={openModal === 'topCreators'} onClose={() => setOpenModal(null)}>
        <h2 style={{ marginTop: 0 }}>Top Performing Creators - Details</h2>
        <p>This graph shows your top performing creators by total earnings. Use this to identify your most valuable partners.</p>
        <ul>
          {currentData.topPerformingCreators.map((creator, idx) => (
            <li key={idx}><strong>{creator.creator}:</strong> ${creator.totalEarnings.toLocaleString()} ({creator.deals} deals, avg ${creator.avgDealValue}/deal, {creator.conversionRate}% conversion)</li>
          ))}
        </ul>
      </Modal>
      <Modal isOpen={openModal === 'acceptedRejected'} onClose={() => setOpenModal(null)}>
        <h2 style={{ marginTop: 0 }}>Accepted vs Rejected Deals - Details</h2>
        <p>This pie chart shows the breakdown of your agency's deals: accepted, rejected, and pending.</p>
        <ul>
          <li><strong>Accepted:</strong> {currentData.acceptedVsRejectedDeals.accepted}</li>
          <li><strong>Rejected:</strong> {currentData.acceptedVsRejectedDeals.rejected}</li>
          <li><strong>Pending:</strong> {currentData.acceptedVsRejectedDeals.pending}</li>
        </ul>
      </Modal>

      {/* Charts Row 3 */}
      <div className={`charts-row ${analyticsInitialized ? 'analytics-initialized' : ''}`}>
        <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('dealConversion')}>
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
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('avgDealValue')}>
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
      </div>

      {/* Revenue Breakdown and Top Clients */}
      <div className="analytics-bottom">
        <div className="analytics-left">
          <div style={{ cursor: 'pointer' }} onClick={() => setOpenModal('revenueBreakdown')}>
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

      {/* Modal for Revenue Breakdown by Brand */}
      <Modal isOpen={openModal === 'revenueBreakdown'} onClose={() => setOpenModal(null)}>
        <h2 style={{ marginTop: 0 }}>Revenue Breakdown by Brand - Details</h2>
        <p>This pie chart shows the revenue your agency earned from each brand. Use this to see which brands are your top clients.</p>
        <ul>
          {currentData.revenueBreakdownByBrand.map((brand, idx) => (
            <li key={idx}><strong>{brand.brand}:</strong> ${brand.revenue.toLocaleString()} ({brand.percentage}%)</li>
          ))}
        </ul>
      </Modal>
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

export default Analytics; 