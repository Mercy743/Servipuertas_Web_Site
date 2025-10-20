import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/form-products.css";

const MenuProducto: React.FC = () => {
  return (
    <div>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            <img 
              src="/favicon.ico" 
              alt="Logo Servipuertas" 
              className="logo-img" 
            />
            <span className="logo-text">Servipuertas Morelia</span>
          </Link>
          <nav className="nav">
            <ul>
              <li><Link to="/" className="nav-link">Inicio</Link></li>
              <li><Link to="/productos" className="nav-link">Productos</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <h1 className="page-title">Panel de Administración</h1>

        {/* OPCIONES CRUD EN TARJETAS */}
        <div className="stats-container" style={{marginTop: '2rem'}}>
          <Link to="/admin/agregar-producto" className="stat-card" style={{textDecoration: 'none', cursor: 'pointer'}}>
            <div className="stat-number">🦬</div>
            <div className="stat-label">Agregar Producto</div>
            <p style={{color: '#666', fontSize: '0.9rem', marginTop: '0.5rem'}}>Crear nuevo producto en el inventario</p>
          </Link>

          <Link to="/admin/editar-producto" className="stat-card" style={{textDecoration: 'none', cursor: 'pointer'}}>
            <div className="stat-number">✏️</div>
            <div className="stat-label">Editar Producto</div>
            <p style={{color: '#666', fontSize: '0.9rem', marginTop: '0.5rem'}}>Modificar información de productos</p>
          </Link>

          <Link to="/admin/eliminar-producto" className="stat-card" style={{textDecoration: 'none', cursor: 'pointer'}}>
            <div className="stat-number">🗑️</div>
            <div className="stat-label">Eliminar Producto</div>
            <p style={{color: '#666', fontSize: '0.9rem', marginTop: '0.5rem'}}>Remover productos del inventario</p>
          </Link>
        </div>

        {/* TABLA DE PRODUCTOS EXISTENTES */}
        <div className="table-container" style={{marginTop: '2rem'}}>
          <h2 style={{color: '#333', marginBottom: '1rem'}}>Productos Registrados</h2>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Buscar producto por nombre..." 
              className="search-input" 
            />
            <select className="filter-select" title="Filtrar por categoría">
              <option value="">Todas las categorías</option>
              <option value="puertas-aluminio">Puertas de Aluminio</option>
              <option value="puertas-hierro">Puertas de Hierro</option>
              <option value="portones">Portones</option>
              <option value="ventanas">Ventanas</option>
              <option value="herrajes">Herrajes</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>

          <table className="productos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="no-results">
                  <p>No hay productos registrados</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="stats-container" style={{marginTop: '2rem'}}>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Total Productos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Productos en Stock</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">$0.00</div>
            <div className="stat-label">Valor Inventario</div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-info">
              <p>&copy; 2025 Servipuertas Morelia. Todos los derechos reservados.</p>
            </div>

            <div className="footer-links">
              <Link to="/">Inicio</Link>
              <Link to="/productos">Productos</Link>
            </div>

            <div className="footer-validators">
              <a href="https://validator.w3.org/" target="_blank" rel="noopener noreferrer">
                <img src="https://www.w3.org/Icons/valid-html401-blue" alt="HTML Válido" width="80" height="15" />
              </a>
              <a href="https://jigsaw.w3.org/css-validator/" target="_blank" rel="noopener noreferrer">
                <img src="https://jigsaw.w3.org/css-validator/images/vcss-blue" alt="CSS Válido" width="80" height="15" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MenuProducto;