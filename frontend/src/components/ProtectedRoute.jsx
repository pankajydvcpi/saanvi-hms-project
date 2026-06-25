import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const adminUser = localStorage.getItem("adminUser");
  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");

  if (!adminUser) {
    return <Navigate to="/register" />;
  }

  if (isAdminLoggedIn !== "true") {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;