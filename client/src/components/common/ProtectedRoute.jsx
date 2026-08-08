import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hasRequiredRole } from '../../utils/roleCheck';
import Loader from './Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  // Not logged in
  if (!user || !role) {
    // If trying to access admin routes, go to admin login. Otherwise patient login.
    const loginPath = location.pathname.startsWith('/admin') ? '/admin/login' : '/patient/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Logged in but missing required role
  if (allowedRoles && !hasRequiredRole(role, allowedRoles)) {
    // Redirect admin to dashboard, patient to their dashboard/home
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/patient/dashboard'} replace />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;
