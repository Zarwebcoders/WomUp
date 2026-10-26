import React, { useEffect } from 'react';
import ForCustomersSection from '../../components/ForCustomersSection';

export default function ForCustomers() {
  useEffect(() => {
    document.title = "For Customers - WOMUP Smart Shopping";
  }, []);

  return (
    <main>
      <ForCustomersSection isPage={true} />
    </main>
  );
}

