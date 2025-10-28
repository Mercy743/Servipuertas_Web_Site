import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "../../styles/form-products.css";

const productSchema = yup.object({
  nombre: yup.string().required('El nombre del producto es requerido'),
  categoria: yup.string().required('La categoría es requerida'),
  precio: yup.number()
    .typeError('El precio debe ser un número')
    .positive('El precio debe ser positivo')
    .required('El precio es requerido'),
  stock: yup.number()
    .typeError('El stock debe ser un número')
    .integer('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo')
    .required('El stock es requerido'),
  marca: yup.string().default(''),
  descripcion: yup.string().default('')
});

type FormData = yup.InferType<typeof productSchema>;

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  marca: string;
  descripcion: string;
  precio_tipo: string;
  imagen_url: string;
}

const EditarProducto: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<FormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      marca: '',
      descripcion: ''
    }
  });

  useEffect(() => {
    const productoFromState = location.state?.producto;
    
    if (productoFromState) {
      setProducto(productoFromState);
      setValue('nombre', productoFromState.nombre);
      setValue('categoria', productoFromState.categoria);
      setValue('precio', productoFromState.precio);
      setValue('stock', productoFromState.stock);
      setValue('marca', productoFromState.marca || '');
      setValue('descripcion', productoFromState.descripcion || '');
      setLoading(false);
    } else {
      cargarProductos();
    }
  }, [location, setValue]);

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
    setValue('nombre', productoSeleccionado.nombre);
    setValue('categoria', productoSeleccionado.categoria);
    setValue('precio', productoSeleccionado.precio);
    setValue('stock', productoSeleccionado.stock);
    setValue('marca', productoSeleccionado.marca || '');
    setValue('descripcion', productoSeleccionado.descripcion || '');
  };

  const onSubmit = async (data: FormData) => {
    if (!producto) return;
    
    try {
      const response = await fetch(`/api/productos/${producto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: data.nombre,
          descripcion: data.descripcion || '',
          precio: data.precio,
          precio_tipo: producto.precio_tipo,
          stock: data.stock,
          imagen_url: producto.imagen_url,
          marca: data.marca || '',
          categoria: data.categoria
        })
      });

      if (!response.ok) {
        throw new Error('Error del servidor');
      }

      await response.json();
      alert('✅ Producto actualizado exitosamente');
      navigate('/admin/menu-producto');
      
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      alert('❌ Error al actualizar producto');
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
        <h1 className="page-title">Editar Producto</h1>

        {!producto ? (
          // LISTA PARA SELECCIONAR PRODUCTO
          <div className="form-container">
            <div style={{
              textAlign: 'center', 
              color: '#2c5530',
              marginBottom: '2rem', 
              fontSize: '1.2rem',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #e8f5e8, #ffffff)',
              padding: '1.2rem 2.5rem',
              borderRadius: '15px',
              border: '2px solid #2c5530',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
              display: 'inline-block',
              marginLeft: '50%',
              transform: 'translateX(-50%)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
                Selecciona un producto para editar
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
                      e.currentTarget.style.background = '#e8f5e8';
                      e.currentTarget.style.borderColor = '#2c5530';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8f9fa';
                      e.currentTarget.style.borderColor = '#e0e0e0';
                    }}
                  >
                    <div style={{fontWeight: 'bold', color: '#2c5530'}}>{producto.nombre}</div>
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
          // FORMULARIO DE EDICIÓN
          <div className="form-container">
            <p className="page-subtitle">Editando: {producto.nombre}</p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Producto *</label>
                <input 
                  type="text" 
                  id="nombre" 
                  {...register('nombre')}
                  className={errors.nombre ? 'error' : ''}
                  placeholder="Ej: Puerta de Aluminio Blanca" 
                />
                {errors.nombre && (
                  <span className="error-message">
                    {errors.nombre.message}
                  </span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="categoria">Categoría *</label>
                  <select 
                    id="categoria" 
                    {...register('categoria')}
                    className={errors.categoria ? 'error' : ''}
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="puertas-aluminio">Puertas de Aluminio</option>
                    <option value="puertas-hierro">Puertas de Hierro</option>
                    <option value="portones">Portones</option>
                    <option value="ventanas">Ventanas</option>
                    <option value="herrajes">Herrajes</option>
                    <option value="accesorios">Accesorios</option>
                  </select>
                  {errors.categoria && (
                    <span className="error-message">
                      {errors.categoria.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="marca">Marca</label>
                  <input 
                    type="text" 
                    id="marca" 
                    {...register('marca')}
                    placeholder="Ej: Aluminio del Norte" 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="precio">Precio (MXN) *</label>
                  <input 
                    type="number" 
                    id="precio" 
                    step="0.01" 
                    min="0" 
                    {...register('precio')}
                    className={errors.precio ? 'error' : ''}
                    placeholder="0.00" 
                  />
                  {errors.precio && (
                    <span className="error-message">
                      {errors.precio.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Stock Disponible *</label>
                  <input 
                    type="number" 
                    id="stock" 
                    min="0" 
                    {...register('stock')}
                    className={errors.stock ? 'error' : ''}
                    placeholder="0" 
                  />
                  {errors.stock && (
                    <span className="error-message">
                      {errors.stock.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea 
                  id="descripcion" 
                  {...register('descripcion')}
                  placeholder="Descripción del producto..."
                  rows={4}
                ></textarea>
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
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Actualizando...' : 'Actualizar Producto'}
                </button>
              </div>
            </form>
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

export default EditarProducto;