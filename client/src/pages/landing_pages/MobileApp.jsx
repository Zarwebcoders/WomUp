import React, { useEffect } from 'react';
import MobileAppSection from '../../components/MobileAppSection';

export default function MobileApp() {
  useEffect(() => {
    document.title = "WOMUP Mobile App - Download for Android & iOS";
  }, []);

  return (
    <main>
      <MobileAppSection isPage={true} />
    </main>
  );
}

