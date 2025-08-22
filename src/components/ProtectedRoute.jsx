import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roles = [] }) {
  // Get user from localStorage (or from Redux if you prefer)
  const user = JSON.parse(localStorage.getItem("user"));

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles array is provided, check if user's role is allowed
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

 
  return children;
}

export default ProtectedRoute;
