import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasRequiredRole } from '../utils/roleCheck';
import LoadingState from '../components/feedback/LoadingState';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState fullScreen message="Authenticating session..." />;
  }

  // Not logged in
  if (!user || !role) {
    const loginPath = location.pathname.startsWith('/admin')
      ? '/admin/login'
      : '/patient/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Logged in but missing required role
  if (allowedRoles && !hasRequiredRole(role, allowedRoles)) {
    return (
      <Navigate
        to={role === 'admin' ? '/admin/dashboard' : '/patient/appointments'}
        replace
      />
    );
  }

  // Authorized
  return children;
};

export default ProtectedRoute;
