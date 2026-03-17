import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useSubscription } from '../context/SubscriptionContext';
import Footer from '../Footer';
import './AccountPage.css';

const MENU_ITEMS = [
  { id: 'overview', label: 'Profile Overview', icon: 'PO' },
  { id: 'orders', label: 'My Orders', icon: 'MO' },
  { id: 'designs', label: 'Saved Designs', icon: 'SD' },
  { id: 'size', label: 'Size Preferences', icon: 'SP' },
  { id: 'settings', label: 'Account Settings', icon: 'AS' },
];

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, signOut } = useUser();
  const { tier } = useSubscription();
  const [activeSection, setActiveSection] = useState('overview');
  const [showSignOutNotice, setShowSignOutNotice] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const profile = useMemo(() => ({
    name: user?.name || user?.full_name || user?.fullName || 'Alex Carter',
    email: user?.email || 'alex.carter@email.com',
    memberSince: 'March 2026',
    profilePhoto: user?.profilePhoto || '',
  }), [user]);

  const profileInitials = useMemo(() => (
    (profile.name || 'Alex Carter')
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  ), [profile.name]);

  // Real orders/design integrations are not implemented yet, so default to empty.
  const orders = [];
  const savedDesigns = [];

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    const section = document.getElementById(`account-${sectionId}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSignOut = () => {
    setShowSignOutNotice(false);
    signOut();
    navigate('/signin');
  };

  return (
    <div className="account-page">
      <div className="account-shell">
        <aside className="account-sidebar">
          <div className="account-sidebar__header">
            <p className="account-sidebar__eyebrow">SNEAKR.LAB</p>
            <h2>My Account</h2>
          </div>

          <nav className="account-sidebar__menu" aria-label="Account sections">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`account-menu-item${activeSection === item.id ? ' is-active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
              >
                <span className="account-menu-item__icon" aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="account-signout"
            onClick={() => setShowSignOutNotice(true)}
          >
            <span className="account-menu-item__icon" aria-hidden="true">SO</span>
            <span>Sign Out</span>
          </button>
        </aside>

        <main className="account-main">
          <section id="account-overview" className="account-section">
            <h1>Profile / Account</h1>
            <div className="account-card account-overview-card">
              <div className="account-avatar" aria-hidden="true">
                {profile.profilePhoto ? (
                  <img src={profile.profilePhoto} alt="Profile" className="account-avatar__image" />
                ) : (
                  profileInitials
                )}
              </div>
              <div className="account-overview-info">
                <p><span>Name:</span> {profile.name}</p>
                <p><span>Email:</span> {profile.email}</p>
                <p><span>Member Since:</span> {profile.memberSince}</p>
              </div>
              <button
                type="button"
                className="account-btn account-btn--ghost"
                onClick={() => navigate('/account/edit-profile')}
              >
                Edit Profile
              </button>
            </div>
          </section>

          <section id="account-orders" className="account-section">
            <div className="account-section__head">
              <h2>My Orders</h2>
              <button type="button" className="account-btn">View All Orders</button>
            </div>
            {orders.length === 0 ? (
              <div className="account-card account-empty-state">
                <p>No orders yet. Completed purchases will appear here.</p>
              </div>
            ) : (
              <div className="account-order-grid">
                {orders.map((order) => (
                  <article className="account-card account-order-card" key={order.orderId}>
                    <h3>{order.title}</h3>
                    <p>Order ID: {order.orderId}</p>
                    <p>
                      Status: <strong>{order.status}</strong>
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section id="account-designs" className="account-section">
            <div className="account-section__head">
              <h2>Saved Designs</h2>
            </div>
            {savedDesigns.length === 0 ? (
              <div className="account-card account-empty-state">
                <p>No saved designs yet. Your completed or saved custom pairs will appear here.</p>
              </div>
            ) : (
              <div className="account-design-grid">
                {savedDesigns.map((design) => (
                  <article className="account-card account-design-card" key={design.id}>
                    <img src={design.image} alt={`${design.name} preview`} />
                    <h3>{design.name}</h3>
                    <button type="button" className="account-btn account-btn--ghost">Continue Editing</button>
                  </article>
                ))}
              </div>
            )}
            <button
              type="button"
              className="account-btn account-btn--create"
              onClick={() => navigate('/choose-shoe')}
            >
              Create New Design
            </button>
          </section>

          <section id="account-size" className="account-section">
            <h2>Size Preferences</h2>
            <div className="account-card account-size-card">
              <p><span>Preferred Size:</span> US 9</p>
              <p><span>Width:</span> Regular</p>
              <button type="button" className="account-btn">Update Size</button>
            </div>
          </section>

          <section className="account-section">
            <h2>Premium Membership</h2>
            <div className="account-card account-premium-card">
              <p>
                {tier === 'premium'
                  ? 'Your Premium membership is active. Enjoy advanced customization and priority production.'
                  : 'You are currently on a free plan. Upgrade to unlock advanced features and faster production.'}
              </p>
              {tier !== 'premium' && (
                <button
                  type="button"
                  className="account-btn"
                  onClick={() => navigate('/subscription')}
                >
                  Upgrade Now
                </button>
              )}
            </div>
          </section>

          <section id="account-settings" className="account-section">
            <h2>Account Settings</h2>
            <div className="account-card account-settings-card">
              <button type="button" className="account-setting-item">Change Email</button>
              <button type="button" className="account-setting-item">Change Password</button>
              <button type="button" className="account-setting-item">Notification Preferences</button>
              <button type="button" className="account-setting-item account-setting-item--danger">Delete Account</button>
            </div>
          </section>

          <section className="account-cta">
            <h2>Ready to design your next pair?</h2>
            <p>Start creating your own custom sneakers using our design studio.</p>
            <button type="button" className="account-btn account-btn--primary" onClick={() => navigate('/choose-shoe')}>
              Start Designing
            </button>
          </section>
        </main>
      </div>

      {showSignOutNotice && (
        <div className="account-signout-modal-overlay" role="presentation" onClick={() => setShowSignOutNotice(false)}>
          <div
            className="account-signout-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Sign out confirmation"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>Sign out now?</h3>
            <p>You will be logged out of your account on this device.</p>
            <div className="account-signout-modal__actions">
              <button
                type="button"
                className="account-btn account-btn--ghost"
                onClick={() => setShowSignOutNotice(false)}
              >
                Cancel
              </button>
              <button type="button" className="account-btn" onClick={handleSignOut}>
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
