import React from 'react';
import { useModal } from '../context/ModalContext';

export default function SuccessModal() {
  const { successModalData, closeSuccessModal } = useModal();

  if (!successModalData) return null;

  const { name, option, mobile } = successModalData;

  return (
    <div
      className="modal-backdrop active"
      id="contactSuccessModal"
      aria-hidden="false"
      onClick={(e) => {
        if (e.target.classList.contains('modal-backdrop')) closeSuccessModal();
      }}
    >
      <div className="modal-box success-modal-box">
        <button className="modal-close" onClick={closeSuccessModal} aria-label="Close Modal">
          &times;
        </button>
        <div className="success-icon-badge">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#e60067" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 className="success-title">Thank You!</h3>
        <p className="success-desc">
          Thank you <strong>{name}</strong>! Your inquiry for <strong>{option}</strong> has been received successfully. Our WOMUP executive will get in touch with you at <strong>{mobile}</strong> shortly.
        </p>
        <button className="btn-success-close" onClick={closeSuccessModal}>
          Done
        </button>
      </div>
    </div>
  );
}

