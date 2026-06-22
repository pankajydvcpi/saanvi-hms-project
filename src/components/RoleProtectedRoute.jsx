import React from "react";
import { Navigate } from "react-router-dom";

function RoleProtectedRoute({ children, allowedRoles }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default RoleProtectedRoute;