// components/Layout/HeaderAdmin.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const HeaderAdmin: React.FC = () => {
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/admin/menu-producto" className="logo">
          <img src="/favicon.ico" alt="Logo Servipuertas" className="logo-img" />
          <span className="logo-text">Panel Administrativo</span>
        </Link>
        <nav className="nav">
          <ul>
            <li><span style={{color: 'white', padding: '10px'}}>Hola, {admin.nombre_completo}</span></li>
            <li><Link to="/admin/menu-producto" className="nav-link">Menú Principal</Link></li>
            <li>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '2px solid white',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default HeaderAdmin;