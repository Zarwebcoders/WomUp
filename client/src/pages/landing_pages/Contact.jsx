import React, { useEffect } from 'react';
import ContactSection from '../../components/ContactSection';

export default function Contact() {
  useEffect(() => {
    document.title = "Contact Us - Connect with WOMUP";
  }, []);

  return (
    <main>
      <ContactSection isPage={true} />
    </main>
  );
}

