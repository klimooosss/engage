import React, { useState } from 'react';
import './marketplace.css';

const Marketplace = ({ userRole, createNotification, marketplaceData }) => {
  // State for new deal modal
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [showEditDealModal, setShowEditDealModal] = useState(false);
  const [showDealDetailsModal, setShowDealDetailsModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [editingDeal, setEditingDeal] = useState(null);
  const [newDealForm, setNewDealForm] = useState({
    title: '',
    description: '',
    pay: '',
    category: 'Technology',
    platform: [],
    minFollowers: 1000,
    customFollowers: '',
    country: 'Worldwide',
    customCountry: '',
    niche: [],
    customNiche: '',
    engagementRate: 2,
    contentType: [],
    timeZone: '',
    availability: '',
    deadline: '',
    tags: ''
  });

  const [editDealForm, setEditDealForm] = useState({
    title: '',
    description: '',
    pay: '',
    category: 'Technology',
    platform: [],
    minFollowers: 1000,
    customFollowers: '',
    country: 'Worldwide',
    customCountry: '',
    niche: [],
    customNiche: '',
    engagementRate: 2,
    contentType: [],
    timeZone: '',
    availability: '',
    deadline: '',
    tags: ''
  });

  const [editFormValidation, setEditFormValidation] = useState({});
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle'); // idle, saving, saved, error

  // Available options
  const platformOptions = ['Instagram', 'TikTok', 'YouTube Shorts', 'Twitter/X'];
  const followerOptions = [1000, 5000, 10000, 50000, 100000];
  const countryOptions = [
    'Worldwide', 'Israel', 'United States', 'United Kingdom', 'Canada', 
    'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 
    'Sweden', 'Norway', 'Denmark', 'Finland', 'Japan', 'South Korea', 
    'India', 'Brazil', 'Mexico', 'Argentina', 'Chile'
  ];
  const nicheOptions = ['Fitness', 'Beauty', 'Finance', 'Fashion', 'Tech', 'Food', 'Lifestyle', 'Gaming'];
  const engagementOptions = [2, 3, 5];
  const contentTypeOptions = [
    'Reels', 'Stories', 'Carousel', 'Link in bio', 'Post + Tag', 
    'Product unboxing video', 'Short-form review'
  ];
  const availabilityOptions = [
    'Post within 24h', 'Post within 48h', 'Submit draft within 3 days',
    'Weekend posting', 'Weekday posting'
  ];

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewDealForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle platform checkbox changes
  const handlePlatformChange = (platform) => {
    setNewDealForm(prev => ({
      ...prev,
      platform: prev.platform.includes(platform)
        ? prev.platform.filter(p => p !== platform)
        : [...prev.platform, platform]
    }));
  };

  // Handle niche checkbox changes
  const handleNicheChange = (niche) => {
    setNewDealForm(prev => ({
      ...prev,
      niche: prev.niche.includes(niche)
        ? prev.niche.filter(n => n !== niche)
        : [...prev.niche, niche]
    }));
  };

  // Handle content type checkbox changes
  const handleContentTypeChange = (contentType) => {
    setNewDealForm(prev => ({
      ...prev,
      contentType: prev.contentType.includes(contentType)
        ? prev.contentType.filter(c => c !== contentType)
        : [...prev.contentType, contentType]
    }));
  };

  // Handle form submission
  const handleSubmitDeal = (e) => {
    e.preventDefault();
    createNotification('Deal posted successfully! (No backend - demo only)', 'success');
    setShowNewDealModal(false);
    setNewDealForm({
      title: '',
      description: '',
      pay: '',
      category: 'Technology',
      platform: [],
      minFollowers: 1000,
      customFollowers: '',
      country: 'Worldwide',
      customCountry: '',
      niche: [],
      customNiche: '',
      engagementRate: 2,
      contentType: [],
      timeZone: '',
      availability: '',
      deadline: '',
      tags: ''
    });
  };

  // Handle edit deal
  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    
    // Enhanced data mapping with better defaults and parsing
    const mappedDeal = {
      title: deal.title || '',
      description: deal.description || '',
      pay: deal.pay ? deal.pay.replace(/[^0-9]/g, '') : '', // Extract numbers only
      category: deal.category || 'Technology',
      platform: deal.platform || deal.requirements?.filter(req => 
        ['Instagram', 'TikTok', 'YouTube Shorts', 'Twitter/X'].some(p => req.includes(p))
      ).map(req => {
        if (req.includes('Instagram')) return 'Instagram';
        if (req.includes('TikTok')) return 'TikTok';
        if (req.includes('YouTube')) return 'YouTube Shorts';
        if (req.includes('Twitter')) return 'Twitter/X';
        return null;
      }).filter(Boolean) || [],
      minFollowers: deal.minFollowers || 
        (deal.requirements?.find(req => req.includes('followers')) 
          ? parseInt(deal.requirements.find(req => req.includes('followers')).match(/\d+/)?.[0] || '1') * 1000
          : 1000),
      customFollowers: '',
      country: deal.country || 'Worldwide',
      customCountry: '',
      niche: deal.niche || deal.requirements?.filter(req => 
        ['Fitness', 'Beauty', 'Finance', 'Fashion', 'Tech', 'Food', 'Lifestyle', 'Gaming'].some(n => req.includes(n))
      ).map(req => {
        if (req.includes('Fitness')) return 'Fitness';
        if (req.includes('Beauty')) return 'Beauty';
        if (req.includes('Finance')) return 'Finance';
        if (req.includes('Fashion')) return 'Fashion';
        if (req.includes('Tech')) return 'Tech';
        if (req.includes('Food')) return 'Food';
        if (req.includes('Lifestyle')) return 'Lifestyle';
        if (req.includes('Gaming')) return 'Gaming';
        return null;
      }).filter(Boolean) || [],
      customNiche: '',
      engagementRate: deal.engagementRate || 
        (deal.requirements?.find(req => req.includes('engagement')) 
          ? parseFloat(deal.requirements.find(req => req.includes('engagement')).match(/\d+/)?.[0] || '2')
          : 2),
      contentType: deal.contentType || deal.requirements?.filter(req => 
        ['Reels', 'Stories', 'Carousel', 'Link in bio', 'Post + Tag', 'Product unboxing', 'Short-form review'].some(c => req.includes(c))
      ).map(req => {
        if (req.includes('Reels')) return 'Reels';
        if (req.includes('Stories')) return 'Stories';
        if (req.includes('Carousel')) return 'Carousel';
        if (req.includes('Link in bio')) return 'Link in bio';
        if (req.includes('Post + Tag')) return 'Post + Tag';
        if (req.includes('unboxing')) return 'Product unboxing video';
        if (req.includes('review')) return 'Short-form review';
        return null;
      }).filter(Boolean) || [],
      timeZone: deal.timeZone || '',
      availability: deal.availability || '',
      deadline: deal.deadline || '',
      tags: deal.tags?.join(', ') || deal.tags || ''
    };
    
    setEditDealForm(mappedDeal);
    setShowEditDealModal(true);
    
    // Show helpful notification
    createNotification(`Editing "${deal.title}" - All fields pre-filled with current data`, 'info');
  };

  // Handle edit form submission
  const handleSubmitEditDeal = (e) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!editDealForm.title.trim()) {
      createNotification('Please enter a deal title', 'error');
      return;
    }
    
    if (!editDealForm.description.trim()) {
      createNotification('Please enter a deal description', 'error');
      return;
    }
    
    if (!editDealForm.pay || editDealForm.pay <= 0) {
      createNotification('Please enter a valid pay amount', 'error');
      return;
    }
    
    if (editDealForm.platform.length === 0) {
      createNotification('Please select at least one platform', 'error');
      return;
    }
    
    if (editDealForm.niche.length === 0) {
      createNotification('Please select at least one niche', 'error');
      return;
    }
    
    if (editDealForm.contentType.length === 0) {
      createNotification('Please select at least one content type', 'error');
      return;
    }
    
    if (!editDealForm.deadline) {
      createNotification('Please select a deadline', 'error');
      return;
    }
    
    // Success notification with more details
    const changes = [];
    if (editingDeal.title !== editDealForm.title) changes.push('title');
    if (editingDeal.description !== editDealForm.description) changes.push('description');
    if (editingDeal.pay !== `$${editDealForm.pay}`) changes.push('pay');
    
    createNotification(`Deal "${editDealForm.title}" updated successfully! Changes: ${changes.join(', ')}`, 'success');
    setShowEditDealModal(false);
    setEditingDeal(null);
    setEditDealForm({
      title: '',
      description: '',
      pay: '',
      category: 'Technology',
      platform: [],
      minFollowers: 1000,
      customFollowers: '',
      country: 'Worldwide',
      customCountry: '',
      niche: [],
      customNiche: '',
      engagementRate: 2,
      contentType: [],
      timeZone: '',
      availability: '',
      deadline: '',
      tags: ''
    });
  };

  // Handle opening deal details modal
  const handleViewDealDetails = (deal) => {
    setSelectedDeal(deal);
    setShowDealDetailsModal(true);
  };

  // Spectacular auto-save function
  const handleAutoSave = (formData) => {
    setAutoSaveStatus('saving');
    
    // Simulate auto-save with beautiful animation
    setTimeout(() => {
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    }, 800);
  };

  // Real-time validation with amazing feedback
  const validateEditForm = (formData) => {
    const validation = {};
    
    if (!formData.title.trim()) {
      validation.title = 'Deal title is required';
    } else if (formData.title.length < 5) {
      validation.title = 'Title should be at least 5 characters';
    }
    
    if (!formData.description.trim()) {
      validation.description = 'Description is required';
    } else if (formData.description.length < 20) {
      validation.description = 'Description should be at least 20 characters';
    }
    
    if (!formData.pay || formData.pay <= 0) {
      validation.pay = 'Valid pay is required';
    } else if (formData.pay < 50) {
      validation.pay = 'Pay should be at least $50';
    }
    
    if (formData.platform.length === 0) {
      validation.platform = 'Select at least one platform';
    }
    
    if (formData.niche.length === 0) {
      validation.niche = 'Select at least one niche';
    }
    
    if (formData.contentType.length === 0) {
      validation.contentType = 'Select at least one content type';
    }
    
    if (!formData.deadline) {
      validation.deadline = 'Deadline is required';
    }
    
    setEditFormValidation(validation);
    return Object.keys(validation).length === 0;
  };

  // Enhanced form change handler with auto-save
  const handleEditFormChange = (field, value) => {
    const updatedForm = { ...editDealForm, [field]: value };
    setEditDealForm(updatedForm);
    
    // Auto-save after 2 seconds of inactivity
    clearTimeout(window.autoSaveTimer);
    window.autoSaveTimer = setTimeout(() => {
      if (validateEditForm(updatedForm)) {
        handleAutoSave(updatedForm);
      }
    }, 2000);
    
    // Real-time validation
    validateEditForm(updatedForm);
  };

  // DealCard subcomponent
  const DealCard = ({ deal, onApply, onView, userRole }) => (
    <div className="deal-card">
      <div className="deal-header">
        <div className="brand-info">
          <span className="brand-logo">{deal.brandLogo}</span>
          <div>
            <h4>{deal.brand}</h4>
            <span className="category">{deal.category}</span>
          </div>
        </div>
        <div className="deal-status">
          <span className={`status-badge ${deal.status}`}>{deal.status}</span>
        </div>
      </div>
      <div className="deal-content">
        <h3>{deal.title}</h3>
        <p>{deal.description}</p>
        <div className="deal-metrics">
          <div className="metric">
            <span className="label">Pay:</span>
            <span className="value">{deal.pay}</span>
          </div>
          <div className="metric">
            <span className="label">Engagement:</span>
            <span className="value">{deal.engagement}</span>
          </div>
          <div className="metric">
            <span className="label">Reach:</span>
            <span className="value">{deal.reach}</span>
          </div>
        </div>
        <div className="deal-requirements">
          <h5>Requirements:</h5>
          <ul>
            {deal.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
        <div className="deal-tags">
          {deal.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      <div className="deal-footer">
        <div className="deal-meta">
          <span>Deadline: {deal.deadline}</span>
          <span>{deal.takenBy ? `Taken by ${deal.takenBy}` : 'Available'}</span>
        </div>
        <div className="deal-actions">
          <button className="btn-secondary" onClick={() => userRole === 'brand' ? handleEditDeal(deal) : handleViewDealDetails(deal)}>
            {userRole === 'brand' ? 'Edit Deal' : 'View Details'}
          </button>
          <button className="btn-primary" onClick={() => onApply(deal)}>
            {userRole === 'brand' ? 'Deal Status' : 'Take Deal'}
          </button>
        </div>
      </div>
    </div>
  );

  // CreatorCard subcomponent
  const CreatorCard = ({ creator, onContact, onView }) => (
    <div className="creator-card">
      <div className="creator-header">
        <div className="creator-avatar">{creator.avatar}</div>
        <div className="creator-info">
          <h4>{creator.name}</h4>
          <span className="category">{creator.category}</span>
          <div className="creator-stats">
            <span>{creator.followers}K followers</span>
            <span>{creator.engagement}% engagement</span>
          </div>
        </div>
        <div className="creator-rating">
          <span className="stars">★★★★★</span>
          <span>{creator.rating}</span>
        </div>
      </div>
      <div className="creator-content">
        <div className="creator-metrics">
          <div className="metric">
            <span className="label">Reach:</span>
            <span className="value">{creator.reach}</span>
          </div>
          <div className="metric">
            <span className="label">Avg Deal:</span>
            <span className="value">{creator.avgDealValue}</span>
          </div>
          <div className="metric">
            <span className="label">Response Rate:</span>
            <span className="value">{creator.responseRate}%</span>
          </div>
        </div>
        <div className="creator-tags">
          {creator.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
        <div className="creator-availability">
          <span className={`availability-badge ${creator.availability.toLowerCase()}`}>{creator.availability}</span>
          <span className="price-range">{creator.priceRange}</span>
        </div>
      </div>
      <div className="creator-footer">
        <div className="creator-actions">
          <button className="btn-secondary" onClick={() => onView(creator)}>View Profile</button>
          <button className="btn-primary" onClick={() => onContact(creator)}>Contact</button>
        </div>
      </div>
    </div>
  );

  // Creator Marketplace
  const renderCreatorMarketplace = () => (
    <div className="marketplace-container">
      <div className="marketplace-header">
        <div className="section-title">
          <h2>Creator Marketplace</h2>
          <p>Discover and apply for brand collaboration opportunities</p>
        </div>
        <div className="marketplace-filters">
          <select className="filter-select">
            <option>All Categories</option>
            <option>Technology</option>
            <option>Fashion</option>
            <option>Health</option>
            <option>Food</option>
          </select>
          <select className="filter-select">
            <option>All Pays</option>
            <option>$100 - $500</option>
            <option>$500 - $1,000</option>
            <option>$1,000+</option>
          </select>
          <button className="btn-primary">Search</button>
        </div>
      </div>
      <div className="marketplace-content">
        <div className="marketplace-section">
          <h3>Available Deals</h3>
          <div className="deals-grid">
            {marketplaceData.availableDeals.map(deal => (
              <DealCard 
                key={deal.id} 
                deal={deal}
                onApply={(deal) => createNotification(`Deal "${deal.title}" taken successfully!`, 'success')}
                onView={(deal) => createNotification(`Viewing ${deal.title}`, 'info')}
                userRole={userRole}
              />
            ))}
          </div>
        </div>
        {marketplaceData.takenDeals && (
          <div className="marketplace-section">
            <h3>My Taken Deals</h3>
            <div className="taken-deals-list">
              {marketplaceData.takenDeals.map(deal => (
                <div key={deal.id} className="taken-deal-item">
                  <div className="deal-info">
                    <h4>{deal.title}</h4>
                    <span className="brand">{deal.brand}</span>
                    <span className={`status ${deal.status}`}>{deal.status}</span>
                  </div>
                  <div className="deal-meta">
                    <span>Taken: {deal.takenDate}</span>
                    <span>Pay: {deal.pay}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Brand Marketplace
  const renderBrandMarketplace = () => (
    <div className="marketplace-container">
      <div className="marketplace-header">
        <div className="section-title">
          <h2>Brand Marketplace</h2>
          <p>Post and manage your brand deals and campaigns</p>
        </div>
        <div className="marketplace-filters">
          <button 
            className="btn-primary" 
            onClick={() => setShowNewDealModal(true)}
          >
            + Post New Deal
          </button>
          <select 
            className="filter-select"
            onChange={(e) => createNotification(`Filtering by status: ${e.target.value}`, 'info')}
          >
            <option>All Deals</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
          <select 
            className="filter-select"
            onChange={(e) => createNotification(`Filtering by category: ${e.target.value}`, 'info')}
          >
            <option>All Categories</option>
            <option>Technology</option>
            <option>Fashion</option>
            <option>Health</option>
            <option>Food</option>
          </select>
        </div>
      </div>
      <div className="marketplace-content">
        <div className="marketplace-section">
          <h3>My Posted Deals</h3>
          <div className="deals-grid">
            {marketplaceData.availableDeals.map(deal => (
              <DealCard 
                key={deal.id} 
                deal={deal}
                onApply={(deal) => createNotification(`Viewing status for ${deal.title}`, 'info')}
                onView={(deal) => createNotification(`Editing ${deal.title}`, 'success')}
                userRole={userRole}
              />
            ))}
          </div>
        </div>
        {marketplaceData.activeDeals && (
          <div className="marketplace-section">
            <h3>Active Deals</h3>
            <div className="active-deals-list">
              {marketplaceData.activeDeals.map(deal => (
                <div key={deal.id} className="active-deal-item">
                  <div className="deal-info">
                    <h4>{deal.title}</h4>
                    <span className="creator">{deal.takenBy}</span>
                    <span className={`status ${deal.status}`}>{deal.status}</span>
                  </div>
                  <div className="deal-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${deal.progress}%`}}></div>
                    </div>
                    <span>{deal.progress}% complete</span>
                  </div>
                  <div className="deal-meta">
                    <span>Pay: {deal.pay}</span>
                    <span>Assigned: {deal.assignedDate}</span>
                  </div>
                  <div className="deal-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                    <button 
                      className="btn-secondary"
                      onClick={() => createNotification(`Viewing details for ${deal.title}`, 'info')}
                    >
                      View Details
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => createNotification(`Managing ${deal.title}`, 'success')}
                    >
                      Manage Deal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {marketplaceData.appliedDeals && (
          <div className="marketplace-section">
            <h3>Pending Applications</h3>
            <div className="applications-list">
              {marketplaceData.appliedDeals.map(deal => (
                <div key={deal.id} className="application-item">
                  <div className="application-info">
                    <h4>{deal.title}</h4>
                    <span className="brand">{deal.brand}</span>
                    <span className={`status ${deal.status}`}>{deal.status}</span>
                  </div>
                  <div className="application-meta">
                    <span>Applied: {deal.appliedDate}</span>
                    {deal.expectedResponse && <span>Response by: {deal.expectedResponse}</span>}
                  </div>
                  <div className="application-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                    <button 
                      className="btn-secondary"
                      onClick={() => createNotification(`Viewing application for ${deal.title}`, 'info')}
                    >
                      View Application
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => createNotification(`Approved application for ${deal.title}`, 'success')}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => createNotification(`Rejected application for ${deal.title}`, 'warning')}
                      style={{ backgroundColor: '#fee2e2', color: '#ef4444', borderColor: '#fecaca' }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Agency Marketplace
  const renderAgencyMarketplace = () => (
    <div className="marketplace-container">
      <div className="marketplace-header">
        <div className="section-title">
          <h2>Agency Marketplace</h2>
          <p>Manage large-scale campaigns and creator networks</p>
        </div>
        <div className="marketplace-filters">
          <select className="filter-select">
            <option>All Campaign Types</option>
            <option>Brand Awareness</option>
            <option>Product Launch</option>
            <option>Lead Generation</option>
          </select>
          <select className="filter-select">
            <option>All Pays</option>
            <option>$5K - $10K</option>
            <option>$10K - $25K</option>
            <option>$25K+</option>
          </select>
          <button className="btn-primary">Search</button>
        </div>
      </div>
      <div className="marketplace-content">
        <div className="marketplace-section">
          <h3>Available Campaigns</h3>
          <div className="campaigns-grid">
            {marketplaceData.availableDeals.map(deal => (
              <DealCard 
                key={deal.id} 
                deal={deal}
                onApply={(deal) => createNotification(`Applied to ${deal.title}`, 'success')}
                onView={(deal) => createNotification(`Viewing ${deal.title}`, 'info')}
                userRole={userRole}
              />
            ))}
          </div>
        </div>
        <div className="marketplace-section">
          <h3>Creator Network</h3>
          <div className="network-grid">
            {marketplaceData.creatorNetwork.map(creator => (
              <div key={creator.id} className="network-card">
                <div className="network-header">
                  <h4>{creator.name}</h4>
                  <span className="category">{creator.category}</span>
                </div>
                <div className="network-stats">
                  <div className="stat">
                    <span className="label">Followers:</span>
                    <span className="value">{creator.followers}K</span>
                  </div>
                  <div className="stat">
                    <span className="label">Engagement:</span>
                    <span className="value">{creator.engagement}%</span>
                  </div>
                  <div className="stat">
                    <span className="label">Success Rate:</span>
                    <span className="value">{creator.successRate}%</span>
                  </div>
                </div>
                <div className="network-actions">
                  <button className="btn-secondary">View Details</button>
                  <button className="btn-primary">Add to Campaign</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="marketplace-section">
          <h3>Network Deals</h3>
          <div className="deals-grid">
            {marketplaceData.availableDeals.map(deal => (
              <DealCard 
                key={deal.id} 
                deal={deal}
                onApply={(deal) => createNotification(`Assigning ${deal.title} to creator`, 'success')}
                onView={(deal) => createNotification(`Viewing ${deal.title} details`, 'info')}
                userRole={userRole}
              />
            ))}
          </div>
        </div>
        {marketplaceData.managedDeals && (
          <div className="marketplace-section">
            <h3>Managed Deals</h3>
            <div className="managed-deals-list">
              {marketplaceData.managedDeals.map(deal => (
                <div key={deal.id} className="managed-deal-item">
                  <div className="deal-info">
                    <h4>{deal.title}</h4>
                    <span className="creator">{deal.assignedCreator}</span>
                    <span className={`status ${deal.status}`}>{deal.status}</span>
                  </div>
                  <div className="deal-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${deal.progress}%`}}></div>
                    </div>
                    <span>{deal.progress}% complete</span>
                  </div>
                  <div className="deal-meta">
                    <span>Pay: {deal.pay}</span>
                    <span>Assigned: {deal.assignedDate}</span>
                  </div>
                  <div className="deal-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                    <button 
                      className="btn-secondary"
                      onClick={() => createNotification(`Viewing details for ${deal.title}`, 'info')}
                    >
                      View Details
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => createNotification(`Managing ${deal.title}`, 'success')}
                    >
                      Manage Deal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard-section">
      {userRole === 'creator' && renderCreatorMarketplace()}
      {userRole === 'brand' && renderBrandMarketplace()}
      {userRole === 'agency' && renderAgencyMarketplace()}

      {/* New Deal Modal */}
      {showNewDealModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '24px',
            padding: '3rem',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '3rem',
              paddingBottom: '2rem',
              borderBottom: '2px solid rgba(59, 130, 246, 0.08)',
              position: 'relative'
            }}>
              <div>
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '2.75rem', 
                  fontWeight: '900', 
                  background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.03em',
                  lineHeight: '1.1'
                }}>
                  Post New Deal
                </h2>
                <p style={{
                  margin: '0.75rem 0 0 0',
                  color: '#64748b',
                  fontSize: '1.15rem',
                  fontWeight: '500',
                  lineHeight: '1.5'
                }}>
                  Create an engaging campaign for creators
                </p>
              </div>
              <button 
                onClick={() => setShowNewDealModal(false)}
                style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: 'none',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '1.25rem',
                  borderRadius: '20px',
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.15) rotate(90deg)';
                  e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                  e.target.style.color = 'white';
                  e.target.style.boxShadow = '0 12px 32px rgba(239, 68, 68, 0.4), 0 6px 16px rgba(239, 68, 68, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1) rotate(0deg)';
                  e.target.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
                  e.target.style.color = '#64748b';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08)';
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitDeal}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '1rem', 
                    fontWeight: '800', 
                    color: '#1e293b',
                    fontSize: '1.2rem',
                    letterSpacing: '-0.01em'
                  }}>
                    Deal Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newDealForm.title}
                    onChange={handleFormChange}
                    required
                    style={{
                      width: '100%',
                      padding: '1.25rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '16px',
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      fontWeight: '500'
                    }}
                    placeholder="Enter an engaging deal title"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 24px rgba(0, 0, 0, 0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '1rem', 
                    fontWeight: '800', 
                    color: '#1e293b',
                    fontSize: '1.2rem',
                    letterSpacing: '-0.01em'
                  }}>
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={newDealForm.description}
                    onChange={handleFormChange}
                    required
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '1.25rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '16px',
                      fontSize: '1.1rem',
                      resize: 'vertical',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      fontWeight: '500',
                      lineHeight: '1.6'
                    }}
                    placeholder="Describe your deal requirements and expectations"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 24px rgba(0, 0, 0, 0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div style={{ maxWidth: '200px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '1rem', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Fixed Pay *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute',
                        left: '1.25rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#64748b',
                        fontWeight: '700',
                        fontSize: '1.1rem'
                      }}>
                        $
                      </span>
                      <input
                        type="number"
                        name="pay"
                        value={newDealForm.pay}
                        onChange={handleFormChange}
                        required
                        min="1"
                        style={{
                          width: '100%',
                          padding: '1.25rem 1.25rem 1.25rem 3rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '16px',
                          fontSize: '1.1rem',
                          transition: 'all 0.3s ease',
                          background: 'white',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                          fontWeight: '600'
                        }}
                        placeholder="500"
                        onFocus={(e) => {
                          e.target.style.borderColor = '#3b82f6';
                          e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 24px rgba(0, 0, 0, 0.1)';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e2e8f0';
                          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '1rem', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Category *
                    </label>
                    <select
                      name="category"
                      value={newDealForm.category}
                      onChange={handleFormChange}
                      required
                      style={{
                        width: '100%',
                        padding: '1.25rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        background: 'white',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 1rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '3rem'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 24px rgba(0, 0, 0, 0.1)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <option value="Technology">Technology</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Health">Health</option>
                      <option value="Food">Food</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Fitness">Fitness</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '1rem', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Minimum Followers: <span style={{ color: '#3b82f6', fontWeight: '900' }}>{newDealForm.minFollowers >= 1000 ? `${newDealForm.minFollowers / 1000}K` : newDealForm.minFollowers}</span>
                    </label>
                    <div style={{ 
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      border: '2px solid #e2e8f0'
                    }}>
                      <input
                        type="range"
                        name="minFollowers"
                        min="1"
                        max="100"
                        step="1"
                        value={newDealForm.minFollowers / 1000}
                        onChange={(e) => {
                          const sliderValue = parseInt(e.target.value);
                          const newFollowers = sliderValue * 1000;
                          console.log('Slider moved:', { sliderValue, newFollowers });
                          setNewDealForm(prev => ({
                            ...prev,
                            minFollowers: newFollowers
                          }));
                        }}
                        style={{
                          width: '100%',
                          height: '8px',
                          borderRadius: '4px',
                          background: 'linear-gradient(90deg, #e2e8f0 0%, #cbd5e1 100%)',
                          outline: 'none',
                          cursor: 'pointer',
                          WebkitAppearance: 'none',
                          appearance: 'none',
                          position: 'relative',
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                        onInput={(e) => {
                          const value = e.target.value;
                          const min = e.target.min;
                          const max = e.target.max;
                          const percentage = ((value - min) / (max - min)) * 100;
                          e.target.style.background = `linear-gradient(90deg, #3b82f6 0%, #2563eb 100%) ${percentage}%, #e2e8f0 ${percentage}%, #cbd5e1 100%)`;
                        }}
                      />
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginTop: '1rem',
                        fontSize: '0.9rem',
                        color: '#64748b',
                        fontWeight: '600'
                      }}>
                        <span>1K</span>
                        <span>10K</span>
                        <span>20K</span>
                        <span>30K</span>
                        <span>40K</span>
                        <span>50K</span>
                        <span>60K</span>
                        <span>70K</span>
                        <span>80K</span>
                        <span>90K</span>
                        <span>100K</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '1rem', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Engagement Rate: <span style={{ color: '#3b82f6', fontWeight: '900' }}>{newDealForm.engagementRate}%</span>
                    </label>
                    <div style={{ 
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      border: '2px solid #e2e8f0'
                    }}>
                      <input
                        type="range"
                        name="engagementRate"
                        min="1"
                        max="10"
                        step="0.5"
                        value={newDealForm.engagementRate}
                        onChange={(e) => setNewDealForm(prev => ({
                          ...prev,
                          engagementRate: parseFloat(e.target.value)
                        }))}
                        style={{
                          width: '100%',
                          height: '8px',
                          borderRadius: '4px',
                          background: 'linear-gradient(90deg, #e2e8f0 0%, #cbd5e1 100%)',
                          outline: 'none',
                          cursor: 'pointer',
                          WebkitAppearance: 'none',
                          appearance: 'none',
                          position: 'relative',
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                        onInput={(e) => {
                          const value = e.target.value;
                          const min = e.target.min;
                          const max = e.target.max;
                          const percentage = ((value - min) / (max - min)) * 100;
                          e.target.style.background = `linear-gradient(90deg, #3b82f6 0%, #2563eb 100%) ${percentage}%, #e2e8f0 ${percentage}%, #cbd5e1 100%)`;
                        }}
                      />
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginTop: '1rem',
                        fontSize: '0.9rem',
                        color: '#64748b',
                        fontWeight: '600'
                      }}>
                        <span>1%</span>
                        <span>3%</span>
                        <span>5%</span>
                        <span>7%</span>
                        <span>10%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '1rem', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Country *
                    </label>
                    <select
                      name="country"
                      value={newDealForm.country}
                      onChange={handleFormChange}
                      required
                      style={{
                        width: '100%',
                        padding: '1.25rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        background: 'white',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 1rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '3rem'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 24px rgba(0, 0, 0, 0.1)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      {countryOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '1rem', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Deadline *
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={newDealForm.deadline}
                      onChange={handleFormChange}
                      required
                      style={{
                        width: '100%',
                        padding: '1.25rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        background: 'white',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        fontWeight: '600'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 24px rgba(0, 0, 0, 0.1)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '1rem', 
                    fontWeight: '800', 
                    color: '#1e293b',
                    fontSize: '1.2rem',
                    letterSpacing: '-0.01em'
                  }}>
                    Platform *
                  </label>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                    gap: '0.75rem',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderRadius: '16px',
                    border: '2px solid #e2e8f0'
                  }}>
                    {platformOptions.map((option) => (
                      <label key={option} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '2px solid #e2e8f0',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                        e.currentTarget.style.borderColor = '#3b82f6';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                      >
                        <input
                          type="checkbox"
                          name="platform"
                          value={option}
                          checked={newDealForm.platform.includes(option)}
                          onChange={(e) => handlePlatformChange(e.target.value)}
                          style={{
                            width: '20px',
                            height: '20px',
                            accentColor: '#3b82f6'
                          }}
                        />
                        <span style={{ 
                          fontWeight: '600', 
                          color: '#374151'
                        }}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '1rem', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Niche *
                    </label>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: '0.75rem',
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      borderRadius: '16px',
                      border: '2px solid #e2e8f0'
                    }}>
                      {nicheOptions.map((option) => (
                        <label key={option} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '1rem',
                          background: 'white',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: '2px solid #e2e8f0',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                          e.currentTarget.style.borderColor = '#3b82f6';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                        >
                          <input
                            type="checkbox"
                            name="niche"
                            value={option}
                            checked={newDealForm.niche.includes(option)}
                            onChange={(e) => handleNicheChange(e.target.value)}
                            style={{
                              width: '20px',
                              height: '20px',
                              accentColor: '#3b82f6'
                            }}
                          />
                          <span style={{ 
                            fontWeight: '600', 
                            color: '#374151'
                          }}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '1rem', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Content Type *
                    </label>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: '0.75rem',
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      borderRadius: '16px',
                      border: '2px solid #e2e8f0'
                    }}>
                      {contentTypeOptions.map((option) => (
                        <label key={option} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '1rem',
                          background: 'white',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: '2px solid #e2e8f0',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                          e.currentTarget.style.borderColor = '#3b82f6';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                        >
                          <input
                            type="checkbox"
                            name="contentType"
                            value={option}
                            checked={newDealForm.contentType.includes(option)}
                            onChange={(e) => handleContentTypeChange(e.target.value)}
                            style={{
                              width: '20px',
                              height: '20px',
                              accentColor: '#3b82f6'
                            }}
                          />
                          <span style={{ 
                            fontWeight: '600', 
                            color: '#374151'
                          }}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '1rem', 
                    fontWeight: '800', 
                    color: '#1e293b',
                    fontSize: '1.2rem',
                    letterSpacing: '-0.01em'
                  }}>
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={newDealForm.tags}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '1.25rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '16px',
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      fontWeight: '500'
                    }}
                    placeholder="e.g., Tech, Review, Video"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 24px rgba(0, 0, 0, 0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  />
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '1.5rem', 
                marginTop: '3rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowNewDealModal(false)}
                  className="btn-secondary"
                  style={{ 
                    minWidth: '140px',
                    padding: '1.25rem 2rem',
                    borderRadius: '16px',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                    border: '2px solid #cbd5e1',
                    color: '#2563eb',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ 
                    minWidth: '160px',
                    padding: '1.5rem 2.5rem',
                    borderRadius: '20px',
                    fontWeight: '800',
                    fontSize: '1.15rem',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
                    border: 'none',
                    color: 'white',
                    boxShadow: '0 12px 32px rgba(59, 130, 246, 0.4), 0 4px 16px rgba(59, 130, 246, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    letterSpacing: '-0.01em'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-4px) scale(1.02)';
                    e.target.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.5), 0 8px 24px rgba(59, 130, 246, 0.3)';
                    e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.4), 0 4px 16px rgba(59, 130, 246, 0.2)';
                    e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)';
                  }}
                  onMouseDown={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(0.98)';
                  }}
                  onMouseUp={(e) => {
                    e.target.style.transform = 'translateY(-4px) scale(1.02)';
                  }}
                >
                  Post Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Deal Modal */}
      {showEditDealModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '24px',
            padding: '3rem',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '3rem',
              paddingBottom: '2rem',
              borderBottom: '2px solid rgba(59, 130, 246, 0.08)',
              position: 'relative'
            }}>
              <div>
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '2.75rem', 
                  fontWeight: '900', 
                  background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.03em',
                  lineHeight: '1.1'
                }}>
                  Edit Deal
                </h2>
                <p style={{
                  margin: '0.75rem 0 0 0',
                  color: '#64748b',
                  fontSize: '1.15rem',
                  fontWeight: '500',
                  lineHeight: '1.5'
                }}>
                  Update your campaign details
                </p>
                {editingDeal && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.25rem',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      flexShrink: 0
                    }}></div>
                    <span style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      Currently editing: <span style={{ color: '#3b82f6', fontWeight: '700' }}>"{editingDeal.title}"</span>
                    </span>
                  </div>
                )}
                
                {/* Spectacular Auto-Save Indicator */}
                <div style={{
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  background: autoSaveStatus === 'saving' 
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)'
                    : autoSaveStatus === 'saved'
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
                    : 'transparent',
                  border: autoSaveStatus === 'saving'
                    ? '1px solid rgba(245, 158, 11, 0.3)'
                    : autoSaveStatus === 'saved'
                    ? '1px solid rgba(34, 197, 94, 0.3)'
                    : 'none',
                  transition: 'all 0.3s ease',
                  opacity: autoSaveStatus === 'idle' ? 0 : 1
                }}>
                  {autoSaveStatus === 'saving' && (
                    <>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        border: '2px solid #f59e0b',
                        borderTop: '2px solid transparent',
                        animation: 'spin 1s linear infinite',
                        flexShrink: 0
                      }}></div>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: '#d97706'
                      }}>
                        Auto-saving...
                      </span>
                    </>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <span style={{ color: 'white', fontSize: '8px', fontWeight: 'bold' }}>✓</span>
                      </div>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: '#16a34a'
                      }}>
                        Auto-saved successfully!
                      </span>
                    </>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setShowEditDealModal(false)}
                style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: 'none',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '1.25rem',
                  borderRadius: '20px',
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.15) rotate(90deg)';
                  e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                  e.target.style.color = 'white';
                  e.target.style.boxShadow = '0 12px 32px rgba(239, 68, 68, 0.4), 0 6px 16px rgba(239, 68, 68, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1) rotate(0deg)';
                  e.target.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
                  e.target.style.color = '#64748b';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08)';
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitEditDeal}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '1rem', 
                    fontWeight: '800', 
                    color: '#1e293b',
                    fontSize: '1.2rem',
                    letterSpacing: '-0.01em'
                  }}>
                    Deal Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editDealForm.title}
                    onChange={(e) => handleEditFormChange('title', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '1.25rem',
                      border: editFormValidation.title ? '2px solid #ef4444' : '2px solid #e2e8f0',
                      borderRadius: '16px',
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      boxShadow: editFormValidation.title 
                        ? '0 4px 12px rgba(239, 68, 68, 0.1)' 
                        : '0 4px 12px rgba(0, 0, 0, 0.05)',
                      fontWeight: '500'
                    }}
                    placeholder="Enter an engaging deal title"
                    onFocus={(e) => {
                      e.target.style.borderColor = editFormValidation.title ? '#ef4444' : '#3b82f6';
                      e.target.style.boxShadow = editFormValidation.title 
                        ? '0 0 0 4px rgba(239, 68, 68, 0.1), 0 8px 24px rgba(0, 0, 0, 0.1)'
                        : '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 24px rgba(0, 0, 0, 0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = editFormValidation.title ? '#ef4444' : '#e2e8f0';
                      e.target.style.boxShadow = editFormValidation.title 
                        ? '0 4px 12px rgba(239, 68, 68, 0.1)'
                        : '0 4px 12px rgba(0, 0, 0, 0.05)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  />
                  {editFormValidation.title && (
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
                      borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ color: '#ef4444', fontSize: '14px' }}>⚠</span>
                      <span style={{
                        fontSize: '0.85rem',
                        color: '#dc2626',
                        fontWeight: '500'
                      }}>
                        {editFormValidation.title}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '1rem', 
                    fontWeight: '800', 
                    color: '#1e293b',
                    fontSize: '1.2rem',
                    letterSpacing: '-0.01em'
                  }}>
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={editDealForm.description}
                    onChange={(e) => setEditDealForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '1.25rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '16px',
                      fontSize: '1.1rem',
                      resize: 'vertical',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      fontWeight: '500',
                      lineHeight: '1.6'
                    }}
                    placeholder="Describe your deal requirements and expectations"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 24px rgba(0, 0, 0, 0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div style={{ maxWidth: '200px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '1rem', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Fixed Pay *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute',
                        left: '1.25rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#64748b',
                        fontWeight: '700',
                        fontSize: '1.1rem'
                      }}>
                        $
                      </span>
                      <input
                        type="number"
                        name="pay"
                        value={editDealForm.pay}
                        onChange={(e) => setEditDealForm(prev => ({ ...prev, pay: e.target.value }))}
                        required
                        min="1"
                        style={{
                          width: '100%',
                          padding: '1.25rem 1.25rem 1.25rem 3rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '16px',
                          fontSize: '1.1rem',
                          transition: 'all 0.3s ease',
                          background: 'white',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                          fontWeight: '600'
                        }}
                        placeholder="500"
                        onFocus={(e) => {
                          e.target.style.borderColor = '#3b82f6';
                          e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 24px rgba(0, 0, 0, 0.1)';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e2e8f0';
                          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '1rem', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Category *
                    </label>
                    <select
                      name="category"
                      value={editDealForm.category}
                      onChange={(e) => setEditDealForm(prev => ({ ...prev, category: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '1.25rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        background: 'white',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 1rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '3rem'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 24px rgba(0, 0, 0, 0.1)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <option value="Technology">Technology</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Health">Health</option>
                      <option value="Food">Food</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Fitness">Fitness</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '1rem', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Minimum Followers: <span style={{ color: '#3b82f6', fontWeight: '900' }}>{editDealForm.minFollowers >= 1000 ? `${editDealForm.minFollowers / 1000}K` : editDealForm.minFollowers}</span>
                    </label>
                    <div style={{ 
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      border: '2px solid #e2e8f0'
                    }}>
                      <input
                        type="range"
                        name="minFollowers"
                        min="1"
                        max="100"
                        step="1"
                        value={editDealForm.minFollowers / 1000}
                        onChange={(e) => {
                          const sliderValue = parseInt(e.target.value);
                          const newFollowers = sliderValue * 1000;
                          console.log('Slider moved:', { sliderValue, newFollowers });
                          setEditDealForm(prev => ({
                            ...prev,
                            minFollowers: newFollowers
                          }));
                        }}
                        style={{
                          width: '100%',
                          height: '8px',
                          borderRadius: '4px',
                          background: 'linear-gradient(90deg, #e2e8f0 0%, #cbd5e1 100%)',
                          outline: 'none',
                          cursor: 'pointer',
                          WebkitAppearance: 'none',
                          appearance: 'none',
                          position: 'relative',
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                        onInput={(e) => {
                          const value = e.target.value;
                          const min = e.target.min;
                          const max = e.target.max;
                          const percentage = ((value - min) / (max - min)) * 100;
                          e.target.style.background = `linear-gradient(90deg, #3b82f6 0%, #2563eb 100%) ${percentage}%, #e2e8f0 ${percentage}%, #cbd5e1 100%)`;
                        }}
                      />
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginTop: '1rem',
                        fontSize: '0.9rem',
                        color: '#64748b',
                        fontWeight: '600'
                      }}>
                        <span>1K</span>
                        <span>10K</span>
                        <span>20K</span>
                        <span>30K</span>
                        <span>40K</span>
                        <span>50K</span>
                        <span>60K</span>
                        <span>70K</span>
                        <span>80K</span>
                        <span>90K</span>
                        <span>100K</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '1rem', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Engagement Rate: <span style={{ color: '#3b82f6', fontWeight: '900' }}>{editDealForm.engagementRate}%</span>
                    </label>
                    <div style={{ 
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      border: '2px solid #e2e8f0'
                    }}>
                      <input
                        type="range"
                        name="engagementRate"
                        min="1"
                        max="10"
                        step="0.5"
                        value={editDealForm.engagementRate}
                        onChange={(e) => setEditDealForm(prev => ({
                          ...prev,
                          engagementRate: parseFloat(e.target.value)
                        }))}
                        style={{
                          width: '100%',
                          height: '8px',
                          borderRadius: '4px',
                          background: 'linear-gradient(90deg, #e2e8f0 0%, #cbd5e1 100%)',
                          outline: 'none',
                          cursor: 'pointer',
                          WebkitAppearance: 'none',
                          appearance: 'none',
                          position: 'relative',
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                        onInput={(e) => {
                          const value = e.target.value;
                          const min = e.target.min;
                          const max = e.target.max;
                          const percentage = ((value - min) / (max - min)) * 100;
                          e.target.style.background = `linear-gradient(90deg, #3b82f6 0%, #2563eb 100%) ${percentage}%, #e2e8f0 ${percentage}%, #cbd5e1 100%)`;
                        }}
                      />
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginTop: '1rem',
                        fontSize: '0.9rem',
                        color: '#64748b',
                        fontWeight: '600'
                      }}>
                        <span>1%</span>
                        <span>3%</span>
                        <span>5%</span>
                        <span>7%</span>
                        <span>10%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '1rem', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Country *
                    </label>
                    <select
                      name="country"
                      value={editDealForm.country}
                      onChange={(e) => setEditDealForm(prev => ({ ...prev, country: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '1.25rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        background: 'white',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 1rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '3rem'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 24px rgba(0, 0, 0, 0.1)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      {countryOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '1rem', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Deadline *
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={editDealForm.deadline}
                      onChange={(e) => setEditDealForm(prev => ({ ...prev, deadline: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '1.25rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        background: 'white',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        fontWeight: '600'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 24px rgba(0, 0, 0, 0.1)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '1rem', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Niche *
                    </label>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: '0.75rem',
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      borderRadius: '16px',
                      border: '2px solid #e2e8f0'
                    }}>
                      {nicheOptions.map((option) => (
                        <label key={option} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '1rem',
                          background: 'white',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: '2px solid #e2e8f0',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                          e.currentTarget.style.borderColor = '#3b82f6';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                        >
                          <input
                            type="checkbox"
                            name="niche"
                            value={option}
                            checked={editDealForm.niche.includes(option)}
                            onChange={(e) => {
                              const niche = e.target.value;
                              setEditDealForm(prev => ({
                                ...prev,
                                niche: prev.niche.includes(niche)
                                  ? prev.niche.filter(n => n !== niche)
                                  : [...prev.niche, niche]
                              }));
                            }}
                            style={{
                              width: '20px',
                              height: '20px',
                              accentColor: '#3b82f6'
                            }}
                          />
                          <span style={{ 
                            fontWeight: '600', 
                            color: '#374151'
                          }}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '1rem', 
                      fontWeight: '800', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Content Type *
                    </label>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: '0.75rem',
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      borderRadius: '16px',
                      border: '2px solid #e2e8f0'
                    }}>
                      {contentTypeOptions.map((option) => (
                        <label key={option} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '1rem',
                          background: 'white',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: '2px solid #e2e8f0',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                          e.currentTarget.style.borderColor = '#3b82f6';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                        >
                          <input
                            type="checkbox"
                            name="contentType"
                            value={option}
                            checked={editDealForm.contentType.includes(option)}
                            onChange={(e) => {
                              const contentType = e.target.value;
                              setEditDealForm(prev => ({
                                ...prev,
                                contentType: prev.contentType.includes(contentType)
                                  ? prev.contentType.filter(c => c !== contentType)
                                  : [...prev.contentType, contentType]
                              }));
                            }}
                            style={{
                              width: '20px',
                              height: '20px',
                              accentColor: '#3b82f6'
                            }}
                          />
                          <span style={{ 
                            fontWeight: '600', 
                            color: '#374151'
                          }}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '1rem', 
                    fontWeight: '800', 
                    color: '#1e293b',
                    fontSize: '1.2rem',
                    letterSpacing: '-0.01em'
                  }}>
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={editDealForm.tags}
                    onChange={(e) => setEditDealForm(prev => ({ ...prev, tags: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '1.25rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '16px',
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      fontWeight: '500'
                    }}
                    placeholder="e.g., Tech, Review, Video"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 24px rgba(0, 0, 0, 0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  />
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '1.5rem', 
                marginTop: '3rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowEditDealModal(false)}
                  className="btn-secondary"
                  style={{ 
                    minWidth: '140px',
                    padding: '1.25rem 2rem',
                    borderRadius: '16px',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                    border: '2px solid #cbd5e1',
                    color: '#2563eb',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ 
                    minWidth: '160px',
                    padding: '1.5rem 2.5rem',
                    borderRadius: '20px',
                    fontWeight: '800',
                    fontSize: '1.15rem',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
                    border: 'none',
                    color: 'white',
                    boxShadow: '0 12px 32px rgba(59, 130, 246, 0.4), 0 4px 16px rgba(59, 130, 246, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    letterSpacing: '-0.01em'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-4px) scale(1.02)';
                    e.target.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.5), 0 8px 24px rgba(59, 130, 246, 0.3)';
                    e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.4), 0 4px 16px rgba(59, 130, 246, 0.2)';
                    e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)';
                  }}
                  onMouseDown={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(0.98)';
                  }}
                  onMouseUp={(e) => {
                    e.target.style.transform = 'translateY(-4px) scale(1.02)';
                  }}
                >
                  Update Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Deal Details Modal */}
      {showDealDetailsModal && selectedDeal && (
        <div className="modal-overlay" onClick={() => setShowDealDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Deal Details</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowDealDetailsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="deal-details">
                <div className="deal-brand-info">
                  <span className="brand-logo">{selectedDeal.brandLogo}</span>
                  <div>
                    <h3>{selectedDeal.brand}</h3>
                    <span className="category">{selectedDeal.category}</span>
                  </div>
                </div>
                
                <div className="deal-main-info">
                  <h2>{selectedDeal.title}</h2>
                  <p className="deal-description">{selectedDeal.description}</p>
                  
                  <div className="deal-metrics-detailed">
                    <div className="metric-item">
                      <span className="metric-label">Pay:</span>
                      <span className="metric-value">{selectedDeal.pay}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Engagement Rate:</span>
                      <span className="metric-value">{selectedDeal.engagement}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Reach:</span>
                      <span className="metric-value">{selectedDeal.reach}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Deadline:</span>
                      <span className="metric-value">{selectedDeal.deadline}</span>
                    </div>
                  </div>
                  
                  <div className="deal-requirements-detailed">
                    <h4>Requirements:</h4>
                    <ul>
                      {selectedDeal.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="deal-tags-detailed">
                    <h4>Tags:</h4>
                    <div className="tags-container">
                      {selectedDeal.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="deal-status-info">
                    <span className={`status-badge ${selectedDeal.status}`}>
                      {selectedDeal.status}
                    </span>
                    {selectedDeal.takenBy && (
                      <span className="taken-by">Taken by: {selectedDeal.takenBy}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setShowDealDetailsModal(false)}
              >
                Close
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  createNotification(`Deal "${selectedDeal.title}" taken successfully!`, 'success');
                  setShowDealDetailsModal(false);
                }}
              >
                Take Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace; 