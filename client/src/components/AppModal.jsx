import React, { useState, useEffect } from 'react';
import { useModal } from '../context/ModalContext';
import API_URL from '../config/api';

export default function AppModal() {
  const { isAppModalOpen, closeAppModal, showToast } = useModal();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    area: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAppModalOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAppModalOpen]);

  if (!isAppModalOpen) return null;

  const handleClose = () => {
    closeAppModal();
    // Reset state after transition
    setTimeout(() => {
      setIsSuccess(false);
      setErrorMsg('');
      setFormData({
        name: '',
        email: '',
        mobile: '',
        city: '',
        area: '',
      });
    }, 250);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numbersOnly }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!formData.mobile || formData.mobile.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.city.trim()) {
      setErrorMsg('Please enter your city.');
      return;
    }

    if (!formData.area.trim()) {
      setErrorMsg('Please enter your area / locality.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const endpoint = `${API_URL}/api/leads`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          mobile: formData.mobile.trim(),
          city: formData.city.trim(),
          area: formData.area.trim(),
          role: 'Join as Customer',
          source: 'womup_lead_form_modal',
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSuccess(true);
        if (showToast) {
          showToast('Thank you! Your details have been saved successfully.', 'success', 5000);
        }
      } else {
        setErrorMsg(result.message || 'Failed to save your details. Please try again.');
      }
    } catch (err) {
      console.error('Lead form submission error:', err);
      setErrorMsg('Unable to connect to the server. Please check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-backdrop active minimal-modal-backdrop"
      id="appModal"
      aria-hidden="false"
      onClick={(e) => {
        if (e.target.classList.contains('modal-backdrop')) handleClose();
      }}
    >
      <div className="lead-modal-card">
        {/* Close Button */}
        <button
          className="lead-modal-close"
          onClick={handleClose}
          aria-label="Close Modal"
          type="button"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {isSuccess ? (
          /* Success Screen */
          <div className="lead-modal-success">
            <div className="lead-success-icon">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 className="lead-success-title">Thank You, {formData.name}!</h3>
            <p className="lead-success-desc">
              Your details have been successfully saved in our system. Our team will contact you shortly with platform updates and rewards.
            </p>
            <div className="lead-success-summary">
              <div className="summary-row">
                <span className="summary-lbl">Mobile:</span>
                <span className="summary-val">+91 {formData.mobile}</span>
              </div>
              <div className="summary-row">
                <span className="summary-lbl">Email:</span>
                <span className="summary-val">{formData.email}</span>
              </div>
              <div className="summary-row">
                <span className="summary-lbl">Location:</span>
                <span className="summary-val">{formData.area}, {formData.city}</span>
              </div>
            </div>
            <button
              type="button"
              className="btn-lead-done"
              onClick={handleClose}
            >
              Done &bull; Continue Browsing
            </button>
          </div>
        ) : (
          /* Lead Capture Form */
          <>
            {/* Header */}
            <div className="lead-modal-header">
              <div className="lead-logo-badge">
                <img src="/assets/new-logo.png" alt="WOMUP" className="lead-brand-logo" />
              </div>
              <h3 className="lead-modal-title">Join WOMUP</h3>
              <p className="lead-modal-subtitle">
                Enter your details to register and save up to 20% on everyday local purchases.
              </p>
            </div>

            {errorMsg && (
              <div className="lead-modal-alert">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="lead-capture-form" noValidate>
              {/* Name Field */}
              <div className="lead-input-group">
                <label htmlFor="leadName" className="lead-field-label">Name <span className="req">*</span></label>
                <div className="lead-input-wrap">
                  <span className="lead-input-icon">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="leadName"
                    name="name"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="lead-field-input"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="lead-input-group">
                <label htmlFor="leadEmail" className="lead-field-label">Email <span className="req">*</span></label>
                <div className="lead-input-wrap">
                  <span className="lead-input-icon">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="leadEmail"
                    name="email"
                    required
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="lead-field-input"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Mobile Number Field */}
              <div className="lead-input-group">
                <label htmlFor="leadMobile" className="lead-field-label">Mobile Number <span className="req">*</span></label>
                <div className="lead-input-wrap">
                  <span className="lead-prefix">+91</span>
                  <input
                    type="tel"
                    id="leadMobile"
                    name="mobile"
                    required
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={handleChange}
                    className="lead-field-input has-prefix"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* City and Area in 2 Columns */}
              <div className="lead-two-col">
                <div className="lead-input-group">
                  <label htmlFor="leadCity" className="lead-field-label">City <span className="req">*</span></label>
                  <div className="lead-input-wrap">
                    <span className="lead-input-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21h18"></path>
                        <path d="M5 21V7l8-4v18"></path>
                        <path d="M19 21V11l-6-4"></path>
                        <path d="M9 9v.01"></path>
                        <path d="M9 12v.01"></path>
                        <path d="M9 15v.01"></path>
                        <path d="M9 18v.01"></path>
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="leadCity"
                      name="city"
                      required
                      placeholder="e.g., Ahmedabad"
                      value={formData.city}
                      onChange={handleChange}
                      className="lead-field-input"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="lead-input-group">
                  <label htmlFor="leadArea" className="lead-field-label">Area <span className="req">*</span></label>
                  <div className="lead-input-wrap">
                    <span className="lead-input-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="leadArea"
                      name="area"
                      required
                      placeholder="e.g., Satellite"
                      value={formData.area}
                      onChange={handleChange}
                      className="lead-field-input"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-lead-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-lead"></span>
                    <span>Saving your details...</span>
                  </>
                ) : (
                  <>
                    <span>Submit &amp; Join Now</span>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </>
                )}
              </button>

              <p className="lead-privacy-note">
                🔒 Your details are encrypted &amp; stored safely. No spam, ever.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
