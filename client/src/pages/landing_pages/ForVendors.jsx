import React, { useEffect } from 'react';
import ForVendorsSection from '../../components/ForVendorsSection';

export default function ForVendors() {
  useEffect(() => {
    document.title = "For Vendors - Partner with WOMUP";
  }, []);

  return (
    <main>
      <ForVendorsSection isPage={true} />
    </main>
  );
}

