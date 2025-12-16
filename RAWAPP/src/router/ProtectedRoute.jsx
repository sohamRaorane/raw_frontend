import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import SocketManager from "../components/SocketManager";

export default function ProtectedRoute() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <SocketManager />
      <Outlet />
    </>
  );
}
