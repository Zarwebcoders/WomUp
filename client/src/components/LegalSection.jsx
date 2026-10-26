import React, { useState } from 'react';

export default function LegalSection() {
  const [activeTab, setActiveTab] = useState('pincode-policy');

  const tabs = [
    { id: 'pincode-policy', label: 'Pincode & Referral Policy' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'privacy', label: 'Privacy & Geolocation' },
    { id: 'vendor-agreement', label: 'Vendor Partner Agreement' },
    { id: 'compliance', label: 'Corporate Compliance' },
  ];

  return (
    <section className="legal-page-section" id="legal">
      <div className="legal-hero-banner">
        <div className="legal-container">
          <span className="legal-badge">OFFICIAL POLICY &amp; COMPLIANCE</span>
          <h1 className="legal-title">Legal Terms &amp; Operational Policies</h1>
          <p className="legal-subtitle">
            WOMUP ENTERPRISE PRIVATE LIMITED &bull; Transparency, Legal Governance &amp; Pincode Operational Standards
          </p>
          <div className="legal-company-strip">
            <span><strong>Company:</strong> WOMUP ENTERPRISE PRIVATE LIMITED</span>
            <span>&bull;</span>
            <span><strong>Location:</strong> Ahmedabad, Gujarat 380051</span>
            <span>&bull;</span>
            <span><strong>Support:</strong> womupproducts@gmail.com</span>
          </div>
        </div>
      </div>

      <div className="legal-container legal-body-wrap">
        {/* Tab Navigation */}
        <div className="legal-nav-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`legal-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Pincode & Referral Policy */}
        {activeTab === 'pincode-policy' && (
          <div className="legal-card-content fade-in">
            <div className="legal-section-header">
              <h2>1. Pincode-Specific Referral Policy &amp; Geolocation Tagging</h2>
              <span className="policy-date">Updated: October 2026</span>
            </div>

            <div className="legal-alert-box primary">
              <div className="alert-icon">📍</div>
              <div className="alert-text">
                <strong>CRITICAL REFERRAL INCENTIVE RULE:</strong> Referral joining benefits (&#8377;20 on Level 1, &#8377;10 on Level 2, and &#8377;5 on Level 3) are <strong>strictly payable on joinings of persons registered within your designated/selected operational pincode area</strong>.
              </div>
            </div>

            <div className="policy-block">
              <h3>1.1 Mandatory Device Location Onboarding</h3>
              <p>
                To maintain authentic local commerce and support neighborhood kirana stores, <strong>all new user and vendor registrations must have device GPS / Location turned ON</strong>. When location is enabled, our platform automatically identifies and locks the member's current geographical location and postal code (Pincode).
              </p>
              <ul>
                <li>The member is officially geotagged to their active residential or commercial pincode.</li>
                <li>Hyperlocal merchant offers, digital coin acceptance, and neighborhood savings are routed based on this validated location.</li>
                <li>Fake or proxy registrations without verified geolocation are strictly flagged and ineligible for payout.</li>
              </ul>
            </div>

            <div className="policy-block">
              <h3>1.2 Referral Income Structure (&#8377;20 / &#8377;10 / &#8377;5)</h3>
              <p>
                WOMUP ENTERPRISE PRIVATE LIMITED rewards community advocates who introduce new households to local smart shopping. The referral joining rewards are structured as follows:
              </p>
              <div className="legal-payout-table-wrap">
                <table className="legal-table">
                  <thead>
                    <tr>
                      <th>Referral Tier</th>
                      <th>Bonus Amount</th>
                      <th>Eligibility Criterion</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Tier 1 (Direct Referral)</strong></td>
                      <td><span className="highlight-magenta bold">&#8377;20 per joining</span></td>
                      <td>New member registers within the referrer's designated/operational pincode.</td>
                    </tr>
                    <tr>
                      <td><strong>Tier 2 (Indirect Referral)</strong></td>
                      <td><span className="highlight-magenta bold">&#8377;10 per joining</span></td>
                      <td>Second-generation joining within the designated operational pincode.</td>
                    </tr>
                    <tr>
                      <td><strong>Tier 3 (Community Referral)</strong></td>
                      <td><span className="highlight-magenta bold">&#8377;5 per joining</span></td>
                      <td>Third-generation joining within the designated operational pincode.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="policy-block">
              <h3>1.3 Cross-Pincode Disqualification</h3>
              <p>
                If a referred person registers outside the designated operational pincode boundary, no joining referral incentive (&#8377;20, &#8377;10, &#8377;5) will be distributed for that account. This rule guarantees that promoter rewards are directly linked to genuine local area merchant patronage and community ecosystem growth.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Terms & Conditions */}
        {activeTab === 'terms' && (
          <div className="legal-card-content fade-in">
            <div className="legal-section-header">
              <h2>2. User Terms &amp; Conditions</h2>
              <span className="policy-date">Governed by Laws of India</span>
            </div>

            <div className="policy-block">
              <h3>2.1 Acceptance of Agreement</h3>
              <p>
                By accessing <strong>WOMUP</strong> (website, mobile application, or offline merchant portal), operated by <strong>WOMUP ENTERPRISE PRIVATE LIMITED</strong>, you agree to be bound by these Terms of Service. If you do not accept these terms, you may not use the services.
              </p>
            </div>

            <div className="policy-block">
              <h3>2.2 Membership &amp; Monthly Shopping Coins</h3>
              <p>
                WOMUP customers receive &#8377;2,000 monthly digital shopping coins to spend at verified local partner vendors.
              </p>
              <ul>
                <li>Coins have no cash surrender value and can only be used at verified WOMUP merchant stores.</li>
                <li>Coins are credited on the 1st of every calendar month following active status.</li>
                <li>Discounts provided by vendors via digital coins cannot be exchanged for cash.</li>
              </ul>
            </div>

            <div className="policy-block">
              <h3>2.3 User Conduct &amp; Fair Usage</h3>
              <p>
                Users agree not to exploit the platform through emulators, fake GPS spoofing, fraudulent bill generation, or duplicate account creation. WOMUP reserves the right to terminate accounts that violate fair usage.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Privacy & Geolocation */}
        {activeTab === 'privacy' && (
          <div className="legal-card-content fade-in">
            <div className="legal-section-header">
              <h2>3. Privacy Policy &amp; Geolocation Data Protection</h2>
              <span className="policy-date">Information Technology Act, 2000 Compliant</span>
            </div>

            <div className="policy-block">
              <h3>3.1 Location Data Collection</h3>
              <p>
                WOMUP collects precise GPS coordinates when the user opens the application or completes registration. This data is exclusively utilized to:
              </p>
              <ul>
                <li>Locate nearby registered kirana stores, supermarkets, and service providers.</li>
                <li>Verify pincode eligibility for referral rewards and promotion distribution.</li>
                <li>Ensure accurate order routing and digital invoice generation.</li>
              </ul>
              <p>WOMUP does not sell, lease, or distribute private location coordinates to third-party ad networks.</p>
            </div>

            <div className="policy-block">
              <h3>3.2 Personal Data Security</h3>
              <p>
                User mobile numbers, full names, and payment details are encrypted using industry-standard TLS encryption protocols. OTP authentication protects user profile modifications.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Vendor Agreement */}
        {activeTab === 'vendor-agreement' && (
          <div className="legal-card-content fade-in">
            <div className="legal-section-header">
              <h2>4. Merchant Partner &amp; Vendor Agreement</h2>
              <span className="policy-date">B2B Merchant Code of Conduct</span>
            </div>

            <div className="policy-block">
              <h3>4.1 0% Joining Fee &amp; Direct Settlements</h3>
              <p>
                WOMUP connects offline neighborhood retailers to digital customers without prohibitive joining or setup fees.
              </p>
              <ul>
                <li>Merchants accept customer digital coin redemptions according to their enrolled category discount.</li>
                <li>Vendor billing is managed via the official WOMUP Merchant Portal with instantaneous customer notification.</li>
                <li>Vendors must supply genuine, unadulterated goods matching fair market value.</li>
              </ul>
            </div>

            <div className="policy-block">
              <h3>4.2 QR Code &amp; Branding Display</h3>
              <p>
                Authorized vendors agree to place the official WOMUP Standee, QR code scan acrylic, and verification seal at their customer checkout counters.
              </p>
            </div>
          </div>
        )}

        {/* Tab 5: Corporate Compliance & Grievance */}
        {activeTab === 'compliance' && (
          <div className="legal-card-content fade-in">
            <div className="legal-section-header">
              <h2>5. Corporate Compliance &amp; Grievance Redressal</h2>
              <span className="policy-date">Consumer Protection (E-Commerce) Rules, 2020</span>
            </div>

            <div className="compliance-details-grid">
              <div className="compliance-card">
                <h4>Corporate Entity</h4>
                <p><strong>WOMUP ENTERPRISE PRIVATE LIMITED</strong></p>
                <p>Incorporated under Companies Act, 2013</p>
                <p>State: Gujarat, India</p>
              </div>

              <div className="compliance-card">
                <h4>Registered &amp; Corporate Office</h4>
                <p>A-909 And 910, Signature-2</p>
                <p>Nr. Sarkhej -Sanand Chokdi, SG HIGHWAY</p>
                <p>AHMEDABAD, GUJARAT 380051</p>
              </div>

              <div className="compliance-card">
                <h4>Grievance &amp; Compliance Officer</h4>
                <p><strong>Officer:</strong> Grievance Redressal Cell</p>
                <p><strong>Email:</strong> womupproducts@gmail.com</p>
                <p><strong>Cell:</strong> +91 81281 12460</p>
                <p><strong>Response Time:</strong> Within 48 business hours</p>
              </div>
            </div>

            <div className="policy-block" style={{ marginTop: '24px' }}>
              <h3>Jurisdiction</h3>
              <p>
                Any dispute, legal claim, or controversy arising out of platform membership or services shall be subject to the exclusive jurisdiction of the competent courts in <strong>Ahmedabad, Gujarat, India</strong>.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
