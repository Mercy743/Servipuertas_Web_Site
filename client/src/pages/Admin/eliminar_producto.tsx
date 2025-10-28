import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

const EliminarProducto: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const productoFromState = location.state?.producto;
    
    if (productoFromState) {
      setProducto(productoFromState);
      setLoading(false);
    } else {
      cargarProductos();
    }
  }, [location]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/productos');
      
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      } else {
        alert('Error al cargar productos');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || producto.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const seleccionarProducto = (productoSeleccionado: Producto) => {
    setProducto(productoSeleccionado);
  };

  const eliminarProducto = async () => {
    if (!producto) return;
    
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar el producto "${producto.nombre}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmar) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/productos/${producto.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error del servidor');
      }

      await response.json();
      alert('✅ Producto eliminado exitosamente');
      navigate('/admin/menu-producto');
      
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('❌ Error al eliminar producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <div className="header-container">
          <Link to="/admin/menu-producto" className="logo">
            <img src="/favicon.ico" alt="Logo Servipuertas" className="logo-img" />
            <span className="logo-text">Servipuertas Morelia</span>
          </Link>
          <nav className="nav">
            <ul>
              <li><Link to="/admin/menu-producto" className="nav-link active">Menú Principal</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <h1 className="page-title">Eliminar Producto</h1>

        {!producto ? (
          // LISTA PARA SELECCIONAR PRODUCTO
          <div className="form-container">
            <div style={{
              textAlign: 'center', 
              color: '#d32f2f',
              marginBottom: '2rem', 
              fontSize: '1.2rem',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #ffe8e8, #ffffff)',
              padding: '1.2rem 2.5rem',
              borderRadius: '15px',
              border: '2px solid #d32f2f',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
              display: 'inline-block',
              marginLeft: '50%',
              transform: 'translateX(-50%)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
                Selecciona un producto para eliminar
            </div>

            {/* BUSCAR Y FILTRAR */}
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
                <option value="puertas-aluminio">Puertas de Aluminio</option>
                <option value="puertas-hierro">Puertas de Hierro</option>
                <option value="portones">Portones</option>
                <option value="ventanas">Ventanas</option>
                <option value="herrajes">Herrajes</option>
                <option value="accesorios">Accesorios</option>
              </select>
            </div>

            {/* LISTA DE PRODUCTOS */}
            <div style={{maxHeight: '400px', overflowY: 'auto', marginBottom: '2rem'}}>
              {productosFiltrados.length === 0 ? (
                <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
                  {productos.length === 0 ? 'No hay productos registrados' : 'No se encontraron productos'}
                </div>
              ) : (
                productosFiltrados.map(producto => (
                  <div 
                    key={producto.id}
                    style={{
                      padding: '1rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      marginBottom: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: '#f8f9fa'
                    }}
                    onClick={() => seleccionarProducto(producto)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ffe8e8';
                      e.currentTarget.style.borderColor = '#d32f2f';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8f9fa';
                      e.currentTarget.style.borderColor = '#e0e0e0';
                    }}
                  >
                    <div style={{fontWeight: 'bold', color: '#d32f2f'}}>{producto.nombre}</div>
                    <div style={{color: '#666', fontSize: '0.9rem'}}>
                      Categoría: {producto.categoria} | Marca: {producto.marca || 'N/A'} | 
                      Precio: {producto.precio_tipo === 'a_tratar' ? 'A tratar' : `$${Number(producto.precio).toLocaleString()}`}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="button-group">
              <Link to="/admin/menu-producto" className="btn btn-secondary">
                Cancelar
              </Link>
            </div>
          </div>
        ) : (
          // CONFIRMACIÓN DE ELIMINACIÓN
          <div className="form-container delete-container">
            <div className="warning-icon">⚠️</div>
            
            <h2 className="delete-title">¿Estás seguro de que deseas eliminar este producto?</h2>
            <p className="delete-warning">Esta acción no se puede deshacer.</p>

            <div className="product-info">
              <div className="info-row">
                <span className="info-label">Nombre:</span>
                <span className="info-value">{producto.nombre}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Categoría:</span>
                <span className="info-value">{producto.categoria}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Marca:</span>
                <span className="info-value">{producto.marca || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Precio:</span>
                <span className="info-value">
                  {producto.precio_tipo === 'a_tratar' ? 'A tratar' : `$${Number(producto.precio).toLocaleString()} MXN`}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Stock:</span>
                <span className="info-value">{producto.stock} unidades</span>
              </div>
              <div className="info-row">
                <span className="info-label">Descripción:</span>
                <span className="info-value">{producto.descripcion || 'Sin descripción'}</span>
              </div>
            </div>

            <div className="button-group">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setProducto(null)}
              >
                ← Seleccionar otro producto
              </button>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={eliminarProducto}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Eliminando...' : 'Eliminar Producto'}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-info">
              <p>&copy; 2025 Servipuertas Morelia. Todos los derechos reservados.</p>
            </div>
            <div className="footer-links">
              <Link to="/admin/menu-producto">Menú Principal</Link>
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

export default EliminarProducto;