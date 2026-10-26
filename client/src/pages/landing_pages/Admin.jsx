import React, { useEffect } from 'react';
import AdminPortal from '../../components/AdminPortal';

export default function Admin() {
  useEffect(() => {
    document.title = "WOMUP Admin Portal - Promotion & Media Manager";
  }, []);

  return (
    <div className="admin-page-root">
      <AdminPortal />
    </div>
  );
}
