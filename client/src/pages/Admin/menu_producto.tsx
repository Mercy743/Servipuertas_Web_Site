import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/form-products.css";

const menu_producto: React.FC = () => {
  return (
    <div>
      <header className="header">
        <div className="header-container">
          <div className="logo">Servipuertas Morelia</div>
          <nav className="nav">
            <ul>
              <li><Link to="/admin/menu" className="active">Menú Principal</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="productos-header">
          <h1 className="page-title">Gestión de Productos</h1>
          <Link to="/admin/agregar-producto" className="btn btn-add">
            <span>➕</span> Agregar Producto
          </Link>
        </div>

        <div className="table-container">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Buscar producto por nombre..." 
              className="search-input" 
            />
            <select 
              className="filter-select" 
              title="Filtrar por categoría"
            >
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
                  <Link to="/admin/agregar-producto" className="btn btn-primary">
                    Agregar Primer Producto
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Total Productos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Total en Stock</div>
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
              <Link to="/admin/menu">Menú Principal</Link>
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

export default menu_producto;