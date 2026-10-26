import React, { useState, useMemo } from 'react';
import { useModal } from '../context/ModalContext';

export default function IncomeOpportunitySection({ isPage = false }) {
  const { setIsAppModalOpen } = useModal();
  const [activeTab, setActiveTab] = useState('joining'); // 'joining' or 'monthly'
  const [directReferrals, setDirectReferrals] = useState(3);
  const [avgSpend, setAvgSpend] = useState(3000);
  const [selectedPincode, setSelectedPincode] = useState('380051 (SG Highway, Ahmedabad)');
  const [localJoiningsL1, setLocalJoiningsL1] = useState(25);
  const [showTable, setShowTable] = useState(false);

  const HeadingTag = isPage ? 'h1' : 'h2';

  // Joining referral rewards (per member registration in selected pincode)
  const joiningRates = [
    { level: 1, label: 'Level 1 (Direct Referrals)', amount: 20, multiplier: 1 },
    { level: 2, label: 'Level 2 (Friends of Friends)', amount: 10, multiplier: 3 },
    { level: 3, label: 'Level 3 (Community Joinings)', amount: 5, multiplier: 8 },
  ];

  const joiningCalc = useMemo(() => {
    const l1Count = localJoiningsL1;
    const l2Count = Math.round(l1Count * 2.5);
    const l3Count = Math.round(l2Count * 2.5);

    const l1Earn = l1Count * 20;
    const l2Earn = l2Count * 10;
    const l3Earn = l3Count * 5;
    const totalJoiningIncome = l1Earn + l2Earn + l3Earn;
    const totalLocalShoppers = l1Count + l2Count + l3Count;

    return {
      l1Count,
      l2Count,
      l3Count,
      l1Earn,
      l2Earn,
      l3Earn,
      totalJoiningIncome,
      totalLocalShoppers
    };
  }, [localJoiningsL1]);

  // Commission rates per level (% of purchase volume distributed to referrer)
  const tierRates = [
    { level: 1, label: 'Level 1 (Direct Friends)', rate: 0.05, percent: '5%' },
    { level: 2, label: 'Level 2 (Friends of Friends)', rate: 0.02, percent: '2%' },
    { level: 3, label: 'Level 3', rate: 0.015, percent: '1.5%' },
    { level: 4, label: 'Level 4', rate: 0.01, percent: '1%' },
    { level: 5, label: 'Level 5', rate: 0.008, percent: '0.8%' },
    { level: 6, label: 'Level 6', rate: 0.005, percent: '0.5%' },
    { level: 7, label: 'Level 7', rate: 0.005, percent: '0.5%' },
  ];

  // Calculate projected members and income per level
  const calculation = useMemo(() => {
    let cumulativeIncome = 0;
    let totalCommunityMembers = 0;

    const levelDetails = tierRates.map((tier, idx) => {
      const members = Math.round(directReferrals * Math.pow(Math.min(directReferrals, 2.5), idx));
      const monthlyVolume = members * avgSpend;
      const earnings = Math.round(monthlyVolume * tier.rate);
      cumulativeIncome += earnings;
      totalCommunityMembers += members;

      return {
        ...tier,
        members,
        earnings,
      };
    });

    return {
      monthlyEstimate: Math.max(cumulativeIncome, 3000),
      annualEstimate: Math.max(cumulativeIncome, 3000) * 12,
      totalCommunityMembers,
      levelDetails
    };
  }, [directReferrals, avgSpend]);

  return (
    <section className="income-opportunity-page" id="income">
      {/* Background Ambient Glows */}
      <div className="io-bg-glow glow-pink-left"></div>
      <div className="io-bg-glow glow-blue-right"></div>

      <div className="io-container">
        {/* Header Section */}
        <div className="io-header">
          <HeadingTag className="io-main-title">
            <span className="title-dark">Income </span>
            <span className="title-pink">Opportunity</span>
          </HeadingTag>
          <p className="io-subtitle">
            <span>Shop</span> &bull; <span>Refer</span> &bull; <span>Earn</span>
          </p>
        </div>

        {/* Central Hero Grid: Earnings Card (Left) & Growth Chart (Right) */}
        <div className="io-hero-grid">
          {/* Left: Earnings Highlight Card */}
          <div className="io-earnings-card">
            <p className="card-intro">
              By simply shopping<br />
              and referring others
            </p>
            <h3 className="card-earn-title">Earn</h3>
            <div className="card-amount-block">
              <span className="amount-val-1">&#8377;30,000</span>
              <span className="amount-to">to</span>
            </div>
            <div className="card-amount-big">
              <span className="amount-val-2">&#8377;3,00,000</span>
            </div>
            <p className="card-period">per month</p>
          </div>

          {/* Right: 5 Ascending Bars & Sweeping Growth Arrow */}
          <div className="io-chart-wrapper">
            <svg className="io-chart-svg" viewBox="0 0 380 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Vibrant Sweeping Arrow Gradient matching WOMUP original */}
                <linearGradient id="chartArrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff2a85" />
                  <stop offset="35%" stopColor="#db2777" />
                  <stop offset="70%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>

                <linearGradient id="arrowHeadGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>

                {/* Bar 1: Amber Glow */}
                <linearGradient id="bar1Grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fba81f" />
                  <stop offset="60%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>

                {/* Bar 2: Coral Crimson Glow */}
                <linearGradient id="bar2Grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="60%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>

                {/* Bar 3: Hot Pink Magenta Glow */}
                <linearGradient id="bar3Grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="60%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#db2777" />
                </linearGradient>

                {/* Bar 4: Electric Violet Purple Glow */}
                <linearGradient id="bar4Grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="60%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>

                {/* Bar 5: Deep Royal Blue Glow */}
                <linearGradient id="bar5Grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="60%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>

                {/* Smooth drop shadow for bars */}
                <filter id="barShadow" x="-20%" y="-10%" width="140%" height="130%" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.08" />
                </filter>

                {/* Arrow Luminous Glow */}
                <filter id="arrowGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#7c3aed" floodOpacity="0.25" />
                </filter>

                {/* Soft ground reflection */}
                <radialGradient id="baseGlowGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* GROUND REFLECTION / AMBIENT SHADOW */}
              <ellipse cx="180" cy="292" rx="140" ry="8" fill="url(#baseGlowGrad)" />

              {/* LAYER 1: SWEEPING CURVED ARROW IN BACKGROUND */}
              <g filter="url(#arrowGlow)">
                {/* Smooth curved shaft */}
                <path 
                  d="M 16 220 C 70 212, 175 168, 296 66" 
                  stroke="url(#chartArrowGrad)" 
                  strokeWidth="16" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="none" 
                  className="chart-arrow-path"
                />
                {/* Bold majestic Arrowhead pointing northeast */}
                <path 
                  d="M 334 26 L 320 80 L 302 59 L 278 47 Z" 
                  fill="url(#arrowHeadGrad)" 
                  className="chart-arrow-head"
                />
              </g>

              {/* LAYER 2: 5 ASCENDING PILL BARS IN FOREGROUND */}
              <g filter="url(#barShadow)">
                {/* Bar 1: Amber */}
                <rect x="58" y="222" width="38" height="66" rx="9" fill="url(#bar1Grad)" className="chart-bar bar-1" />
                {/* Bar 2: Coral */}
                <rect x="110" y="184" width="38" height="104" rx="9" fill="url(#bar2Grad)" className="chart-bar bar-2" />
                {/* Bar 3: Pink */}
                <rect x="162" y="144" width="38" height="144" rx="9" fill="url(#bar3Grad)" className="chart-bar bar-3" />
                {/* Bar 4: Violet */}
                <rect x="214" y="104" width="38" height="184" rx="9" fill="url(#bar4Grad)" className="chart-bar bar-4" />
                {/* Bar 5: Royal Blue */}
                <rect x="266" y="64" width="38" height="224" rx="9" fill="url(#bar5Grad)" className="chart-bar bar-5" />
              </g>
            </svg>
          </div>
        </div>

        {/* SELECTED PINCODE OPERATIONAL RULE NOTICE */}
        <div className="io-pincode-rule-alert">
          <div className="pincode-alert-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="pincode-alert-content">
            <h4 className="pincode-alert-title">Important Pincode-Specific Referral Policy</h4>
            <p className="pincode-alert-text">
              Referral joining income (<strong>&#8377;20</strong> on Level 1, <strong>&#8377;10</strong> on Level 2, and <strong>&#8377;5</strong> on Level 3) is <strong>strictly payable on verified member registrations within your selected/operational pincode area</strong>. New registrations automatically tag to the member's device location for local community integrity.
            </p>
          </div>
        </div>

        {/* 3 JOINING REWARD CARDS */}
        <div className="io-joining-cards-row">
          <div className="io-join-card card-l1">
            <span className="join-badge">DIRECT REFERRAL</span>
            <div className="join-tier-num">Level 1</div>
            <div className="join-amount-display">&#8377;20</div>
            <p className="join-desc">Earned per verified joining registered within your operational pincode</p>
          </div>

          <div className="io-join-card card-l2">
            <span className="join-badge">TIER 2 REFERRAL</span>
            <div className="join-tier-num">Level 2</div>
            <div className="join-amount-display">&#8377;10</div>
            <p className="join-desc">Earned when your direct friends invite members in the designated pincode</p>
          </div>

          <div className="io-join-card card-l3">
            <span className="join-badge">COMMUNITY TIER</span>
            <div className="join-tier-num">Level 3</div>
            <div className="join-amount-display">&#8377;5</div>
            <p className="join-desc">Passive joining rewards across broader local community network in your pincode</p>
          </div>
        </div>

        {/* INTERACTIVE REFERRAL INCOME CALCULATOR (HIGH-ENGAGEMENT UX) */}
        <div className="io-calc-card">
          <div className="io-calc-header">
            <div className="io-calc-title-box">
              <span className="calc-badge">LIVE SIMULATOR</span>
              <h3 className="calc-title">Referral Income Calculator</h3>
              <p className="calc-subtitle">Simulate joining income in your selected pincode and long-term monthly shopping commissions.</p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="calc-mode-tabs">
              <button
                type="button"
                className={`calc-mode-btn ${activeTab === 'joining' ? 'active' : ''}`}
                onClick={() => setActiveTab('joining')}
              >
                Pincode Joining Income (&#8377;20 / &#8377;10 / &#8377;5)
              </button>
              <button
                type="button"
                className={`calc-mode-btn ${activeTab === 'monthly' ? 'active' : ''}`}
                onClick={() => setActiveTab('monthly')}
              >
                Monthly Shopping Volume (7 Tiers)
              </button>
            </div>
          </div>

          <div className="io-calc-body">
            {activeTab === 'joining' ? (
              /* TAB 1: PINCODE JOINING REWARDS */
              <div className="calc-tab-content">
                <div className="calc-control-group">
                  <div className="control-label-row">
                    <span className="control-label">Your Operational Pincode:</span>
                    <span className="control-value-highlight">{selectedPincode}</span>
                  </div>
                  <div className="calc-pincode-picker">
                    {['380051 (SG Highway)', '380015 (Satellite)', '382350 (Nikol)', '384002 (Mahesana)'].map((pin) => (
                      <button
                        key={pin}
                        type="button"
                        className={`spend-pill ${selectedPincode.startsWith(pin.slice(0, 6)) ? 'spend-active' : ''}`}
                        onClick={() => setSelectedPincode(pin)}
                      >
                        {pin}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="calc-control-group">
                  <div className="control-label-row">
                    <span className="control-label">Direct Referrals in this Pincode (Level 1):</span>
                    <span className="control-value-highlight">{localJoiningsL1} Members (&#8377;20 each)</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="100" 
                    step="5"
                    value={localJoiningsL1}
                    onChange={(e) => setLocalJoiningsL1(Number(e.target.value))}
                    className="calc-range-slider"
                    aria-label="Local joinings slider"
                  />
                  <div className="slider-ticks">
                    <span>5</span>
                    <span>20</span>
                    <span>40</span>
                    <span>60</span>
                    <span>80</span>
                    <span>100+</span>
                  </div>
                </div>

                {/* Live Joining Result Banner */}
                <div className="calc-result-banner">
                  <div className="result-item">
                    <span className="res-label">Direct Joining Income (L1)</span>
                    <span className="res-amount pink">&#8377;{joiningCalc.l1Earn.toLocaleString('en-IN')}</span>
                    <span className="res-sub">{joiningCalc.l1Count} members &times; &#8377;20</span>
                  </div>
                  <div className="result-divider"></div>
                  <div className="result-item">
                    <span className="res-label">Tier 2 &amp; 3 Network Bonus</span>
                    <span className="res-amount purple">&#8377;{(joiningCalc.l2Earn + joiningCalc.l3Earn).toLocaleString('en-IN')}</span>
                    <span className="res-sub">&#8377;10/mbr (L2) + &#8377;5/mbr (L3)</span>
                  </div>
                  <div className="result-divider"></div>
                  <div className="result-item">
                    <span className="res-label">Total Pincode Joining Bonus</span>
                    <span className="res-amount blue">&#8377;{joiningCalc.totalJoiningIncome.toLocaleString('en-IN')}</span>
                    <span className="res-sub">Across {joiningCalc.totalLocalShoppers} local residents</span>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB 2: MONTHLY SHOPPING REPURCHASE COMMISSIONS */
              <div className="calc-tab-content">
                <div className="calc-control-group">
                  <div className="control-label-row">
                    <span className="control-label">People You Refer Directly:</span>
                    <span className="control-value-highlight">{directReferrals} Friends</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="8" 
                    step="1"
                    value={directReferrals}
                    onChange={(e) => setDirectReferrals(Number(e.target.value))}
                    className="calc-range-slider"
                    aria-label="Direct referrals slider"
                  />
                  <div className="slider-ticks">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                    <span>8+</span>
                  </div>
                </div>

                <div className="calc-control-group">
                  <div className="control-label-row">
                    <span className="control-label">Average Monthly Shopping per Member:</span>
                    <span className="control-value-highlight">&#8377;{avgSpend.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="calc-spend-pills">
                    {[1500, 3000, 5000].map((spend) => (
                      <button
                        key={spend}
                        type="button"
                        className={`spend-pill ${avgSpend === spend ? 'spend-active' : ''}`}
                        onClick={() => setAvgSpend(spend)}
                      >
                        &#8377;{spend.toLocaleString('en-IN')} / mo
                      </button>
                    ))}
                  </div>
                </div>

                <div className="calc-result-banner">
                  <div className="result-item">
                    <span className="res-label">Estimated Monthly Income</span>
                    <span className="res-amount pink">&#8377;{calculation.monthlyEstimate.toLocaleString('en-IN')}</span>
                    <span className="res-sub">paid directly to your bank account</span>
                  </div>
                  <div className="result-divider"></div>
                  <div className="result-item">
                    <span className="res-label">Annual Extra Earnings</span>
                    <span className="res-amount purple">&#8377;{calculation.annualEstimate.toLocaleString('en-IN')}</span>
                    <span className="res-sub">plus &#8377;24,000/yr guaranteed shopping coins</span>
                  </div>
                  <div className="result-divider"></div>
                  <div className="result-item">
                    <span className="res-label">7-Level Network Size</span>
                    <span className="res-amount blue">{calculation.totalCommunityMembers.toLocaleString('en-IN')}</span>
                    <span className="res-sub">active shoppers across India</span>
                  </div>
                </div>
              </div>
            )}

            {/* Toggle Level Breakdown Table */}
            <div className="calc-table-toggle-wrap">
              <button 
                type="button" 
                className="btn-toggle-table"
                onClick={() => setShowTable(!showTable)}
              >
                {showTable ? 'Hide 7-Level Tier Breakdown ?' : 'View 7-Level Tier Breakdown ?'}
              </button>
            </div>

            {showTable && (
              <div className="calc-table-container">
                <table className="calc-table">
                  <thead>
                    <tr>
                      <th>Tier Level</th>
                      <th>Commission %</th>
                      <th>Shoppers</th>
                      <th>Monthly Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculation.levelDetails.map((tier) => (
                      <tr key={tier.level}>
                        <td><strong>Level {tier.level}</strong></td>
                        <td><span className="pct-tag">{tier.percent}</span></td>
                        <td>{tier.members.toLocaleString('en-IN')} members</td>
                        <td className="earning-cell">&#8377;{tier.earnings.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Floating Features Card (4 Columns) */}
        <div className="io-features-card-wrapper">
          <div className="io-features-card">
            {/* Feature 1: 7 Level Referral Income */}
            <div className="io-feature-col">
              <div className="io-icon-box icon-purple">
                <svg viewBox="0 0 54 54" fill="currentColor">
                  <circle cx="27" cy="19" r="6" />
                  <path d="M17 38c0-5 4.5-9 10-9s10 4 10 9v2H17v-2z" />
                  <circle cx="14" cy="22" r="4.5" />
                  <path d="M6 38c0-3.8 3.5-7 7.5-7 .8 0 1.6.1 2.3.4-.6 1.3-1 2.8-1 4.6v2H6v-2z" />
                  <circle cx="40" cy="22" r="4.5" />
                  <path d="M48 38c0-3.8-3.5-7-7.5-7-.8 0-1.6.1-2.3.4.6 1.3 1 2.8 1 4.6v2h8v-2z" />
                </svg>
              </div>
              <div className="io-feature-text">
                <span className="line-1">7 Level</span>
                <span className="line-2">Referral Income</span>
              </div>
            </div>

            <div className="io-divider"></div>

            {/* Feature 2: No Investment Required */}
            <div className="io-feature-col">
              <div className="io-icon-box icon-red">
                <svg viewBox="0 0 54 54" fill="none">
                  <circle cx="27" cy="27" r="21" stroke="#ef4444" strokeWidth="3.5" />
                  <line x1="12" y1="12" x2="42" y2="42" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M21 21h12M21 25.5h10c2.2 0 4-1.2 4-3s-1.8-3-4-3H21M21 25.5l10 10.5" stroke="#ef4444" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="io-feature-text">
                <span className="line-1">No Investment</span>
                <span className="line-2">Required</span>
              </div>
            </div>

            <div className="io-divider"></div>

            {/* Feature 3: Only Real Purchases */}
            <div className="io-feature-col">
              <div className="io-icon-box icon-orange">
                <svg viewBox="0 0 54 54" fill="none">
                  <path d="M10 16h6l4.5 18h19.5l4-14H18" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="23" y="19" width="10" height="9" rx="2" fill="#f97316" />
                  <path d="M26 19v-2.5c0-1.2 1-2 2-2s2 .8 2 2V19" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="22.5" cy="40.5" r="3.5" fill="#f97316" />
                  <circle cx="37.5" cy="40.5" r="3.5" fill="#f97316" />
                </svg>
              </div>
              <div className="io-feature-text">
                <span className="line-1">Only Real</span>
                <span className="line-2">Purchases</span>
              </div>
            </div>

            <div className="io-divider"></div>

            {/* Feature 4: Long Term Income */}
            <div className="io-feature-col">
              <div className="io-icon-box icon-green">
                <svg viewBox="0 0 54 54" fill="none">
                  <rect x="12" y="30" width="7" height="15" rx="2.5" fill="#16a34a" />
                  <rect x="23.5" y="23" width="7" height="22" rx="2.5" fill="#16a34a" />
                  <rect x="35" y="14" width="7" height="31" rx="2.5" fill="#16a34a" />
                  <path d="M12 25L24 17L39 8.5" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polygon points="43,6 33,8 38,15" fill="#16a34a" />
                </svg>
              </div>
              <div className="io-feature-text">
                <span className="line-1">Long Term</span>
                <span className="line-2">Income</span>
              </div>
            </div>
          </div>
        </div>

        {/* Centered Action Button */}
        <div className="io-cta-wrapper">
          <button className="btn-know-more" id="knowMoreBtn" onClick={() => setIsAppModalOpen(true)}>
            <span>Join Now &amp; Start Earning</span>
            <svg className="cta-arrow" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

