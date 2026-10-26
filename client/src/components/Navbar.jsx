import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openAppModal } = useModal();

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar" id="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo-link" aria-label="WOMUP Home" onClick={closeMobileMenu}>
          <div className="logo-wrapper">
            <img src="/assets/new-logo.png" alt="WOMUP" className="site-logo" />
          </div>
        </Link>

        {/* Desktop / Mobile Navigation Menu */}
        <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`} id="navMenu">
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
        </nav>

        {/* CTA Button */}
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




