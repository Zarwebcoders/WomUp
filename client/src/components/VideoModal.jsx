import React from 'react';
import { useModal } from '../context/ModalContext';

export default function VideoModal() {
  const { isVideoModalOpen, closeVideoModal } = useModal();

  if (!isVideoModalOpen) return null;

  return (
    <div
      className="modal-backdrop active"
      id="videoModal"
      aria-hidden="false"
      onClick={(e) => {
        if (e.target.classList.contains('modal-backdrop')) closeVideoModal();
      }}
    >
      <div className="modal-box">
        <button className="modal-close" onClick={closeVideoModal} aria-label="Close Modal">
          &times;
        </button>
        <div className="modal-header">
          <h3>Discover WOMUP</h3>
          <p>Save on every purchase & earn with every connection</p>
        </div>
        <div className="video-container">
          <iframe
            id="videoIframe"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&enablejsapi=1"
            title="WOMUP Introduction Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

