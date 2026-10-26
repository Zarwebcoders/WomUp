import React, { useEffect } from 'react';
import LegalSection from '../../components/LegalSection';

export default function Legal() {
  useEffect(() => {
    document.title = "WOMUP - Legal Terms, Pincode Referral & Compliance Policy";
  }, []);

  return (
    <main className="legal-page-wrapper">
      <LegalSection />
    </main>
  );
}
