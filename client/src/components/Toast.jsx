import React from 'react';
import { useModal } from '../context/ModalContext';

export default function Toast() {
  const { toast, closeToast } = useModal();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className={`toast-notification ${isSuccess ? 'toast-success' : 'toast-info'}`}>
      <div className="toast-icon">
        {isSuccess ? (
          <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close-btn" onClick={closeToast} aria-label="Close notification">
        &times;
      </button>
    </div>
  );
}

