import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../../styles/form-products.css";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  marca: string;
  precio: number;
  precio_tipo: string;
  stock: number;
  descripcion: string;
  imagen_url: string;
}

const MenuProducto: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Cargar productos al iniciar
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/productos');
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Productos cargados:', data);
        setProductos(data);
      } else {
        const errorText = await response.text();
        console.error('Error en respuesta:', response.status, errorText);
        setError(`Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError(`Error de conexión: ${error instanceof Error ? error.message : 'Desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar producto directamente con confirmación
  const eliminarProducto = async (id: number, nombre: string) => {
    try {
      const response = await fetch(`/api/productos/${id}`, { 
        method: 'DELETE' 
      });
      
      if (response.ok) {
        setProductos(prev => prev.filter(p => p.id !== id));
        alert(`✅ Producto "${nombre}" eliminado exitosamente`);
      } else {
        alert('❌ Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error eliminando producto:', error);
      alert('❌ Error al eliminar producto');
    }
  };

  // Filtrar productos para la tabla
  const productosFiltrados = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || producto.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Calcular estadísticas
  const totalProductos = productos.length;
  const productosEnStock = productos.filter(p => Number(p.stock) > 0).length;
  const valorInventario = productos.reduce((sum, p) => sum + (Number(p.precio) * Number(p.stock)), 0);

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

        {/* MOSTRAR ERROR SI EXISTE */}
        {error && (
          <div style={{
            background: '#ffebee',
            border: '1px solid #ef5350',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            color: '#c62828'
          }}>
            <strong>Error al cargar productos:</strong>
            <p>{error}</p>
            <button 
              onClick={cargarProductos}
              style={{
                background: '#1976d2',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
            >
              🔄 Reintentar
            </button>
          </div>
        )}

        {/* OPCIONES CRUD EN TARJETAS - Estas llevan a las páginas específicas */}
        <div className="stats-container" style={{marginTop: '2rem'}}>
          <Link to="/admin/agregar-producto" className="stat-card" style={{textDecoration: 'none', cursor: 'pointer'}}>
            <div className="stat-number">➕</div>
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

        {/* TABLA DE PRODUCTOS EXISTENTES - Aquí solo se puede eliminar directamente */}
        <div className="table-container" style={{marginTop: '2rem'}}>
          <h2 style={{color: '#333', marginBottom: '1rem'}}>Productos Registrados</h2>
          
          {/* Filtros para la tabla */}
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
              <option value="motor">Motor</option>
              <option value="accesorio">Accesorio</option>
              <option value="puerta">Puerta</option>
              <option value="seguridad">Seguridad</option>
              <option value="kit">Kit</option>
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
              {loading ? (
                <tr>
                  <td colSpan={8} style={{textAlign: 'center', padding: '2rem'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
                      <div style={{
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #3498db',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        animation: 'spin 1s linear infinite'
                      }} />
                      <p>Cargando productos...</p>
                    </div>
                  </td>
                </tr>
              ) : productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{textAlign: 'center', padding: '2rem'}}>
                    {productos.length === 0 ? '❌ No hay productos registrados' : '🔍 No se encontraron productos'}
                  </td>
                </tr>
              ) : (
                productosFiltrados.map(producto => (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td style={{fontWeight: 'bold'}}>{producto.nombre}</td>
                    <td>
                      <span style={{
                        background: '#e8f5e8',
                        color: '#2e7d32',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        {producto.categoria}
                      </span>
                    </td>
                    <td>{producto.marca}</td>
                    <td style={{fontWeight: 'bold', color: '#2e7d32'}}>
                      {producto.precio_tipo === 'a_tratar' ? 'A tratar' : `${Number(producto.precio).toFixed(2)}`}
                    </td>
                    <td>
                      <span style={{
                        background: Number(producto.stock) > 0 ? '#e8f5e8' : '#ffebee',
                        color: Number(producto.stock) > 0 ? '#2e7d32' : '#c62828',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {producto.stock}
                      </span>
                    </td>
                    <td style={{maxWidth: '200px'}}>
                      {producto.descripcion ? (
                        <span title={producto.descripcion}>
                          {producto.descripcion.substring(0, 50)}...
                        </span>
                      ) : (
                        <span style={{color: '#999'}}>Sin descripción</span>
                      )}
                    </td>
                    <td>
                      {/* SOLO BOTÓN ELIMINAR DIRECTO - No hay edición aquí */}
                      <button 
                        onClick={() => {
                          if (confirm(`¿Estás seguro de eliminar el producto "${producto.nombre}"?`)) {
                            eliminarProducto(producto.id, producto.nombre);
                          }
                        }}
                        style={{
                          background: '#d32f2f',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="stats-container" style={{marginTop: '2rem'}}>
          <div className="stat-card">
            <div className="stat-number" style={{color: '#1976d2'}}>{totalProductos}</div>
            <div className="stat-label">Total Productos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{color: '#2e7d32'}}>{productosEnStock}</div>
            <div className="stat-label">Productos en Stock</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{color: '#ed6c02'}}>${valorInventario.toFixed(2)}</div>
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