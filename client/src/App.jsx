import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import Layout from './components/layout/Layout';
import LandingLayout from './components/layout/LandingLayout';

// WonUp Landing Pages
import Home from './pages/landing_pages/Home';
import HowItWorks from './pages/landing_pages/HowItWorks';
import ForCustomers from './pages/landing_pages/ForCustomers';
import ForVendors from './pages/landing_pages/ForVendors';
import ShopCategories from './pages/landing_pages/ShopCategories';
import IncomeOpportunity from './pages/landing_pages/IncomeOpportunity';
import MobileApp from './pages/landing_pages/MobileApp';
import Gallery from './pages/landing_pages/Gallery';
import Contact from './pages/landing_pages/Contact';
import Legal from './pages/landing_pages/Legal';
import WebsiteAdmin from './pages/landing_pages/Admin';

// Member & Distributor Portal Pages
import Login from './pages/Login';
import Register from './pages/Register';
import DistributerLogin from './pages/DistributerLogin';
import DistributerRegister from './pages/DistributerRegister';
import Dashboard from './pages/Dashboard';
import ReferralLink from './pages/ReferralLink';
import TeamDetails from './pages/TeamDetails';
import Packages from './pages/Packages';
import ROIIncome from './pages/ROIIncome';
import IncomePage from './pages/IncomePage';
import PurchaseHistory from './pages/PurchaseHistory';
import Profile from './pages/Profile';
import AdminPackageRequests from './pages/admin/AdminPackageRequests';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetails from './pages/admin/AdminUserDetails';
import AdminRoiManagement from './pages/admin/AdminRoiManagement';
import KycVerification from './pages/KycVerification';
import AdminKycManagement from './pages/admin/AdminKycManagement';
import AdminIncomeHistory from './pages/admin/AdminIncomeHistory';

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
          <Routes>
            {/* WonUp Promotional Website Pages (Landing Layout) */}
            <Route element={<LandingLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/index.html" element={<Home />} />
              <Route path="/landing" element={<Home />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/how-it-works.html" element={<HowItWorks />} />
              <Route path="/for-customers" element={<ForCustomers />} />
              <Route path="/for-customers.html" element={<ForCustomers />} />
              <Route path="/for-vendors" element={<ForVendors />} />
              <Route path="/for-vendors.html" element={<ForVendors />} />
              <Route path="/shop-categories" element={<ShopCategories />} />
              <Route path="/shop-categories.html" element={<ShopCategories />} />
              <Route path="/income-opportunity" element={<IncomeOpportunity />} />
              <Route path="/income-opportunity.html" element={<IncomeOpportunity />} />
              <Route path="/womup-mobile-app" element={<MobileApp />} />
              <Route path="/womup-mobile-app.html" element={<MobileApp />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery.html" element={<Gallery />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/legal.html" element={<Legal />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/contact.html" element={<Contact />} />
              <Route path="/website-admin" element={<WebsiteAdmin />} />
            </Route>

            {/* Portal Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/distributer/login" element={<DistributerLogin />} />
            <Route path="/distributer/register" element={<DistributerRegister />} />
            
            {/* Protected Portal Routes */}
            <Route element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="kyc" element={<KycVerification />} />
              <Route path="referral-link" element={<ReferralLink />} />
              <Route path="team" element={<TeamDetails />} />
              <Route path="packages" element={<Packages />} />
              <Route path="purchase-history" element={<PurchaseHistory />} />
              <Route path="roi-income" element={<ROIIncome />} />
              <Route path="level-income" element={<IncomePage type="level" />} />
              <Route path="referral-income" element={<IncomePage type="referral" />} />

              {/* Admin Only Routes */}
              <Route path="admin/package-requests" element={<AdminPackageRequests />} />
              <Route path="admin/roi-management" element={<AdminRoiManagement />} />
              <Route path="admin/users" element={<AdminUsers />} />
              <Route path="admin/users/:id" element={<AdminUserDetails />} />
              <Route path="admin/kyc" element={<AdminKycManagement />} />
              <Route path="admin/income-history" element={<AdminIncomeHistory />} />
            </Route>

            {/* Catch all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
