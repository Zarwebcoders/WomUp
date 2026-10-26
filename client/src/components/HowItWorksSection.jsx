import React, { useState, useEffect } from 'react';
import { useModal } from '../context/ModalContext';

export default function HowItWorksSection({ isPage = false }) {
  const { openAppModal } = useModal();
  const [activeStep, setActiveStep] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const HeadingTag = isPage ? 'h1' : 'h2';

  const stepDetails = [
    {
      step: 1,
      title: 'Join',
      desc: 'Register on WOMUP App',
      tagline: 'Simple 1-Minute Mobile Onboarding',
      hint: 'Download the app, enter your phone number & verify with instant OTP. No paperwork, no hidden costs.'
    },
    {
      step: 2,
      title: 'Get Coins',
      desc: 'Receive ₹2,000 Shopping Coin every month',
      tagline: 'Direct Coin Credit on 1st of Month',
      hint: 'Your ₹2,000 Shopping Coins are credited automatically every single month to reduce your real shopping bill.'
    },
    {
      step: 3,
      title: 'Shop',
      desc: 'Use coins + Pay balance amount at nearby shops',
      tagline: 'Scan & Pay at 50+ Local Categories',
      hint: 'Visit your favorite local grocery, medical, salon, or vegetable store. Scan the WOMUP QR and coins auto-apply.'
    },
    {
      step: 4,
      title: 'Earn',
      desc: 'Refer others & get income up to 7 levels',
      tagline: 'True Passive Multi-Tier Income',
      hint: 'Invite friends and relatives. Whenever they shop for everyday necessities, you earn cash rewards up to 7 levels.'
    }
  ];

  // Auto-play through steps if user isn't hovering
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev % 4) + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const currentStepData = stepDetails[activeStep - 1];

  return (
    <section 
      className="how-it-works-section" 
      id="how-it-works"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Ambient Glows */}
      <div className="hiw-bg-glow glow-top-left"></div>
      <div className="hiw-bg-glow glow-top-right"></div>
      <div className="hiw-bg-glow glow-bottom-left"></div>
      <div className="hiw-bg-glow glow-bottom-right"></div>

      <div className="hiw-container">
        {/* Header Title Section */}
        <div className="hiw-header">
          <HeadingTag className="hiw-main-title">
            How <span className="title-womup">WOMUP</span> Works?
          </HeadingTag>
          <p className="hiw-subtitle">
            A simple platform connecting Customers and Local Vendors<br />
            for Smart Shopping and Earning Opportunities.
          </p>
        </div>

        {/* Center Diagram: Customer <-> Exchange Loop <-> Vendor */}
        <div className="hiw-diagram-section">
          {/* Left: Customer Circle */}
          <div className="diagram-entity customer-entity" id="customers">
            <div className="entity-circle circle-customer">
              <div className="circle-inner-bg pink-bg"></div>
              <img src="/assets/customer_user_transparent.png" alt="WOMUP Customer" className="entity-img customer-img" />
            </div>
            <div className="entity-info">
              <h3 className="entity-title customer-title">Customer</h3>
              <p className="entity-tagline">Shop &amp; Save</p>
            </div>
          </div>

          {/* Center: Circulating Arrows Ring with WOMUP Logo */}
          <div className="diagram-center-loop">
            <div className="loop-container">
              <svg className="circulating-arrows-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="topCurveGradHIW" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff1475" />
                    <stop offset="50%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="bottomCurveGradHIW" x1="100%" y1="100%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#ff1475" />
                  </linearGradient>
                </defs>
                <path d="M 28 88 A 74 74 0 0 1 172 88" stroke="url(#topCurveGradHIW)" strokeWidth="8" strokeLinecap="round" fill="none" />
                <polygon points="172,106 186,84 162,88" fill="#3b82f6" />
                <path d="M 172 112 A 74 74 0 0 1 28 112" stroke="url(#bottomCurveGradHIW)" strokeWidth="8" strokeLinecap="round" fill="none" />
                <polygon points="28,94 14,116 38,112" fill="#ff1475" />
              </svg>

              <div className="center-brand-box">
                <img src="/assets/new-logo.png" alt="WOMUP" className="center-logo-img" />
              </div>
            </div>
          </div>

          {/* Right: Vendor Circle */}
          <div className="diagram-entity vendor-entity" id="vendors">
            <div className="entity-circle circle-vendor">
              <div className="circle-inner-bg blue-bg"></div>
              <img src="/assets/vendor_shopkeeper.jpg" alt="WOMUP Vendor" className="entity-img vendor-img" />
            </div>
            <div className="entity-info">
              <h3 className="entity-title vendor-title">Vendor</h3>
              <p className="entity-tagline">Grow Business</p>
            </div>
          </div>
        </div>

        {/* Live Interactive Step Highlight Banner */}
        <div className="hiw-step-highlight-banner">
          <div className="step-highlight-left">
            <span className="step-pill">Step {currentStepData.step} of 4</span>
            <h4 className="step-highlight-title">{currentStepData.tagline}</h4>
          </div>
          <p className="step-highlight-desc">{currentStepData.hint}</p>
        </div>

        {/* 4 Step Process Cards */}
        <div className="hiw-steps-section" id="income">
          {stepDetails.map((s) => (
            <div 
              key={s.step} 
              className={`step-card ${activeStep === s.step ? 'step-active' : ''}`}
              onClick={() => setActiveStep(s.step)}
              role="button"
              tabIndex={0}
              aria-label={`Step ${s.step}: ${s.title}`}
            >
              <div className="step-badge">{s.step}</div>
              <h4 className="step-title">{s.title}</h4>
              <p className="step-description">{s.desc}</p>
              <span className="step-click-indicator">
                {activeStep === s.step ? '● Active' : 'Tap to inspect'}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Centered Action Button */}
        <div className="hiw-cta-section">
          <button className="btn-join-large" id="joinNowBtn" onClick={openAppModal}>
            Join Now
          </button>
        </div>
      </div>
    </section>
  );
}




