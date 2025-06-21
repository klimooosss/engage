import React, { useState } from 'react';
import './payout.css';

const Payout = ({ user, userRole }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [showRequestPayout, setShowRequestPayout] = useState(false);
  const [autoPayout, setAutoPayout] = useState(true);
  const [payoutSchedule, setPayoutSchedule] = useState('weekly');
  const [minimumAmount, setMinimumAmount] = useState(100);
  
  // Add payment method modal state
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [newMethodType, setNewMethodType] = useState('');
  const [newMethodEmail, setNewMethodEmail] = useState('');
  const [newMethodAccount, setNewMethodAccount] = useState('');
  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodPhone, setNewMethodPhone] = useState('');
  
  // Edit payment method modal state
  const [showEditMethodModal, setShowEditMethodModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [editMethodType, setEditMethodType] = useState('');
  const [editMethodEmail, setEditMethodEmail] = useState('');
  const [editMethodAccount, setEditMethodAccount] = useState('');
  const [editMethodName, setEditMethodName] = useState('');
  const [editMethodPhone, setEditMethodPhone] = useState('');
  
  const [payoutMethods, setPayoutMethods] = useState([
    { id: 1, type: 'PayPal', email: 'user@paypal.com', isDefault: true, status: 'active' },
    { id: 2, type: 'Bank Transfer', account: '****1234', isDefault: false, status: 'active' },
    { id: 3, type: 'Stripe', email: 'user@stripe.com', isDefault: false, status: 'pending' }
  ]);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'payout',
      amount: 2500,
      status: 'completed',
      date: '2024-01-15',
      method: 'PayPal',
      description: 'Monthly payout',
      reference: 'PAY-2024-001'
    },
    {
      id: 2,
      type: 'earning',
      amount: 1800,
      status: 'pending',
      date: '2024-01-20',
      method: 'Deal completion',
      description: 'Tech Review Campaign',
      reference: 'DEAL-2024-002'
    },
    {
      id: 3,
      type: 'payout',
      amount: 3200,
      status: 'processing',
      date: '2024-01-25',
      method: 'Bank Transfer',
      description: 'Weekly payout',
      reference: 'PAY-2024-003'
    },
    {
      id: 4,
      type: 'earning',
      amount: 950,
      status: 'completed',
      date: '2024-01-28',
      method: 'Deal completion',
      description: 'Fashion Campaign',
      reference: 'DEAL-2024-004'
    },
    {
      id: 5,
      type: 'payout',
      amount: 1500,
      status: 'failed',
      date: '2024-01-30',
      method: 'PayPal',
      description: 'Failed payout attempt',
      reference: 'PAY-2024-005'
    }
  ]);
  const [pendingAmount, setPendingAmount] = useState(3250);
  const [totalEarnings, setTotalEarnings] = useState(15750);

  // Payment method options
  const paymentMethodOptions = [
    { value: 'PayPal', label: 'PayPal', icon: '💳', requiresEmail: true },
    { value: 'Bank Transfer', label: 'Bank Transfer', icon: '🏦', requiresAccount: true },
    { value: 'Stripe', label: 'Stripe', icon: '💳', requiresEmail: true },
    { value: 'Venmo', label: 'Venmo', icon: '📱', requiresPhone: true },
    { value: 'Cash App', label: 'Cash App', icon: '💵', requiresPhone: true },
    { value: 'Apple Pay', label: 'Apple Pay', icon: '🍎', requiresEmail: true },
    { value: 'Google Pay', label: 'Google Pay', icon: '🤖', requiresEmail: true },
    { value: 'Credit Card', label: 'Credit Card', icon: '💳', requiresName: true, requiresAccount: true }
  ];

  // Mock data for payouts
  const payoutData = {
    totalEarnings: totalEarnings,
    pendingAmount: pendingAmount,
    thisMonth: 4200,
    lastMonth: 3800,
    payoutMethods: payoutMethods,
    transactions: transactions
  };

  // Button handlers
  const handleRequestPayout = () => {
    if (pendingAmount > 0) {
      setShowRequestPayout(true);
      setTimeout(() => {
        // Add new transaction for the payout
        const newPayoutTransaction = {
          id: transactions.length + 1,
          type: 'payout',
          amount: pendingAmount,
          status: 'processing',
          date: new Date().toISOString().split('T')[0],
          method: payoutMethods.find(m => m.isDefault)?.type || 'PayPal',
          description: 'Manual payout request',
          reference: `PAY-${new Date().getFullYear()}-${String(transactions.length + 1).padStart(3, '0')}`
        };
        
        setTransactions(prev => [newPayoutTransaction, ...prev]);
        setPendingAmount(0);
        setShowRequestPayout(false);
      }, 1000);
    }
  };

  const handleAddPaymentMethod = () => {
    setShowAddMethodModal(true);
  };

  const handleSubmitPaymentMethod = () => {
    if (!newMethodType) {
      alert('Please select a payment method type');
      return;
    }

    const selectedOption = paymentMethodOptions.find(option => option.value === newMethodType);
    
    // Validate required fields
    if (selectedOption.requiresEmail && !newMethodEmail) {
      alert('Please enter your email address');
      return;
    }
    if (selectedOption.requiresAccount && !newMethodAccount) {
      alert('Please enter your account number');
      return;
    }
    if (selectedOption.requiresPhone && !newMethodPhone) {
      alert('Please enter your phone number');
      return;
    }
    if (selectedOption.requiresName && !newMethodName) {
      alert('Please enter your full name');
      return;
    }

    // Create new payment method
    const newMethod = {
      id: payoutMethods.length + 1,
      type: newMethodType,
      email: newMethodEmail,
      account: newMethodAccount,
      name: newMethodName,
      phone: newMethodPhone,
      isDefault: false,
      status: 'active'
    };
    
    setPayoutMethods(prev => [...prev, newMethod]);
    
    // Reset form
    setNewMethodType('');
    setNewMethodEmail('');
    setNewMethodAccount('');
    setNewMethodName('');
    setNewMethodPhone('');
    setShowAddMethodModal(false);
  };

  const handleCancelAddMethod = () => {
    setNewMethodType('');
    setNewMethodEmail('');
    setNewMethodAccount('');
    setNewMethodName('');
    setNewMethodPhone('');
    setShowAddMethodModal(false);
  };

  const handleEditMethod = (methodId) => {
    const method = payoutMethods.find(m => m.id === methodId);
    if (method) {
      setEditingMethod(method);
      setEditMethodType(method.type);
      setEditMethodEmail(method.email || '');
      setEditMethodAccount(method.account || '');
      setEditMethodName(method.name || '');
      setEditMethodPhone(method.phone || '');
      setShowEditMethodModal(true);
    }
  };

  const handleSubmitEditMethod = () => {
    if (!editMethodType) {
      alert('Please select a payment method type');
      return;
    }

    const selectedOption = paymentMethodOptions.find(option => option.value === editMethodType);
    
    // Validate required fields
    if (selectedOption.requiresEmail && !editMethodEmail) {
      alert('Please enter your email address');
      return;
    }
    if (selectedOption.requiresAccount && !editMethodAccount) {
      alert('Please enter your account number');
      return;
    }
    if (selectedOption.requiresPhone && !editMethodPhone) {
      alert('Please enter your phone number');
      return;
    }
    if (selectedOption.requiresName && !editMethodName) {
      alert('Please enter your full name');
      return;
    }

    // Update the payment method
    setPayoutMethods(prev => 
      prev.map(method => 
        method.id === editingMethod.id 
          ? {
              ...method,
              type: editMethodType,
              email: editMethodEmail,
              account: editMethodAccount,
              name: editMethodName,
              phone: editMethodPhone
            }
          : method
      )
    );
    
    // Reset form and close modal
    setEditingMethod(null);
    setEditMethodType('');
    setEditMethodEmail('');
    setEditMethodAccount('');
    setEditMethodName('');
    setEditMethodPhone('');
    setShowEditMethodModal(false);
  };

  const handleCancelEditMethod = () => {
    setEditingMethod(null);
    setEditMethodType('');
    setEditMethodEmail('');
    setEditMethodAccount('');
    setEditMethodName('');
    setEditMethodPhone('');
    setShowEditMethodModal(false);
  };

  const handleRemoveMethod = (methodId) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      setPayoutMethods(prev => prev.filter(method => method.id !== methodId));
      
      // If we removed the default method, set the first remaining method as default
      const remainingMethods = payoutMethods.filter(method => method.id !== methodId);
      if (remainingMethods.length > 0 && !remainingMethods.some(m => m.isDefault)) {
        setPayoutMethods(prev => 
          prev.filter(method => method.id !== methodId).map((method, index) => 
            index === 0 ? { ...method, isDefault: true } : method
          )
        );
      }
    }
  };

  const handleSetDefault = (methodId) => {
    setPayoutMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    );
  };

  const handleViewAllTransactions = () => {
    // Simulate viewing all transactions by expanding the list with more realistic data
    const additionalTransactions = [
      {
        id: transactions.length + 1,
        type: 'earning',
        amount: 1200,
        status: 'completed',
        date: '2024-01-10',
        method: 'Deal completion',
        description: 'Tech Gadget Review',
        reference: 'DEAL-2024-006'
      },
      {
        id: transactions.length + 2,
        type: 'payout',
        amount: 800,
        status: 'completed',
        date: '2024-01-05',
        method: 'Bank Transfer',
        description: 'Weekly payout',
        reference: 'PAY-2024-007'
      },
      {
        id: transactions.length + 3,
        type: 'earning',
        amount: 2100,
        status: 'completed',
        date: '2024-01-03',
        method: 'Deal completion',
        description: 'Fitness App Promotion',
        reference: 'DEAL-2024-008'
      },
      {
        id: transactions.length + 4,
        type: 'payout',
        amount: 1500,
        status: 'failed',
        date: '2024-01-01',
        method: 'PayPal',
        description: 'Failed payout - insufficient funds',
        reference: 'PAY-2024-009'
      }
    ];
    
    setTransactions(prev => [...prev, ...additionalTransactions]);
  };

  const handleUpdateTaxInfo = () => {
    // Simulate updating tax info by changing multiple settings
    setMinimumAmount(prev => prev + 50);
    setPayoutSchedule('monthly'); // Change to monthly for tax purposes
  };

  const handleToggleAutoPayout = () => {
    setAutoPayout(!autoPayout);
  };

  const handlePayoutScheduleChange = (schedule) => {
    setPayoutSchedule(schedule);
  };

  const handleMinimumAmountChange = (amount) => {
    setMinimumAmount(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'failed': return 'error';
      default: return 'neutral';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'failed': return '❌';
      default: return '📋';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedStatus !== 'all' && transaction.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const selectedOption = paymentMethodOptions.find(option => option.value === newMethodType);
  const editSelectedOption = paymentMethodOptions.find(option => option.value === editMethodType);

  return (
    <div className="payout-dashboard">
      {/* Add Payment Method Modal */}
      {showAddMethodModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Payment Method</h3>
              <button className="modal-close" onClick={handleCancelAddMethod}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Payment Method Type</label>
                <select 
                  value={newMethodType}
                  onChange={(e) => setNewMethodType(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select a payment method</option>
                  {paymentMethodOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {selectedOption?.requiresName && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={newMethodName}
                    onChange={(e) => setNewMethodName(e.target.value)}
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>
              )}

              {selectedOption?.requiresEmail && (
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={newMethodEmail}
                    onChange={(e) => setNewMethodEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="form-input"
                  />
                </div>
              )}

              {selectedOption?.requiresAccount && (
                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    value={newMethodAccount}
                    onChange={(e) => setNewMethodAccount(e.target.value)}
                    placeholder="Enter your account number"
                    className="form-input"
                  />
                </div>
              )}

              {selectedOption?.requiresPhone && (
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={newMethodPhone}
                    onChange={(e) => setNewMethodPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="form-input"
                  />
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={handleCancelAddMethod}>
                Cancel
              </button>
              <button className="modal-btn primary" onClick={handleSubmitPaymentMethod}>
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payment Method Modal */}
      {showEditMethodModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Payment Method</h3>
              <button className="modal-close" onClick={handleCancelEditMethod}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Payment Method Type</label>
                <select 
                  value={editMethodType}
                  onChange={(e) => setEditMethodType(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select a payment method</option>
                  {paymentMethodOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {editSelectedOption?.requiresName && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editMethodName}
                    onChange={(e) => setEditMethodName(e.target.value)}
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>
              )}

              {editSelectedOption?.requiresEmail && (
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={editMethodEmail}
                    onChange={(e) => setEditMethodEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="form-input"
                  />
                </div>
              )}

              {editSelectedOption?.requiresAccount && (
                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    value={editMethodAccount}
                    onChange={(e) => setEditMethodAccount(e.target.value)}
                    placeholder="Enter your account number"
                    className="form-input"
                  />
                </div>
              )}

              {editSelectedOption?.requiresPhone && (
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={editMethodPhone}
                    onChange={(e) => setEditMethodPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="form-input"
                  />
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={handleCancelEditMethod}>
                Cancel
              </button>
              <button className="modal-btn primary" onClick={handleSubmitEditMethod}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="payout-header">
        <div className="payout-welcome">
          <h2>Payouts & Earnings</h2>
          <p>Track your earnings, manage payouts, and view transaction history</p>
        </div>
        <div className="payout-actions">
          <button 
            className={`payout-btn primary ${showRequestPayout ? 'loading' : ''}`}
            onClick={handleRequestPayout}
            disabled={showRequestPayout || pendingAmount === 0}
          >
            {showRequestPayout ? 'Processing...' : 'Request Payout'}
          </button>
          <button 
            className={`payout-btn secondary ${showAddMethod ? 'loading' : ''}`}
            onClick={handleAddPaymentMethod}
            disabled={showAddMethod}
          >
            {showAddMethod ? 'Adding...' : 'Add Payment Method'}
          </button>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="earnings-overview">
        <div className="earnings-card primary">
          <div className="earnings-icon">💰</div>
          <div className="earnings-info">
            <h3>Total Earnings</h3>
            <div className="earnings-amount">{formatCurrency(totalEarnings)}</div>
            <div className="earnings-trend positive">+12.5% this month</div>
          </div>
        </div>
        
        <div className="earnings-card">
          <div className="earnings-icon">⏳</div>
          <div className="earnings-info">
            <h3>Pending Amount</h3>
            <div className="earnings-amount">{formatCurrency(pendingAmount)}</div>
            <div className="earnings-trend neutral">Available for payout</div>
          </div>
        </div>
        
        <div className="earnings-card">
          <div className="earnings-icon">📈</div>
          <div className="earnings-info">
            <h3>This Month</h3>
            <div className="earnings-amount">{formatCurrency(payoutData.thisMonth)}</div>
            <div className="earnings-trend positive">+10.5% vs last month</div>
          </div>
        </div>
        
        <div className="earnings-card">
          <div className="earnings-icon">📊</div>
          <div className="earnings-info">
            <h3>Last Month</h3>
            <div className="earnings-amount">{formatCurrency(payoutData.lastMonth)}</div>
            <div className="earnings-trend neutral">Previous period</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="payout-grid">
        {/* Transaction History */}
        <div className="payout-card transaction-history">
          <div className="card-header">
            <h3>Transaction History</h3>
            <div className="card-actions">
              <select 
                className="filter-select"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <select 
                className="filter-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          
          <div className="transaction-list">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                <div className="transaction-icon">
                  {transaction.type === 'payout' ? '💸' : '💰'}
                </div>
                <div className="transaction-details">
                  <div className="transaction-header">
                    <h4>{transaction.description}</h4>
                    <span className={`transaction-status ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)} {transaction.status}
                    </span>
                  </div>
                  <div className="transaction-meta">
                    <span className="transaction-method">{transaction.method}</span>
                    <span className="transaction-date">{formatDate(transaction.date)}</span>
                    <span className="transaction-reference">#{transaction.reference}</span>
                  </div>
                </div>
                <div className="transaction-amount">
                  <span className={`amount ${transaction.type}`}>
                    {transaction.type === 'payout' ? '-' : '+'}{formatCurrency(transaction.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="card-footer">
            <button className="view-all-btn" onClick={handleViewAllTransactions}>
              View All Transactions
            </button>
          </div>
        </div>

        {/* Payout Methods */}
        <div className="payout-card payment-methods">
          <div className="card-header">
            <h3>Payment Methods</h3>
            <button className="add-method-btn" onClick={handleAddPaymentMethod}>
              + Add New
            </button>
          </div>
          
          <div className="methods-list">
            {payoutMethods.map((method) => (
              <div key={method.id} className={`method-item ${method.status}`}>
                <div className="method-icon">
                  {method.type === 'PayPal' ? '💳' : method.type === 'Bank Transfer' ? '🏦' : '💳'}
                </div>
                <div className="method-details">
                  <div className="method-header">
                    <h4>{method.type}</h4>
                    {method.isDefault && <span className="default-badge">Default</span>}
                  </div>
                  <p className="method-info">
                    {method.type === 'PayPal' || method.type === 'Stripe' 
                      ? method.email 
                      : `Account ending in ${method.account}`
                    }
                  </p>
                  <span className={`method-status ${method.status}`}>
                    {method.status === 'active' ? '✅ Active' : '⏳ Pending Verification'}
                  </span>
                </div>
                <div className="method-actions">
                  <button className="method-btn" onClick={() => handleEditMethod(method.id)}>
                    Edit
                  </button>
                  {!method.isDefault && (
                    <button className="method-btn danger" onClick={() => handleRemoveMethod(method.id)}>
                      Remove
                    </button>
                  )}
                  {!method.isDefault && method.status === 'active' && (
                    <button className="method-btn primary" onClick={() => handleSetDefault(method.id)}>
                      Set Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Settings */}
        <div className="payout-card payout-settings">
          <div className="card-header">
            <h3>Payout Settings</h3>
          </div>
          
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Auto Payout</h4>
                <p>Automatically pay out earnings when they reach the minimum threshold</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={autoPayout}
                  onChange={handleToggleAutoPayout}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Minimum Payout Amount</h4>
                <p>Set the minimum amount before automatic payouts are processed</p>
              </div>
              <div className="setting-value">
                <input
                  type="number"
                  className="amount-input"
                  value={minimumAmount}
                  onChange={(e) => handleMinimumAmountChange(parseInt(e.target.value) || 0)}
                  min="10"
                  max="10000"
                />
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Payout Schedule</h4>
                <p>Choose how often you want to receive payouts</p>
              </div>
              <select 
                className="setting-select"
                value={payoutSchedule}
                onChange={(e) => handlePayoutScheduleChange(e.target.value)}
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Tax Information</h4>
                <p>Manage your tax settings and documentation</p>
              </div>
              <button className="setting-btn" onClick={handleUpdateTaxInfo}>
                Update Tax Info
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="payout-card quick-stats">
          <div className="card-header">
            <h3>Quick Stats</h3>
          </div>
          
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <span className="stat-value">{transactions.filter(t => t.type === 'payout').length}</span>
                <span className="stat-label">Payouts This Year</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <span className="stat-value">2.3</span>
                <span className="stat-label">Avg. Processing Time (days)</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <span className="stat-value">98%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-value">{formatCurrency(Math.round(totalEarnings / 6))}</span>
                <span className="stat-label">Avg. Monthly Earnings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payout; 