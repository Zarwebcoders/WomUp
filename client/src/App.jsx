import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import ReferralLink from './pages/ReferralLink';
import TeamDetails from './pages/TeamDetails';
import Packages from './pages/Packages';
import ROIIncome from './pages/ROIIncome';
import IncomePage from './pages/IncomePage';
import PurchaseHistory from './pages/PurchaseHistory';
import AdminPackageRequests from './pages/admin/AdminPackageRequests';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetails from './pages/admin/AdminUserDetails';
import AdminPackageHistory from './pages/admin/AdminPackageHistory';
import AdminRoiManagement from './pages/admin/AdminRoiManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
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
            <Route path="admin/package-history" element={<AdminPackageHistory />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
