import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import CitizenLayout from "../layouts/CitizenLayout";
import GovernmentLayout from "../layouts/GovernmentLayout";
import AdminLayout from "../layouts/AdminLayout";

import LandingPage from "../pages/landing/LandingPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOTP from "../pages/auth/VerifyOTP";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Citizen / Public Pages
import Dashboard from "../pages/citizen/Dashboard";
import Search from "../pages/citizen/Search";
import PolicyDetails from "../pages/citizen/PolicyDetails";
import SchemeDetails from "../pages/citizen/SchemeDetails";
import Eligibility from "../pages/citizen/Eligibility";
import Compare from "../pages/citizen/Compare";
import SavedPolicies from "../pages/citizen/SavedPolicies";
import Notifications from "../pages/citizen/Notifications";
import Profile from "../pages/citizen/Profile";
import Feedback from "../pages/citizen/Feedback";

// Government Pages
import GovDashboard from "../pages/government/Dashboard";
import GovPolicies from "../pages/government/Policies";
import GovSchemes from "../pages/government/Schemes";
import GovApprovals from "../pages/government/Approvals";
import GovReports from "../pages/government/Reports";
import GovFeedback from "../pages/government/Feedback";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminLogs from "../pages/admin/Logs";

// Route Guard
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/policies" element={<Search />} />
        <Route path="/policies/:id" element={<PolicyDetails />} />
        <Route path="/schemes" element={<Search />} />
        <Route path="/schemes/:id" element={<SchemeDetails />} />
        <Route path="/eligibility" element={<Eligibility />} />
        <Route path="/feedback" element={<Feedback />} />
      </Route>

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected Citizen Routes */}
      <Route element={<ProtectedRoute allowedRoles={["citizen", "admin", "official", "researcher", "organization"]} />}>
        <Route element={<CitizenLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/saved" element={<SavedPolicies />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Protected Government Official Routes */}
      <Route element={<ProtectedRoute allowedRoles={["official", "admin"]} />}>
        <Route element={<GovernmentLayout />}>
          <Route path="/government/dashboard" element={<GovDashboard />} />
          <Route path="/government/policies" element={<GovPolicies />} />
          <Route path="/government/schemes" element={<GovSchemes />} />
          <Route path="/government/approvals" element={<GovApprovals />} />
          <Route path="/government/reports" element={<GovReports />} />
          <Route path="/government/feedback" element={<GovFeedback />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
          {/* Re-use official management screens under admin path */}
          <Route path="/admin/policies" element={<GovPolicies />} />
          <Route path="/admin/schemes" element={<GovSchemes />} />
          <Route path="/admin/feedback" element={<GovFeedback />} />
        </Route>
      </Route>

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
