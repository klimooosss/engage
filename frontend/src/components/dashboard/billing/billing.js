import React, { useState, useCallback } from 'react';
import './billing.css';

// Reusable Icon Component
const Icon = ({ path, className = '' }) => (
  <svg className={`icon ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d={path} />
  </svg>
);

// Mock Data
const initialBillingData = {
  currentPlan: {
    name: 'Pro Creator',
    price: 49,
    period: 'monthly',
    features: ['Up to 10 Brand Collaborations', 'Advanced Analytics', 'Priority Support', 'Custom Profile Branding', 'Access to Exclusive Deals'],
    nextBillDate: '2024-08-15',
    daysLeft: 20,
  },
  paymentMethods: [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '5555', expiry: '08/25', isDefault: false },
    { id: 3, type: 'PayPal', email: 'alex.j@example.com', isDefault: false },
  ],
  billingHistory: [
    { id: 'inv-001', date: '2024-07-15', amount: 49.00, status: 'Paid', plan: 'Pro Creator' },
    { id: 'inv-002', date: '2024-06-15', amount: 49.00, status: 'Paid', plan: 'Pro Creator' },
    { id: 'inv-003', date: '2024-05-15', amount: 29.00, status: 'Paid', plan: 'Starter' },
    { id: 'inv-004', date: '2024-04-15', amount: 29.00, status: 'Paid', plan: 'Starter' },
  ],
  availablePlans: [
    { name: 'Starter', price: 29, period: 'monthly', features: ['Up to 3 Brand Collaborations', 'Basic Analytics', 'Standard Support'] },
    { name: 'Pro Creator', price: 49, period: 'monthly', features: ['Up to 10 Brand Collaborations', 'Advanced Analytics', 'Priority Support', 'Custom Profile Branding', 'Access to Exclusive Deals'] },
    { name: 'Agency', price: 149, period: 'monthly', features: ['Unlimited Collaborations', 'Team Management Tools', 'Dedicated Account Manager', 'API Access', 'White-labeling Options'] },
  ],
};

const Billing = () => {
  const [billingData, setBillingData] = useState(initialBillingData);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isLoading, setIsLoading] = useState({});

  const handleSetDefault = useCallback((id) => {
    setBillingData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(pm => ({ ...pm, isDefault: pm.id === id })),
    }));
  }, []);

  const handleRemovePaymentMethod = useCallback((id) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      setBillingData(prev => ({
        ...prev,
        paymentMethods: prev.paymentMethods.filter(pm => pm.id !== id),
      }));
    }
  }, []);
  
  const handleChangePlan = useCallback((planName) => {
    setIsLoading({ plan: planName });
    setTimeout(() => {
      const newPlan = billingData.availablePlans.find(p => p.name === planName);
      if (newPlan) {
        setBillingData(prev => ({
          ...prev,
          currentPlan: {
            ...newPlan,
            nextBillDate: '2024-08-15', // Reset billing date on plan change
            daysLeft: 20,
          }
        }));
      }
      setIsChangingPlan(false);
      setIsLoading({});
    }, 1500);
  }, [billingData.availablePlans]);

  const handleDownloadInvoice = useCallback((invoiceId) => {
    setIsLoading({ invoice: invoiceId });
    setTimeout(() => {
      alert(`Downloading invoice ${invoiceId}...`);
      setIsLoading({});
    }, 1000);
  }, []);

  return (
    <div className="billing-section">
      <div className="billing-header">
        <div className="billing-title">
          <h2>Billing & Subscriptions</h2>
          <p>Manage your payment methods, subscription plan, and view your billing history.</p>
        </div>
        <button className="billing-btn primary" onClick={() => setIsChangingPlan(true)}>
          Change Plan
        </button>
      </div>

      <div className="billing-grid">
        <div className="billing-left">
          <CurrentPlanCard plan={billingData.currentPlan} />
          <PaymentMethods
            methods={billingData.paymentMethods}
            onSetDefault={handleSetDefault}
            onRemove={handleRemovePaymentMethod}
          />
        </div>
        <div className="billing-right">
          <BillingHistory
            history={billingData.billingHistory}
            onDownload={handleDownloadInvoice}
            loadingInvoice={isLoading.invoice}
          />
        </div>
      </div>

      {isChangingPlan && (
        <PlanChangeModal
          plans={billingData.availablePlans}
          currentPlanName={billingData.currentPlan.name}
          onClose={() => setIsChangingPlan(false)}
          onChangePlan={handleChangePlan}
          loadingPlan={isLoading.plan}
        />
      )}
    </div>
  );
};

// Sub-components for better organization

const CurrentPlanCard = ({ plan }) => (
  <div className="billing-card current-plan">
    <div className="card-header">
      <h4>Current Plan</h4>
      <span className="plan-name">{plan.name}</span>
    </div>
    <div className="card-body">
      <div className="plan-price">
        <span className="price">${plan.price}</span>
        <span className="period">/ {plan.period}</span>
      </div>
      <p className="next-bill">Next bill on {plan.nextBillDate} ({plan.daysLeft} days left)</p>
      <div className="plan-features">
        <h5>Includes:</h5>
        <ul>
          {plan.features.map((feature, index) => (
            <li key={index}><Icon path="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /> {feature}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const PaymentMethods = ({ methods, onSetDefault, onRemove }) => (
  <div className="billing-card payment-methods">
    <div className="card-header">
      <h4>Payment Methods</h4>
      <button className="billing-btn text-btn">+ Add Method</button>
    </div>
    <div className="card-body">
      {methods.map(method => (
        <div key={method.id} className="payment-method-item">
          <div className="pm-info">
            <span className="pm-icon">{method.type === 'PayPal' ? '🅿️' : '💳'}</span>
            <div className="pm-details">
              <strong>{method.type}</strong> {method.email ? `(${method.email})` : `ending in ${method.last4}`}
              {method.isDefault && <span className="default-badge">Default</span>}
            </div>
          </div>
          <div className="pm-actions">
            {!method.isDefault && <button className="billing-btn text-btn" onClick={() => onSetDefault(method.id)}>Set as Default</button>}
            <button className="billing-btn text-btn danger" onClick={() => onRemove(method.id)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BillingHistory = ({ history, onDownload, loadingInvoice }) => (
  <div className="billing-card billing-history">
    <div className="card-header">
      <h4>Billing History</h4>
    </div>
    <div className="card-body">
      <div className="history-table">
        <div className="history-table-header">
          <span>Invoice</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {history.map(item => (
          <div key={item.id} className="history-table-row">
            <strong>{item.id}</strong>
            <span>{item.date}</span>
            <span>${item.amount.toFixed(2)}</span>
            <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
            <button
              className={`billing-btn text-btn download-btn ${loadingInvoice === item.id ? 'loading' : ''}`}
              onClick={() => onDownload(item.id)}
              disabled={loadingInvoice === item.id}
            >
              <Icon path="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
              {loadingInvoice === item.id ? '...' : ''}
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PlanChangeModal = ({ plans, currentPlanName, onClose, onChangePlan, loadingPlan }) => (
  <div className="billing-modal-overlay" onClick={onClose}>
    <div className="billing-modal-content" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Change Subscription Plan</h3>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
      </div>
      <div className="modal-body">
        <div className="plans-container">
          {plans.map(plan => (
            <div key={plan.name} className={`plan-card ${plan.name === currentPlanName ? 'current' : ''}`}>
              <h4>{plan.name}</h4>
              <div className="plan-price">
                <span className="price">${plan.price}</span>
                <span className="period">/ {plan.period}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index}><Icon path="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /> {feature}</li>
                ))}
              </ul>
              <button
                className={`billing-btn primary full-width ${loadingPlan === plan.name ? 'loading' : ''}`}
                onClick={() => onChangePlan(plan.name)}
                disabled={loadingPlan || plan.name === currentPlanName}
              >
                {loadingPlan === plan.name ? 'Switching...' : (plan.name === currentPlanName ? 'Current Plan' : 'Switch to ' + plan.name)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Billing; 