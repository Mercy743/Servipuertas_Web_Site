import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../../styles/form-products.css";
import { useAuth } from '../../hooks/useAuth';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  marca: string;
  precio: number | null;
  precio_tipo: string;
  stock: number;
  descripcion: string;
  imagen_url: string;
}

const MenuProductoAdmin: React.FC = () => {
  const { admin } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/api/productos');
      
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      } else {
        const errorText = await response.text();
        setError(`Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError(`Error de conexión: ${error instanceof Error ? error.message : 'Desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar el producto "${nombre}"?`)) return;

    try {
      const response = await fetch(`http://localhost:3000/api/productos/${id}`, { 
        method: 'DELETE' 
      });
      
      if (response.ok) {
        setProductos(prev => prev.filter(p => p.id !== id));
        alert(`Producto "${nombre}" eliminado exitosamente`);
      } else {
        alert('Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error eliminando producto:', error);
      alert('Error al eliminar producto');
    }
  };

  const productosFiltrados = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || producto.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalProductos = productos.length;
const totalUnidadesStock = productos.reduce((sum, producto) => sum + Number(producto.stock), 0);
const valorInventario = productos.reduce((sum, producto) => {
  // Solo productos con precio fijo contribuyen al valor
  if (producto.precio_tipo === 'fijo' && producto.precio) {
    return sum + (Number(producto.precio) * Number(producto.stock));
  }
  return sum;
}, 0);

  if (!admin.isAuthenticated) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Verificando permisos de administrador...</p>
      </div>
    );
  }

  return (
    <div>
      <main className="main-content">
        <h1 className="page-title">Panel de Administración</h1>

        {error && (
          <div className="error-message">
            <strong>Error al cargar productos:</strong>
            <p>{error}</p>
            <button 
              onClick={cargarProductos}
              className="btn-retry"
            >
              🔄 Reintentar
            </button>
          </div>
        )}

        <div className="stats-container">
          <Link to="/admin/agregar-producto" className="stat-card link-card">
            <div className="stat-number"></div>
            <div className="stat-label">Agregar Producto</div>
            <p>Crear nuevo producto en el inventario</p>
          </Link>

          <Link to="/admin/editar-producto" className="stat-card link-card">
            <div className="stat-number"></div>
            <div className="stat-label">Editar Producto</div>
            <p>Modificar información de productos</p>
          </Link>

          <Link to="/admin/eliminar-producto" className="stat-card link-card">
            <div className="stat-number"></div>
            <div className="stat-label">Eliminar Producto</div>
            <p>Remover productos del inventario</p>
          </Link>
        </div>

        <div className="table-container">
          <h2>Productos Registrados</h2>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Buscar producto por nombre..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="filter-select" 
              title="Filtrar por categoría"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              <option value="puerta">Puerta</option>
              <option value="motor">Motor</option>
              <option value="accesorio">Accesorio</option>
              <option value="herrajes">Herrajes</option>
              <option value="ventanas">Ventanas</option>
            </select>
          </div>

<div className="table-responsive">
  <table className="productos-table compact-table">
    <thead>
      <tr>
        <th className="compact-id">ID</th>
        <th className="compact-name">Nombre</th>
        <th className="compact-category">Categoría</th>
        <th className="compact-brand">Marca</th>
        <th className="compact-price">Precio</th>
        <th className="compact-stock">Stock</th>
        <th className="compact-description">Descripción</th>
        <th className="compact-actions">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={8} className="loading-cell">
            <div className="spinner"></div>
            <p>Cargando productos...</p>
          </td>
        </tr>
      ) : productosFiltrados.length === 0 ? (
        <tr>
          <td colSpan={8} className="no-data-cell">
            {productos.length === 0 ? '❌ No hay productos registrados' : '🔍 No se encontraron productos'}
          </td>
        </tr>
      ) : (
        productosFiltrados.map(producto => (
          <tr key={producto.id}>
            <td className="compact-id">{producto.id}</td>
            <td className="compact-name">
              <span className="product-name" title={producto.nombre}>
                {producto.nombre}
              </span>
            </td>
            <td className="compact-category">
              <span className="category-badge">
                {producto.categoria}
              </span>
            </td>
            <td className="compact-brand">{producto.marca}</td>
            <td className="compact-price price-cell">
              {producto.precio_tipo === 'a_tratar' ? 'A tratar' : `$${Number(producto.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
            </td>
            <td className="compact-stock">
              <span className={`stock-badge ${Number(producto.stock) > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {producto.stock}
              </span>
            </td>
            <td className="compact-description description-cell">
              {producto.descripcion ? (
                <span title={producto.descripcion}>
                  {producto.descripcion.substring(0, 25)}
                  {producto.descripcion.length > 25 && '...'}
                </span>
              ) : (
                <span className="no-description">Sin descripción</span>
              )}
            </td>
            <td className="compact-actions">
              <button 
                onClick={() => eliminarProducto(producto.id, producto.nombre)}
                className="btn-delete"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number" style={{color: '#1976d2'}}>{totalProductos}</div>
            <div className="stat-label">Total Productos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{color: '#2e7d32'}}>{totalUnidadesStock}</div>
            <div className="stat-label">Total Unidades en Stock</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{color: '#ed6c02'}}>
              ${valorInventario.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </div>
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

export default MenuProductoAdmin;