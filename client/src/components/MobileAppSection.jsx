import React from 'react';
import { useModal } from '../context/ModalContext';

export default function MobileAppSection({ isPage = false }) {
  const { setIsAppModalOpen, showToast } = useModal();

  const HeadingTag = isPage ? 'h1' : 'h2';

  return (
    <section className="mobile-app-page" id="app">
      {/* Background Ambient Glows */}
      <div className="ma-bg-glow glow-pink-top"></div>
      <div className="ma-bg-glow glow-blue-right"></div>
      <div className="ma-bg-glow glow-cyan-left"></div>

      <div className="ma-container">
        {/* Header Section */}
        <div className="ma-header">
          <HeadingTag className="ma-main-title">
            <span className="title-pink">WOMUP </span>
            <span className="title-dark">Mobile App</span>
          </HeadingTag>
          <p className="ma-subtitle">Your Smart Shopping &amp; Earning Companion</p>
        </div>

        {/* Main Hero Grid: Dual Phone Mockup (Left) & Features List (Right) */}
        <div className="ma-hero-grid">
          {/* Left Column: Perspective Dual iPhone Mockup */}
          <div className="ma-mockup-wrapper">
            {/* Bottom Left Decorative Fresh Leaves Accent */}
            <div className="leaf-accent">
              <svg viewBox="0 0 120 120" fill="none" className="leaf-svg">
                <path d="M10 110C10 60 45 20 110 10C105 60 70 105 10 110Z" fill="url(#leafGrad1Idx)" opacity="0.9" />
                <path d="M10 110C35 85 75 55 110 10" stroke="#86efac" strokeWidth="2" opacity="0.6" />
                <path d="M5 85C5 45 35 15 85 5C80 45 55 80 5 85Z" fill="url(#leafGrad2Idx)" opacity="0.75" />
                <defs>
                  <linearGradient id="leafGrad1Idx" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#15803d" />
                    <stop offset="60%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#86efac" />
                  </linearGradient>
                  <linearGradient id="leafGrad2Idx" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#166534" />
                    <stop offset="100%" stopColor="#4ade80" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Phone 1 (Back Left: Splash & Login Screen) */}
            <div className="phone-device phone-splash">
              <div className="phone-outer-frame">
                <div className="phone-speaker-notch"></div>
                <div className="phone-screen-content splash-screen">
                  {/* Status Bar */}
                  <div className="phone-status-bar">
                    <span className="bar-time">4:21</span>
                    <div className="bar-icons">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.22 19.58 10.57 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/></svg>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z"/></svg>
                      <div className="battery-pill"><div className="battery-fill"></div></div>
                    </div>
                  </div>

                  {/* Wave Background Decoration */}
                  <div className="splash-waves">
                    <div className="wave wave-top"></div>
                    <div className="wave wave-bottom"></div>
                  </div>

                  {/* Center Branding */}
                  <div className="splash-center">
                    <div className="splash-logo-box">
                      <img src="/assets/new-logo.png" alt="WOMUP" style={{ width: '88px', height: 'auto', marginBottom: '4px' }} />
                    </div>
                    <p className="splash-tagline">Empowerment &bull; Shopping &bull; Revolution</p>
                  </div>

                  {/* Bottom Auth Buttons */}
                  <div className="splash-auth-buttons">
                    <button className="btn-splash-login" onClick={() => setIsAppModalOpen(true)}>Login</button>
                    <button className="btn-splash-create" onClick={() => setIsAppModalOpen(true)}>Create Account</button>
                  </div>

                  {/* Home Indicator Bar */}
                  <div className="home-indicator"></div>
                </div>
              </div>
            </div>

            {/* Phone 2 (Front Right: User Dashboard Screen) */}
            <div className="phone-device phone-dashboard">
              <div className="phone-outer-frame">
                <div className="phone-speaker-notch"></div>
                <div className="phone-screen-content dash-screen">
                  {/* Status Bar */}
                  <div className="phone-status-bar">
                    <span className="bar-time">10:44</span>
                    <div className="bar-icons">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.22 19.58 10.57 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/></svg>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z"/></svg>
                      <div className="battery-pill"><div className="battery-fill"></div></div>
                    </div>
                  </div>

                  {/* App Header: User Profile */}
                  <div className="app-user-header">
                    <div className="user-avatar-group">
                      <img src="/assets/customer_user.jpg" alt="Manish Shah" className="user-avatar-img" />
                      <div className="user-meta">
                        <span className="user-greeting">Hello</span>
                        <h4 className="user-name">Manish Shah</h4>
                        <span className="user-id">#WM1202100</span>
                      </div>
                    </div>
                    <div className="app-bell-btn">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#475569" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                    </div>
                  </div>

                  {/* My Shopping Coin Card Banner */}
                  <div className="coin-card-banner">
                    <div className="coin-card-left">
                      <div className="coin-gold-icon">
                        <span>&#8377;</span>
                      </div>
                      <div className="coin-info">
                        <span className="coin-label">My Shopping Coin</span>
                        <span className="coin-value">2,000</span>
                      </div>
                    </div>
                    <div className="coin-card-arrow">
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="#e11d48">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* Quick Action Grid (4 icons) */}
                  <div className="app-quick-actions">
                    <div className="action-item">
                      <div className="action-icon-circle action-green">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                      </div>
                      <span className="action-title">Nearby Shops</span>
                    </div>
                    <div className="action-item">
                      <div className="action-icon-circle action-purple">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path></svg>
                      </div>
                      <span className="action-title">Orders</span>
                    </div>
                    <div className="action-item">
                      <div className="action-icon-circle action-blue">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                      </div>
                      <span className="action-title">Offers</span>
                    </div>
                    <div className="action-item">
                      <div className="action-icon-circle action-red">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#dc2626" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                      </div>
                      <span className="action-title">Wallet</span>
                    </div>
                  </div>

                  {/* Nearby Shops Section */}
                  <div className="app-shops-section">
                    <div className="shops-section-header">
                      <h6>Nearby Shops</h6>
                    </div>
                    
                    <div className="shops-list">
                      {/* Shop 1: Gokul Vegetables */}
                      <div className="shop-card-item">
                        <div className="shop-thumb-box thumb-veg">
                          <img src="/assets/categories/vegetables.png?v=hd2" alt="Vegetables" className="thumb-mini-img" />
                        </div>
                        <div className="shop-details">
                          <span className="shop-name">Gokul Vegetables</span>
                          <span className="shop-category">Daily Needs</span>
                        </div>
                        <span className="shop-distance-badge">0.5 km</span>
                      </div>

                      {/* Shop 2: Shree Kirana Store */}
                      <div className="shop-card-item">
                        <div className="shop-thumb-box thumb-grocery">
                          <img src="/assets/categories/grocery.png?v=hd2" alt="Grocery" className="thumb-mini-img" />
                        </div>
                        <div className="shop-details">
                          <span className="shop-name">Shree Kirana Store</span>
                          <span className="shop-category">Groceries</span>
                        </div>
                        <span className="shop-distance-badge">1.0 km</span>
                      </div>

                      {/* Shop 3: Jay Medical */}
                      <div className="shop-card-item">
                        <div className="shop-thumb-box thumb-medical">
                          <img src="/assets/categories/medical.png?v=hd2" alt="Medical" className="thumb-mini-img" />
                        </div>
                        <div className="shop-details">
                          <span className="shop-name">Jay Medical</span>
                          <span className="shop-category">Pharmacy &amp; Care</span>
                        </div>
                        <span className="shop-distance-badge">1.5 km</span>
                      </div>

                      {/* Shop 4: Beauty Salon */}
                      <div className="shop-card-item">
                        <div className="shop-thumb-box thumb-salon">
                          <img src="/assets/categories/salon.png?v=hd2" alt="Salon" className="thumb-mini-img" />
                        </div>
                        <div className="shop-details">
                          <span className="shop-name">Beauty Salon</span>
                          <span className="shop-category">Hair &amp; Care</span>
                        </div>
                        <span className="shop-distance-badge">1.8 km</span>
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator Bar */}
                  <div className="home-indicator"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 6 Features & Download CTA */}
          <div className="ma-features-col">
            <div className="ma-features-list">
              {/* Feature 1: Get Monthly Shopping Coin */}
              <div className="ma-feature-item">
                <div className="ma-icon-circle icon-royal-blue">
                  <svg viewBox="0 0 32 32" fill="currentColor">
                    <circle cx="11" cy="16" r="6" fill="none" stroke="white" strokeWidth="2.5" />
                    <circle cx="21" cy="16" r="6" fill="none" stroke="white" strokeWidth="2.5" />
                    <circle cx="11" cy="16" r="2.5" fill="white" />
                    <circle cx="21" cy="16" r="2.5" fill="white" />
                  </svg>
                </div>
                <span className="ma-feature-label">Get Monthly Shopping Coin</span>
              </div>

              {/* Feature 2: Find Nearby Shops */}
              <div className="ma-feature-item">
                <div className="ma-icon-circle icon-pink-badge">
                  <svg viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="16" cy="13" r="7" />
                    <circle cx="16" cy="13" r="3" fill="white" />
                    <path d="M12 19L10 26L16 23L22 26L20 19" />
                  </svg>
                </div>
                <span className="ma-feature-label">Find Nearby Shops</span>
              </div>

              {/* Feature 3: Shop & Save */}
              <div className="ma-feature-item">
                <div className="ma-icon-circle icon-orange-bag">
                  <svg viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="8" y="11" width="16" height="15" rx="3" />
                    <path d="M12 11V8C12 5.8 13.8 4 16 4C18.2 4 20 5.8 20 8V11" />
                    <circle cx="13" cy="16" r="1" fill="white" />
                    <line x1="12" y1="21" x2="20" y2="16" strokeWidth="1.8" />
                    <circle cx="19" cy="21" r="1" fill="white" />
                  </svg>
                </div>
                <span className="ma-feature-label">Shop &amp; Save</span>
              </div>

              {/* Feature 4: Home Delivery (Vegetables) */}
              <div className="ma-feature-item">
                <div className="ma-icon-circle icon-sky-truck">
                  <svg viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 13H25L23 25H9L7 13Z" />
                    <path d="M11 13L16 6L21 13" />
                    <circle cx="16" cy="19" r="2.5" fill="white" />
                  </svg>
                </div>
                <span className="ma-feature-label">Home Delivery (Vegetables)</span>
              </div>

              {/* Feature 5: Refer & Earn */}
              <div className="ma-feature-item">
                <div className="ma-icon-circle icon-rose-people">
                  <svg viewBox="0 0 32 32" fill="currentColor">
                    <circle cx="16" cy="12" r="3.5" />
                    <path d="M10 24c0-3.3 2.7-6 6-6s6 2.7 6 6v1H10v-1z" />
                    <circle cx="8" cy="14" r="2.8" />
                    <path d="M3 24c0-2.5 2-4.5 4.5-4.5.6 0 1.2.1 1.7.3-.4.9-.7 1.9-.7 3.2V24H3z" />
                    <circle cx="24" cy="14" r="2.8" />
                    <path d="M29 24c0-2.5-2-4.5-4.5-4.5-.6 0-1.2.1-1.7.3.4.9.7 1.9.7 3.2V24h5.5z" />
                  </svg>
                </div>
                <span className="ma-feature-label">Refer &amp; Earn</span>
              </div>

              {/* Feature 6: Track Orders */}
              <div className="ma-feature-item">
                <div className="ma-icon-circle icon-blue-track">
                  <svg viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="7" y="7" width="18" height="18" rx="4" />
                    <circle cx="16" cy="16" r="4" />
                    <line x1="16" y1="12" x2="16" y2="8" />
                    <line x1="20" y1="16" x2="24" y2="16" />
                  </svg>
                </div>
                <span className="ma-feature-label">Track Orders</span>
              </div>
            </div>

            {/* Get Started Section */}
            <div className="ma-download-section">
              <h3 className="download-heading">Get Started with WOMUP</h3>
              <p className="download-subtext">Register your interest to unlock exclusive shopping coin rewards at your nearby local stores.</p>

              {/* Primary Direct Registration Card */}
              <div className="ma-direct-download-card">
                <button
                  type="button"
                  className="btn-ma-direct-apk"
                  onClick={() => setIsAppModalOpen(true)}
                  id="pageDirectDownloadBtn"
                >
                  <div className="ma-direct-icon-box">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                  </div>
                  <div className="ma-direct-content">
                    <span className="ma-direct-badge">OFFICIAL REGISTRATION</span>
                    <strong className="ma-direct-title">Join WOMUP &bull; Register Interest</strong>
                    <span className="ma-direct-meta">Free &bull; Instant Registration &bull; Save Up to 20%</span>
                  </div>
                  <div className="ma-direct-arrow">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>
              
              <div className="store-badges-row">
                <button 
                  type="button" 
                  className="section-badge-btn" 
                  id="googlePlayBtnIndex"
                  onClick={() => setIsAppModalOpen(true)}
                  aria-label="Get it on Google Play"
                  style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <img 
                    src="/assets/google-play-badge.svg" 
                    alt="Get it on Google Play" 
                    className="section-badge-img"
                  />
                </button>

                <button 
                  type="button" 
                  className="section-badge-btn" 
                  id="appleStoreBtnIndex"
                  onClick={() => setIsAppModalOpen(true)}
                  aria-label="Download on the App Store"
                  style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <img 
                    src="/assets/app-store-badge.svg" 
                    alt="Download on the App Store" 
                    className="section-badge-img"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




