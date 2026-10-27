import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openAppModal } = useModal();

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-nav-locked');
    } else {
      document.body.classList.remove('mobile-nav-locked');
    }
    return () => {
      document.body.classList.remove('mobile-nav-locked');
    };
  }, [mobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="navbar" id="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo-link" aria-label="WOMUP Home" onClick={closeMobileMenu}>
          <div className="logo-wrapper">
            <img src="/assets/new-logo.png" alt="WOMUP" className="site-logo" />
          </div>
        </Link>

        {/* Mobile Backdrop Overlay */}
        <div
          className={`mobile-nav-backdrop ${mobileMenuOpen ? 'open' : ''}`}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />

        {/* Desktop Navbar / Mobile Sidebar Drawer */}
        <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`} id="navMenu">
          {/* Mobile Drawer Top Header (only on mobile) */}
          <div className="mobile-drawer-header">
            <div className="mobile-drawer-brand">
              <img src="/assets/new-logo.png" alt="WOMUP" className="drawer-logo-img" />
            </div>
            <button
              type="button"
              className="mobile-drawer-close"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Scrollable Nav Items */}
          <div className="nav-menu-scrollable">
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <div className="nav-link-left">
                    <span className="nav-icon-mobile">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </span>
                    <span>Home</span>
                  </div>
                  <span className="nav-chevron-mobile">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/how-it-works" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <div className="nav-link-left">
                    <span className="nav-icon-mobile">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="10 8 16 12 10 16 10 8" />
                      </svg>
                    </span>
                    <span>How It Works</span>
                  </div>
                  <span className="nav-chevron-mobile">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/for-customers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <div className="nav-link-left">
                    <span className="nav-icon-mobile">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                    </span>
                    <span>For Customers</span>
                  </div>
                  <span className="nav-chevron-mobile">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/for-vendors" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <div className="nav-link-left">
                    <span className="nav-icon-mobile">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l2-5h14l2 5" />
                        <path d="M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <path d="M9 21V12h6v9" />
                      </svg>
                    </span>
                    <span>For Vendors</span>
                  </div>
                  <span className="nav-chevron-mobile">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/shop-categories" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <div className="nav-link-left">
                    <span className="nav-icon-mobile">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                    </span>
                    <span>Shop Categories</span>
                  </div>
                  <span className="nav-chevron-mobile">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/income-opportunity" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <div className="nav-link-left">
                    <span className="nav-icon-mobile">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </span>
                    <span>Income</span>
                  </div>
                  <span className="nav-chevron-mobile">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/womup-mobile-app" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <div className="nav-link-left">
                    <span className="nav-icon-mobile">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                        <line x1="12" y1="18" x2="12.01" y2="18" />
                      </svg>
                    </span>
                    <span>Mobile App</span>
                  </div>
                  <span className="nav-chevron-mobile">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/gallery" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <div className="nav-link-left">
                    <span className="nav-icon-mobile">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </span>
                    <span>Gallery</span>
                  </div>
                  <span className="nav-chevron-mobile">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <div className="nav-link-left">
                    <span className="nav-icon-mobile">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </span>
                    <span>Contact</span>
                  </div>
                  <span className="nav-chevron-mobile">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </NavLink>
              </li>
            </ul>

            {/* In-drawer Perk Card */}
            <div className="drawer-perk-card">
              <div className="perk-card-icon">🛍️</div>
              <div className="perk-card-content">
                <span className="perk-badge">WOMUP Member Perk</span>
                <span className="perk-title">Save Up to 20% Locally</span>
                <p className="perk-desc">Earn monthly shopping coins & enjoy discounts at nearby partner stores.</p>
              </div>
            </div>
          </div>

          {/* Mobile Drawer Footer Actions (only on mobile) */}
          <div className="mobile-drawer-footer">
            <Link to="/login" className="btn-mobile-login" onClick={closeMobileMenu}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Portal Login</span>
            </Link>

            <button
              type="button"
              className="btn-mobile-download"
              onClick={() => {
                closeMobileMenu();
                openAppModal();
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download WOMUP App (.APK)</span>
            </button>

            <div className="btn-mobile-meta">
              Official Android Release &bull; Version 1.0.0 &bull; Fast &amp; Safe
            </div>
          </div>
        </nav>

        {/* CTA Button in Header */}
        <div className="nav-action">
          <Link to="/login" className="btn-login-nav" onClick={closeMobileMenu}>
            Portal Login
          </Link>

          <button className="btn-download" id="downloadBtn" onClick={openAppModal}>
            Download App
          </button>

          <button
            className={`mobile-toggle ${mobileMenuOpen ? 'active' : ''}`}
            id="mobileToggle"
            aria-label="Toggle Navigation"
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}




