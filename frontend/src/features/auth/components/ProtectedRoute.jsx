import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { selectUser, selectToken } from "../authSlice";
import Spinner from "../../../components/ui/Spinner";

const ProtectedRoute = ({ children, roles }) => {
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const authStatus = useAppSelector((state) => state.auth.status);
  const location = useLocation();

  // While the app is checking the auth status, show a loading indicator.
  if (authStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // 1. After checking, if the user is not logged in, redirect to the login page.
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
