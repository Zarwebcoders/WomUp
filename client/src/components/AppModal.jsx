import React, { useEffect } from 'react';
import { useModal } from '../context/ModalContext';

export default function AppModal() {
  const { isAppModalOpen, closeAppModal, showToast } = useModal();

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAppModalOpen) {
        closeAppModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAppModalOpen, closeAppModal]);

  if (!isAppModalOpen) return null;

  const handleDownloadApk = () => {
    if (showToast) {
      showToast('Downloading WOMUP App APK... Tap the file once downloaded to install.', 'success', 5000);
    }
  };

  return (
    <div
      className="modal-backdrop active minimal-modal-backdrop"
      id="appModal"
      aria-hidden="false"
      onClick={(e) => {
        if (e.target.classList.contains('modal-backdrop')) closeAppModal();
      }}
    >
      <div className="minimal-modal-box">
        {/* Close Button */}
        <button 
          className="minimal-close-btn" 
          onClick={closeAppModal} 
          aria-label="Close Modal"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* App Icon */}
        <div className="minimal-app-icon">
          <img src="/assets/new-logo.png" alt="WOMUP" className="minimal-logo-img" />
        </div>

        {/* Header */}
        <h3 className="minimal-modal-title">Get the WOMUP App</h3>
        <p className="minimal-modal-subtitle">
          Shop smart, save with monthly coins, and earn rewards at your nearby local stores.
        </p>

        {/* Primary CTA: Direct Download from Website (APK) */}
        <div className="direct-apk-card">
          <a
            href="/downloads/womup.apk"
            download="WOMUP.apk"
            className="btn-download-direct-apk"
            onClick={handleDownloadApk}
            id="directApkDownloadBtn"
          >
            <div className="apk-btn-icon-wrap">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <div className="apk-btn-text-wrap">
              <span className="apk-btn-badge">OFFICIAL WEBSITE DOWNLOAD</span>
              <span className="apk-btn-title">Download WOMUP App (.APK)</span>
              <span className="apk-btn-meta">Direct Android Download &bull; Fast, Safe &amp; Free</span>
            </div>
          </a>
        </div>

        <div className="modal-or-divider">
          <span>OR GET ON APP STORES</span>
        </div>

        {/* Store Download Buttons - Official Logos */}
        <div className="minimal-store-buttons">
          <a 
            href="https://play.google.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="minimal-badge-link"
            aria-label="Get it on Google Play"
          >
            <img 
              src="/assets/google-play-badge.svg" 
              alt="Get it on Google Play" 
              className="store-badge-svg"
            />
          </a>

          <a 
            href="https://apple.com/app-store" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="minimal-badge-link"
            aria-label="Download on the App Store"
          >
            <img 
              src="/assets/app-store-badge.svg" 
              alt="Download on the App Store" 
              className="store-badge-svg"
            />
          </a>
        </div>

        {/* Micro-footer */}
        <p className="minimal-modal-footer">
          Available on Android &amp; iOS &bull; Direct Website Download Enabled
        </p>
      </div>
    </div>
  );
}
