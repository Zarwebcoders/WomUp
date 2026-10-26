import React, { useState } from 'react';
import { useModal } from '../context/ModalContext';
import API_URL from '../config/api';

export default function ContactSection({ isPage = false }) {
  const { openSuccessModal, showToast } = useModal();
  const [selectedOption, setSelectedOption] = useState('Join as Customer');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    option: 'Join as Customer',
    pincode: '',
    location: '',
    message: '',
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  const HeadingTag = isPage ? 'h1' : 'h2';

  const handlePathwaySelect = (option) => {
    setSelectedOption(option);
    setFormData(prev => ({ ...prev, option }));
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocationStatus('Detecting your location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const postcode = data.address?.postcode || '';
          const city = data.address?.city || data.address?.town || data.address?.state_district || 'Ahmedabad';
          const area = data.address?.suburb || data.address?.neighbourhood || '';
          const locString = `${area ? area + ', ' : ''}${city}`.trim();

          setFormData(prev => ({
            ...prev,
            location: locString || `GPS: ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
            pincode: postcode || prev.pincode
          }));
          setLocationStatus(`✓ Location Tagged: ${locString} ${postcode ? '(' + postcode + ')' : ''}`);
          if (showToast) {
            showToast('✓ Registration location & pincode detected via GPS!', 'success', 3500);
          }
        } catch (err) {
          setFormData(prev => ({
            ...prev,
            location: `GPS: ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`
          }));
          setLocationStatus(`✓ Geotagged: ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus('Please enable location on your device to auto-detect.');
        if (showToast) {
          showToast('Please enable device location to auto-detect your area.', 'info', 4000);
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'option') {
      setSelectedOption(value);
    }
    if (feedback.text) {
      setFeedback({ text: '', type: '' });
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = formData.name.trim();
    const mobile = formData.mobile.replace(/\D/g, '');
    const option = formData.option;
    const message = formData.message.trim();

    if (!name) {
      setFeedback({ text: 'Please enter your name.', type: 'error' });
      return;
    }

    if (!mobile || mobile.length !== 10) {
      setFeedback({ text: 'Please enter a valid 10-digit mobile number.', type: 'error' });
      return;
    }

    if (!message) {
      setFeedback({ text: 'Please enter your message.', type: 'error' });
      return;
    }

    setFeedback({ text: '', type: '' });
    setIsSubmitting(true);

    const endpoint = `${API_URL}/api/leads`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          mobile,
          role: option,
          pincode: formData.pincode || '',
          location: formData.location || '',
          message,
          source: 'womup_landing_page',
          createdAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        // If an API endpoint exists and responded with an error
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Server returned error (${response.status})`);
      }

      // Success from live database
      openSuccessModal({ 
        name, 
        option, 
        mobile, 
        pincode: formData.pincode, 
        location: formData.location 
      });

      setFormData({ 
        name: '', 
        mobile: '', 
        option: selectedOption, 
        pincode: '', 
        location: '', 
        message: '' 
      });
      setLocationStatus('');
    } catch (err) {
      console.warn('API submission failed or endpoint not reached:', err);
      // If no backend is configured yet (e.g. testing locally without running backend), fallback gracefully
      if (!apiBaseUrl && (err.message.includes('404') || err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
        openSuccessModal({ 
          name, 
          option, 
          mobile, 
          pincode: formData.pincode, 
          location: formData.location 
        });
        setFormData({ 
          name: '', 
          mobile: '', 
          option: selectedOption, 
          pincode: '', 
          location: '', 
          message: '' 
        });
        setLocationStatus('');
      } else {
        setFeedback({ 
          text: `Submission error: ${err.message}. Please verify the backend connection.`, 
          type: 'error' 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-main-section" id="contact">
      <div className="contact-hero-container">

        {/* Top Header Titles */}
        <div className="contact-header-block">
          <HeadingTag className="contact-main-title">
            Be a Part of <span className="highlight-magenta">WOMUP</span>
          </HeadingTag>
          <p className="contact-subtitle">
            Together for a Smarter, Healthier and Prosperous Community
          </p>
        </div>

        {/* 3 Pathway Cards Row */}
        <div className="pathway-cards-row">
          {/* Card 1: Join as Customer */}
          <div
            className={`pathway-card pathway-customer ${selectedOption === 'Join as Customer' ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => handlePathwaySelect('Join as Customer')}
          >
            <div className="pathway-icon-box">
              <svg viewBox="0 0 32 32" className="pathway-svg svg-customer" fill="currentColor">
                <circle cx="16" cy="10" r="5" />
                <path d="M7 26C7 21 11 18 16 18C21 18 25 21 25 26V27H7V26Z" />
              </svg>
            </div>
            <div className="pathway-text-box">
              <span className="pathway-line">Join as</span>
              <span className="pathway-line bold">Customer</span>
            </div>
          </div>

          {/* Card 2: Register as Vendor */}
          <div
            className={`pathway-card pathway-vendor ${selectedOption === 'Register as Vendor' ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => handlePathwaySelect('Register as Vendor')}
          >
            <div className="pathway-icon-box">
              <svg viewBox="0 0 32 32" className="pathway-svg svg-vendor" fill="currentColor">
                <path d="M4 6H28V9H4V6Z" />
                <path d="M3 10L5 17C5.3 18.2 6.4 19 7.6 19C8.8 19 9.8 18.2 10.1 17C10.4 18.2 11.5 19 12.7 19C13.9 19 14.9 18.2 15.2 17C15.5 18.2 16.6 19 17.8 19C19 19 20 18.2 20.3 17C20.6 18.2 21.7 19 22.9 19C24.1 19 25.2 18.2 25.5 17L27.5 10H3Z" />
                <path d="M6 19V27H26V19H23V25H9V19H6Z" />
                <rect x="12" y="20" width="8" height="7" rx="1" />
              </svg>
            </div>
            <div className="pathway-text-box">
              <span className="pathway-line">Register as</span>
              <span className="pathway-line bold">Vendor</span>
            </div>
          </div>

          {/* Card 3: Explore Business Plan */}
          <div
            className={`pathway-card pathway-business ${selectedOption === 'Explore Business Plan' ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => handlePathwaySelect('Explore Business Plan')}
          >
            <div className="pathway-icon-box">
              <svg viewBox="0 0 32 32" className="pathway-svg svg-business" fill="currentColor">
                <rect x="5" y="18" width="5.5" height="10" rx="1.2" />
                <rect x="13.2" y="12" width="5.5" height="16" rx="1.2" />
                <rect x="21.5" y="6" width="5.5" height="22" rx="1.2" />
                <path d="M19 5H28V14L24.8 10.8L17.5 18.1L12.5 13.1L6.5 19.1L4.5 17.1L12.5 9.1L17.5 14.1L23.2 8.4L19 5Z" />
              </svg>
            </div>
            <div className="pathway-text-box">
              <span className="pathway-line">Explore</span>
              <span className="pathway-line bold">Business Plan</span>
            </div>
          </div>
        </div>

        {/* Lower Two-Column Section: Form (Left) & Support/Info (Right) */}
        <div className="contact-grid-row">

          {/* Left Column: Form Card */}
          <div className="contact-form-card">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  className="contact-input"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="mobile"
                  className="contact-input"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />
              </div>

              <div className="form-group select-wrapper">
                <select
                  name="option"
                  className="contact-input contact-select"
                  value={formData.option}
                  onChange={handleChange}
                  required
                >
                  <option value="Join as Customer">Join as Customer</option>
                  <option value="Register as Vendor">Register as Vendor</option>
                  <option value="Explore Business Plan">Explore Business Plan</option>
                </select>
                <div className="select-chevron-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              {/* Geolocation & Pincode Auto-Detect Row */}
              <div className="form-group location-group">
                <div className="location-input-flex">
                  <input
                    type="text"
                    name="location"
                    className="contact-input location-input"
                    placeholder="Area / City / Pincode"
                    value={formData.location}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="btn-detect-location"
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                    title="Auto-detect current location"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    <span>{isLocating ? 'Detecting...' : 'Detect GPS Location'}</span>
                  </button>
                </div>
                {locationStatus && (
                  <p className="location-status-tag">{locationStatus}</p>
                )}
                <p className="location-help-hint">
                  Turn on device location to auto-tag your registration to your local operational pincode.
                </p>
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  className="contact-input contact-textarea"
                  placeholder="Your Message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="form-group submit-group">
                <button type="submit" className="btn-contact-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>

              {feedback.text && (
                <div className={`form-feedback ${feedback.type}`} style={{ display: 'block' }}>
                  {feedback.text}
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Support Representative & Contact Info */}
          <div className="support-contact-col">

            {/* Support Representative Banner Card */}
            <div className="support-rep-card">
              <div className="support-rep-content">
                <h3 className="support-rep-title">
                  We are here<br />to help you!
                </h3>
              </div>
              <div className="support-rep-visual">
                <img
                  src="/assets/support_agent_hd.jpg"
                  alt="WOMUP Friendly Support Representative"
                  className="support-rep-img"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="contact-details-card">

              {/* Phone Row */}
              <a href="tel:8128112460" className="contact-detail-row" aria-label="Call 8128112460">
                <div className="contact-icon-bubble">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#e60067" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="contact-svg">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="contact-detail-content">
                  <span className="contact-text-value">+91 81281 12460</span>
                </div>
              </a>

              {/* Email Row */}
              <a href="mailto:womupproducts@gmail.com" className="contact-detail-row" aria-label="Email womupproducts@gmail.com">
                <div className="contact-icon-bubble">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#e60067" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="contact-svg">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </div>
                <div className="contact-detail-content">
                  <span className="contact-text-value">womupproducts@gmail.com</span>
                </div>
              </a>

              {/* Location Row */}
              <div className="contact-detail-row static-row">
                <div className="contact-icon-bubble">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#e60067" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="contact-svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="contact-detail-content">
                  <span className="contact-text-value">A-909 &amp; 910, Signature-2,<br />Nr. Sarkhej -Sanand Chokdi, SG HIGHWAY,<br />AHMEDABAD, GUJARAT 380051</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

