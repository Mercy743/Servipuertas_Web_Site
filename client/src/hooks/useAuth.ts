// hooks/useAuth.ts (VERSIÓN SIMPLIFICADA)
import { useState, useEffect } from 'react';

interface AdminUser {
  email: string;
  nombre_completo: string;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [admin, setAdmin] = useState<AdminUser>({
    email: '',
    nombre_completo: '',
    isAuthenticated: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');
    const nombre = localStorage.getItem('adminNombre');
    
    if (token && email) {
      setAdmin({
        email,
        nombre_completo: nombre || '',
        isAuthenticated: true
      });
    }
    setLoading(false);
  };

  const login = (token: string, email: string, nombre_completo: string) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminEmail', email);
    localStorage.setItem('adminNombre', nombre_completo);
    setAdmin({ email, nombre_completo, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminNombre');
    setAdmin({ email: '', nombre_completo: '', isAuthenticated: false });
    window.location.href = '/admin/login';
  };

  return { admin, loading, login, logout, checkAuth };
};