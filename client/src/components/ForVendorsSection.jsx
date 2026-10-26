import React from 'react';
import { useModal } from '../context/ModalContext';

export default function ForVendorsSection({ isPage = false }) {
  const { setIsAppModalOpen } = useModal();

  const HeadingTag = isPage ? 'h1' : 'h2';

  return (
    <section className="for-vendors-page" id="vendors">
      {/* Background Ambient Elements & Waves */}
      <div className="fv-bg-glow glow-pink-top"></div>
      <div className="fv-bg-glow glow-blue-bottom"></div>
      <div className="fv-wave-accent wave-curve-1"></div>
      <div className="fv-wave-accent wave-curve-2"></div>

      <div className="fv-container">
        {/* Left Content Column */}
        <div className="fv-left-content">
          <div className="fv-heading-group">
            <HeadingTag className="fv-heading">
              <span className="fv-title-dark">For </span>
              <span className="fv-title-blue">Vendors</span>
            </HeadingTag>

            <div className="fv-taglines">
              <span>More Customers</span>
              <span>Higher Sales</span>
              <span>Digital Growth</span>
            </div>
          </div>

          {/* White Floating Card with 5 Features */}
          <div className="fv-card">
            {/* Item 1: Get more customers from WOMUP network */}
            <div className="fv-card-item">
              <div className="fv-icon-circle">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <p className="fv-item-text">Get more customers<br />from WOMUP network</p>
            </div>

            {/* Item 2: Increase daily sales */}
            <div className="fv-card-item">
              <div className="fv-icon-box">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="14" width="4" height="7" rx="1.5" fill="#ff1475" />
                  <rect x="10" y="9" width="4" height="12" rx="1.5" fill="#ff1475" />
                  <rect x="17" y="4" width="4" height="17" rx="1.5" fill="#ff1475" />
                </svg>
              </div>
              <p className="fv-item-text">Increase daily sales</p>
            </div>

            {/* Item 3: Easy QR based billing */}
            <div className="fv-card-item">
              <div className="fv-icon-box">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#ff1475" strokeWidth="2" />
                  <rect x="5.5" y="5.5" width="2" height="2" fill="#ff1475" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#ff1475" strokeWidth="2" />
                  <rect x="16.5" y="5.5" width="2" height="2" fill="#ff1475" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#ff1475" strokeWidth="2" />
                  <rect x="5.5" y="16.5" width="2" height="2" fill="#ff1475" />
                  <rect x="14" y="14" width="3" height="3" fill="#ff1475" />
                  <rect x="18" y="14" width="3" height="3" fill="#ff1475" />
                  <rect x="14" y="18" width="7" height="3" fill="#ff1475" />
                </svg>
              </div>
              <p className="fv-item-text">Easy QR based billing</p>
            </div>

            {/* Item 4: Timely settlement */}
            <div className="fv-card-item">
              <div className="fv-icon-box">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 5V11C4 16.5 7.5 21.5 12 22C16.5 21.5 20 16.5 20 11V5L12 2Z" fill="#ff1475" />
                  <path d="M9 11.5L11 13.5L15 9.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="fv-item-text">Timely settlement</p>
            </div>

            {/* Item 5: Be part of a growing community */}
            <div className="fv-card-item">
              <div className="fv-icon-box">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="7" r="3" stroke="#ff1475" strokeWidth="2" />
                  <circle cx="5" cy="11" r="2.5" stroke="#ff1475" strokeWidth="1.8" />
                  <circle cx="19" cy="11" r="2.5" stroke="#ff1475" strokeWidth="1.8" />
                  <path d="M7.5 21V18C7.5 15.8 9.5 14 12 14C14.5 14 16.5 15.8 16.5 18V21" stroke="#ff1475" strokeWidth="2" strokeLinecap="round" />
                  <path d="M2 21V19C2 17.5 3.5 16 5 16" stroke="#ff1475" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M22 21V19C22 17.5 20.5 16 19 16" stroke="#ff1475" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <p className="fv-item-text">Be part of a growing<br />community</p>
            </div>
          </div>

          {/* Bottom CTA Button */}
          <div className="fv-cta-wrapper">
            <button className="btn-register-vendor" id="registerVendorBtn" onClick={() => setIsAppModalOpen(true)}>
              <span>Register as Vendor</span>
              <svg className="cta-arrow" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Visual Column (Shopkeeper in Supermarket) */}
        <div className="fv-right-visual">
          <div className="fv-image-container">
            <img src="/assets/vendor_store_owner.jpg" alt="WOMUP Vendor Partner" className="fv-vendor-img" />
          </div>
        </div>
      </div>
    </section>
  );
}

