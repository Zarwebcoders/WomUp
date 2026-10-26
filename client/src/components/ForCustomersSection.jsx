import React, { useState } from 'react';
import { useModal } from '../context/ModalContext';

export default function ForCustomersSection({ isPage = false }) {
  const { setIsAppModalOpen, showToast } = useModal();
  const [activeTab, setActiveTab] = useState('shops'); // 'shops' | 'orders' | 'offers' | 'wallet'
  const [selectedShop, setSelectedShop] = useState(null);

  const HeadingTag = isPage ? 'h1' : 'h2';

  const shops = [
    {
      id: 1,
      name: 'Gokul Vegetables',
      category: 'Fruits & Vegetables',
      distance: '0.5 km',
      img: '/assets/fresh_vegetables.jpg',
      isImage: true,
      offer: 'Flat 15% Coin Discount'
    },
    {
      id: 2,
      name: 'Shree Kirana Store',
      category: 'Grocery & Provisions',
      distance: '1.2 km',
      img: '/assets/vendor_shopkeeper.jpg',
      isImage: true,
      offer: '?200 Instant Coin Off'
    },
    {
      id: 3,
      name: 'Jay Medical',
      category: 'Pharmacy & Care',
      distance: '1.5 km',
      symbol: '?',
      className: 'thumb-medical',
      offer: 'Save 10% on medicines'
    },
    {
      id: 4,
      name: 'Beauty Salon',
      category: 'Hair & Skin Care',
      distance: '1.8 km',
      symbol: '?',
      className: 'thumb-salon',
      offer: 'Free hair wash on ?500 bill'
    }
  ];

  const orders = [
    {
      id: 'WM-8821',
      store: 'Gokul Vegetables',
      date: 'Today, 11:30 AM',
      items: '5 Items (Organic Produce)',
      amount: '?340',
      saved: '?70 saved with coins',
      status: 'Delivered'
    },
    {
      id: 'WM-8745',
      store: 'Shree Kirana Store',
      date: 'Yesterday',
      items: 'Atta, Dal, Mustard Oil',
      amount: '?890',
      saved: '?180 saved with coins',
      status: 'Delivered'
    },
    {
      id: 'WM-8610',
      store: 'Jay Medical',
      date: '28 Sep',
      items: 'Healthcare essentials',
      amount: '?280',
      saved: '?50 saved with coins',
      status: 'Delivered'
    }
  ];

  const offers = [
    {
      code: 'WOMUP20',
      title: 'Flat 20% Coin Discount',
      desc: 'Valid on grocery and vegetable stores near you.',
      badge: 'POPULAR'
    },
    {
      code: 'FREEDEL',
      title: 'Free Doorstep Delivery',
      desc: 'On orders above ?199 from registered local vendors.',
      badge: 'LIMITED'
    },
    {
      code: 'BOOST50',
      title: '?50 Referral Bonus Coin',
      desc: 'Credit directly to your shopping coin wallet.',
      badge: 'SPECIAL'
    }
  ];

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    showToast(`Coupon ${code} copied to clipboard!`, 'success');
  };

  return (
    <section className="for-customers-page" id="customers">
      {/* Background Ambient Glows */}
      <div className="fc-bg-glow glow-sky"></div>
      <div className="fc-bg-glow glow-blush"></div>

      <div className="fc-container">
        {/* Left Column: Title, 4 Benefit Items & CTA Button */}
        <div className="fc-left-content">
          <HeadingTag className="fc-heading">
            <span className="fc-title-dark">For </span>
            <span className="fc-title-pink">Customers</span>
          </HeadingTag>

          {/* 4 Benefit Rows */}
          <div className="fc-benefits-list">
            {/* Benefit 1: ?2,000 Monthly Shopping Coin */}
            <div className="fc-benefit-item">
              <div className="fc-benefit-icon icon-green">
                <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 11C13 11 11 8 13.5 5C16 2 20.5 7 21.5 11H16Z" fill="#16a34a" />
                  <path d="M28 11C31 11 33 8 30.5 5C28 2 23.5 7 22.5 11H28Z" fill="#16a34a" />
                  <circle cx="22" cy="11" r="2" fill="#15803d" />
                  <rect x="6" y="11" width="32" height="7" rx="2" fill="#16a34a" />
                  <rect x="8" y="18" width="28" height="20" rx="2.5" fill="#16a34a" />
                  <rect x="20" y="11" width="4" height="27" fill="#ffffff" />
                  <rect x="8" y="25" width="28" height="3.5" fill="#ffffff" />
                </svg>
              </div>
              <div className="fc-benefit-text">
                <span className="benefit-main">&#8377;2,000 Monthly</span>
                <span className="benefit-sub">Shopping Coin</span>
              </div>
            </div>

            {/* Benefit 2: Shop at Nearby Local Stores */}
            <div className="fc-benefit-item">
              <div className="fc-benefit-icon icon-cart">
                <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 11H14L18 27H33L36 15H17" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="22" y1="15" x2="22" y2="27" stroke="#2563eb" strokeWidth="2" />
                  <line x1="28" y1="15" x2="28" y2="27" stroke="#2563eb" strokeWidth="2" />
                  <line x1="17" y1="21" x2="34" y2="21" stroke="#2563eb" strokeWidth="2" />
                  <circle cx="19" cy="33" r="3" fill="#2563eb" />
                  <circle cx="31" cy="33" r="3" fill="#2563eb" />
                </svg>
              </div>
              <div className="fc-benefit-text">
                <span className="benefit-main">Shop at Nearby</span>
                <span className="benefit-sub">Local Stores</span>
              </div>
            </div>

            {/* Benefit 3: Real Savings on Every Purchase */}
            <div className="fc-benefit-item">
              <div className="fc-benefit-icon icon-percent">
                <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="22" cy="22" r="18" fill="#4f46e5" />
                  <circle cx="16" cy="16" r="3" fill="#ffffff" />
                  <circle cx="28" cy="28" r="3" fill="#ffffff" />
                  <line x1="28" y1="15" x2="16" y2="29" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="fc-benefit-text">
                <span className="benefit-main">Real Savings</span>
                <span className="benefit-sub">on Every Purchase</span>
              </div>
            </div>

            {/* Benefit 4: Extra Benefits and Rewards */}
            <div className="fc-benefit-item">
              <div className="fc-benefit-icon icon-star">
                <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="22" cy="22" r="18" fill="#7c3aed" />
                  <polygon points="22,12 25,18.5 32,19.2 26.8,24 28.3,31 22,27.3 15.7,31 17.2,24 12,19.2 19,18.5" fill="#ffffff" />
                </svg>
              </div>
              <div className="fc-benefit-text">
                <span className="benefit-main">Extra Benefits</span>
                <span className="benefit-sub">and Rewards</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="fc-cta-wrapper">
            <button className="btn-start-shopping" id="startShoppingBtn" onClick={() => setIsAppModalOpen(true)}>
              <span>Start Shopping Now</span>
              <svg className="cta-arrow" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Smartphone App Simulator */}
        <div className="fc-right-mockup">
          <div className="mockup-hint-pill">
            <span className="live-dot"></span> Try interactive app demo below
          </div>

          <div className="phone-frame">
            <div className="phone-speaker"></div>
            <div className="phone-screen">
              {/* App Status Bar */}
              <div className="app-status-bar">
                <span className="status-time">02:01</span>
                <div className="status-icons">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.22 19.58 10.57 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/></svg>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z"/></svg>
                  <div className="battery-icon"><div className="battery-level"></div></div>
                </div>
              </div>

              {/* App Header: User Profile */}
              <div className="app-user-header">
                <div className="user-avatar-group">
                  <img src="/assets/customer_user.jpg" alt="Manish Shah" className="user-avatar-img" />
                  <div className="user-meta">
                    <span className="user-greeting">Hello</span>
                    <h5 className="user-name">Manish Shah</h5>
                    <span className="user-id">WM100259</span>
                  </div>
                </div>
                <div 
                  className="app-bell-btn" 
                  onClick={() => showToast('You have 2 new cashback coins unlocked!', 'info')}
                  title="Notifications"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#475569" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <span className="bell-badge"></span>
                </div>
              </div>

              {/* My Shopping Coin Card Banner */}
              <div 
                className="coin-card-banner clickable-card"
                onClick={() => {
                  setActiveTab('wallet');
                  showToast('?2,000 Monthly Shopping Coins active for this month!', 'success');
                }}
              >
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

              {/* Quick Action Grid (4 Interactive Tabs) */}
              <div className="app-quick-actions">
                <button 
                  className={`action-item ${activeTab === 'shops' ? 'action-active' : ''}`}
                  onClick={() => setActiveTab('shops')}
                  type="button"
                >
                  <div className="action-icon-circle action-green">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                  </div>
                  <span className="action-title">Nearby Shops</span>
                </button>

                <button 
                  className={`action-item ${activeTab === 'orders' ? 'action-active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                  type="button"
                >
                  <div className="action-icon-circle action-purple">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path></svg>
                  </div>
                  <span className="action-title">Orders</span>
                </button>

                <button 
                  className={`action-item ${activeTab === 'offers' ? 'action-active' : ''}`}
                  onClick={() => setActiveTab('offers')}
                  type="button"
                >
                  <div className="action-icon-circle action-pink">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ff1475" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  </div>
                  <span className="action-title">Offers</span>
                </button>

                <button 
                  className={`action-item ${activeTab === 'wallet' ? 'action-active' : ''}`}
                  onClick={() => setActiveTab('wallet')}
                  type="button"
                >
                  <div className="action-icon-circle action-red">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#e11d48" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M6 12h12"></path></svg>
                  </div>
                  <span className="action-title">Wallet</span>
                </button>
              </div>

              {/* Dynamic Tab Content Area */}
              <div className="app-shops-section">
                {/* TAB 1: NEARBY SHOPS */}
                {activeTab === 'shops' && (
                  <>
                    <div className="shops-section-header">
                      <h6 className="shops-section-title">Nearby Stores ({shops.length})</h6>
                      <span className="header-subtitle">Tap store for discount</span>
                    </div>

                    <div className="shops-list">
                      {shops.map((shop) => (
                        <div 
                          key={shop.id}
                          className={`shop-card-item ${selectedShop?.id === shop.id ? 'shop-card-selected' : ''}`}
                          onClick={() => {
                            setSelectedShop(shop);
                            showToast(`${shop.name}: ${shop.offer}`, 'success');
                          }}
                        >
                          <div className={`shop-thumb-box ${shop.className || ''}`}>
                            {shop.isImage ? (
                              <img src={shop.img} alt={shop.name} className="shop-thumb-img" />
                            ) : (
                              <div className="medical-icon-symbol">{shop.symbol}</div>
                            )}
                          </div>
                          <div className="shop-details">
                            <h6 className="shop-name">{shop.name}</h6>
                            <span className="shop-category">{shop.category}</span>
                            <span className="shop-offer-pill">{shop.offer}</span>
                          </div>
                          <span className="shop-distance-badge">{shop.distance}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* TAB 2: ORDERS */}
                {activeTab === 'orders' && (
                  <div className="app-tab-orders">
                    <div className="shops-section-header">
                      <h6 className="shops-section-title">Recent Purchases</h6>
                    </div>
                    <div className="orders-sim-list">
                      {orders.map((order) => (
                        <div key={order.id} className="order-sim-card">
                          <div className="order-top">
                            <span className="order-store-name">{order.store}</span>
                            <span className="order-status-badge">{order.status}</span>
                          </div>
                          <div className="order-subtext">{order.items} &bull; {order.date}</div>
                          <div className="order-bottom">
                            <span className="order-amount-text">{order.amount}</span>
                            <span className="order-saved-text">{order.saved}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: OFFERS */}
                {activeTab === 'offers' && (
                  <div className="app-tab-offers">
                    <div className="shops-section-header">
                      <h6 className="shops-section-title">Exclusive Deals</h6>
                    </div>
                    <div className="offers-sim-list">
                      {offers.map((offer) => (
                        <div key={offer.code} className="offer-sim-card">
                          <div className="offer-card-top">
                            <span className="offer-badge-tag">{offer.badge}</span>
                            <button 
                              className="btn-copy-code"
                              onClick={() => handleCopyCode(offer.code)}
                            >
                              Copy {offer.code}
                            </button>
                          </div>
                          <h6 className="offer-sim-title">{offer.title}</h6>
                          <p className="offer-sim-desc">{offer.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: WALLET */}
                {activeTab === 'wallet' && (
                  <div className="app-tab-wallet">
                    <div className="wallet-sim-card">
                      <div className="wallet-row-balance">
                        <span className="w-label">Active Coins</span>
                        <span className="w-val">2,000 Coins</span>
                      </div>
                      <div className="wallet-row-balance">
                        <span className="w-label">Cashback Earned</span>
                        <span className="w-val">?450</span>
                      </div>
                      <div className="wallet-divider"></div>
                      <div className="wallet-row-balance total">
                        <span className="w-label">Next Renewal</span>
                        <span className="w-date">1st of Next Month</span>
                      </div>
                    </div>
                    <button 
                      className="btn-sim-scan"
                      onClick={() => showToast('Ready to scan Vendor QR code at store counter!', 'info')}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                      <span>Scan &amp; Pay at Store</span>
                    </button>
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Fresh Organic Vegetables Bottom Accent Banner */}
      <div className="fc-vegetables-banner">
        <img src="/assets/fresh_produce_transparent.png" alt="Fresh tomatoes and organic produce" className="fc-veggies-img" />
      </div>
    </section>
  );
}

