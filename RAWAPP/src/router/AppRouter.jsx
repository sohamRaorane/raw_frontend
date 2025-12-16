import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/Dashboard";
import PrivateChat from "../pages/PrivateChat";
import GroupChat from "../pages/GroupChat";
import Profile from "../pages/Profile";
import SearchPage from "../pages/SearchPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import useAuth from "../hooks/useAuth";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/chat/:id" element={
          <ProtectedRoute>
            <PrivateChat />
          </ProtectedRoute>
        } />
        <Route path="/group/:id" element={
          <ProtectedRoute>
            <GroupChat />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}
