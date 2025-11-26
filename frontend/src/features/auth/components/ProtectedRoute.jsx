import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { selectUser, selectToken } from "../authSlice";

const ProtectedRoute = ({ children, roles }) => {
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const location = useLocation();

  // 1. If the user is not logged in, redirect to the login page.
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If roles are required and the user's role is not in the list, redirect.
  //    This prevents unauthorized access to staff/admin pages.
  if (roles && !roles.includes(user?.role)) {
    // Redirect them to the home page if they don't have the right role.
    // You could also redirect to a specific "unauthorized" page.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 3. If all checks pass, render the requested component.
  return children;
};

export default ProtectedRoute;
