import React, { useEffect } from 'react';
import HowItWorksSection from '../../components/HowItWorksSection';

export default function HowItWorks() {
  useEffect(() => {
    document.title = "How It Works - WOMUP Smart Shopping Platform";
  }, []);

  return (
    <main className="how-it-works-page">
      <HowItWorksSection isPage={true} />
    </main>
  );
}

