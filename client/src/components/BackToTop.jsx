import React, { useState, useEffect } from 'react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentScroll = window.scrollY;
      
      if (currentScroll > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button 
      className="back-to-top-btn" 
      onClick={scrollToTop} 
      aria-label="Back to top of page"
      title="Back to Top"
    >
      <svg className="progress-ring" width="46" height="46" viewBox="0 0 46 46">
        <circle 
          className="progress-ring-bg" 
          cx="23" 
          cy="23" 
          r="19" 
          strokeWidth="3" 
          fill="none" 
        />
        <circle 
          className="progress-ring-indicator" 
          cx="23" 
          cy="23" 
          r="19" 
          strokeWidth="3.5" 
          fill="none"
          strokeDasharray="119.38"
          strokeDashoffset={119.38 - (119.38 * scrollProgress) / 100}
        />
      </svg>
      <div className="arrow-icon">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </div>
    </button>
  );
}

