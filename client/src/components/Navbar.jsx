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
            <div className="mobile-drawer-logo">
              <img src="/assets/new-logo.png" alt="WOMUP" />
            </div>
            <button
              type="button"
              className="mobile-drawer-close"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
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
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/how-it-works" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  How It Works
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/for-customers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  For Customers
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/for-vendors" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  For Vendors
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/shop-categories" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  Shop Categories
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/income-opportunity" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  Income
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/womup-mobile-app" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  Mobile App
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/gallery" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  Gallery
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Mobile Drawer Footer Actions (only on mobile) */}
          <div className="mobile-drawer-footer">
            <Link to="/login" className="btn-mobile-login" onClick={closeMobileMenu}>
              Portal Login
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
              Download WOMUP App (.APK)
            </button>
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




