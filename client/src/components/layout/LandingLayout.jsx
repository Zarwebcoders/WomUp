import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import AppModal from '../AppModal';
import VideoModal from '../VideoModal';
import SuccessModal from '../SuccessModal';
import Toast from '../Toast';
import BackToTop from '../BackToTop';
import ScrollRevealManager from '../ScrollRevealManager';

// Import all landing styles
import '../../landing_styles/allStyles.js';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function LandingLayout() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/portal-admin');

  return (
    <div className="page-wrapper womup-landing-theme">
      <ScrollToTop />
      <ScrollRevealManager />
      {!isAdminRoute && <Navbar />}

      <Outlet />

      {!isAdminRoute && <Footer />}

      {/* Global Modals & Notifications */}
      <AppModal />
      <VideoModal />
      <SuccessModal />
      <Toast />
      <BackToTop />
    </div>
  );
}
