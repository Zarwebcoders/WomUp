import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: Brand & Corporate Entity */}
          <div className="footer-col footer-col-brand">
            <div className="footer-brand">
              <Link to="/" className="footer-logo-link" aria-label="WOMUP Home">
                <img src="/assets/new-logo.png" alt="WOMUP" className="footer-logo" />
              </Link>
              <h3 className="footer-company-name">WOMUP ENTERPRISE PRIVATE LIMITED</h3>
              <p className="footer-tagline">Smart Shopping &bull; Better Living &bull; Save & Earn Everyday</p>
              <p className="footer-desc">
                Empowering smart shoppers with ₹2,000 monthly shopping coins, verified local merchant discounts, and multi-tier community referral income across India.
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col footer-col-links">
            <h4 className="footer-col-title">Quick Links</h4>
            <nav className="footer-nav-list footer-links" aria-label="Footer Navigation">
              <Link to="/">Home</Link>
              <Link to="/how-it-works">How It Works</Link>
              <Link to="/for-customers">For Customers</Link>
              <Link to="/for-vendors">For Vendors</Link>
              <Link to="/shop-categories">Shop Categories</Link>
              <Link to="/income-opportunity">Income</Link>
              <Link to="/womup-mobile-app">Mobile App</Link>
              <Link to="/gallery">Media Gallery</Link>
              <Link to="/legal">Legal &amp; Policies</Link>
              <Link to="/contact">Contact</Link>
            </nav>
          </div>

          {/* Column 3: Corporate Office & Contact Details */}
          <div className="footer-col footer-col-contact">
            <h4 className="footer-col-title">Corporate Office</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <div className="footer-contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="footer-contact-text">
                  <span className="footer-contact-label">Address</span>
                  <p className="footer-contact-address">
                    A-909 And 910, Signature-2, Nr. Sarkhej -Sanand Chokdi, SG HIGHWAY, AHMEDABAD, GUJARAT 380051
                  </p>
                </div>
              </div>

              <div className="footer-contact-item">
                <div className="footer-contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="footer-contact-text">
                  <span className="footer-contact-label">Cell</span>
                  <a href="tel:8128112460" className="footer-contact-link">
                    8128112460
                  </a>
                </div>
              </div>

              <div className="footer-contact-item">
                <div className="footer-contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className="footer-contact-text">
                  <span className="footer-contact-label">Email</span>
                  <a href="mailto:womupproducts@gmail.com" className="footer-contact-link">
                    womupproducts@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom / Copyright */}
        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} <strong>WOMUP ENTERPRISE PRIVATE LIMITED</strong>. All rights reserved.
          </p>
          <div className="footer-bottom-badges">
            <Link to="/legal" className="footer-badge-link">Pincode Policy &amp; Legal Terms</Link>
            <span className="footer-badge-dot">&bull;</span>
            <span className="footer-badge">Government Registered Pvt. Ltd.</span>
            <span className="footer-badge-dot">&bull;</span>
            <span className="footer-badge">Ahmedabad, Gujarat</span>
          </div>
        </div>
      </div>
    </footer>
  );
}




