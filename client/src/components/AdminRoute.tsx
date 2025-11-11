// components/AdminRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Verificando acceso administrativo...</p>
      </div>
    );
  }

  return admin.isAuthenticated ? 
    <>{children}</> : 
    <Navigate to="/admin/login" state={{ from: location }} replace />;
};

export default AdminRoute;