// components/Layout/HeaderClient.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const HeaderClient: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src="/favicon.ico" alt="Logo Servipuertas" className="logo-img" />
          <span className="logo-text">Servipuertas Morelia</span>
        </Link>
        <nav className="nav">
          <ul>
            <li><Link to="/" className="nav-link">Inicio</Link></li>
            <li><Link to="/productos" className="nav-link">Productos</Link></li>
            {/* SOLO enlaces públicos - NADA de admin */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default HeaderClient;