import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "../../styles/form-products.css";
import { useAuth } from '../../hooks/useAuth';

const productSchema = yup.object({
  nombre: yup.string().required('El nombre del producto es requerido'),
  categoria: yup.string().required('La categoría es requerida'),
  precio: yup
    .mixed()
    .test('precio-valido', 'El precio debe ser un número positivo o "a tratar"', (value) => {
      if (value === 'a tratar' || value === 'A tratar') return true;
      if (value === '' || value === null || value === undefined) return false;
      
      const numero = Number(value);
      return !isNaN(numero) && numero >= 0;
    })
    .required('El precio es requerido'),
  stock: yup.number()
    .typeError('El stock debe ser un número')
    .integer('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo')
    .required('El stock es requerido'),
  marca: yup.string().required('La marca es requerida'),
  descripcion: yup.string().required('La descripción es requerida')
});

type FormData = {
  nombre: string;
  categoria: string;
  precio: number | string;
  stock: number;
  marca: string;
  descripcion: string;
};

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number | null;
  stock: number;
  marca: string;
  descripcion: string;
  precio_tipo: 'fijo' | 'a_tratar';
  imagen_url: string;
}

const EditarProductoAdmin: React.FC = () => {
  const { admin } = useAuth();
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
    resolver: yupResolver(productSchema) as any
  });

  useEffect(() => {
    const productoFromState = location.state?.producto;
    
    if (productoFromState) {
      setProducto(productoFromState);
      setFormValues(productoFromState);
      setLoading(false);
    } else {
      cargarProductos();
    }
  }, [location]);

  const setFormValues = (producto: Producto) => {
    setValue('nombre', producto.nombre);
    setValue('categoria', producto.categoria);
    setValue('stock', producto.stock);
    setValue('marca', producto.marca);
    setValue('descripcion', producto.descripcion);
    
    if (producto.precio_tipo === 'a_tratar') {
      setValue('precio', 'a tratar');
    } else {
      setValue('precio', producto.precio?.toString() || '');
    }
  };

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/productos');
      
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
    setFormValues(productoSeleccionado);
  };

  const onSubmit = async (data: FormData) => {
    if (!producto) return;
    
    try {
      const precioValue = data.precio;
      const isPrecioATratar = typeof precioValue === 'string' && 
                              precioValue.toLowerCase().includes('tratar');
      
      const precioTipo = isPrecioATratar ? 'a_tratar' : 'fijo';
      const precioNumerico = isPrecioATratar ? null : Number(precioValue);

      const response = await fetch(`http://localhost:3000/api/productos/${producto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: data.nombre,
          descripcion: data.descripcion,
          precio: precioNumerico,
          precio_tipo: precioTipo,
          stock: data.stock,
          imagen_url: producto.imagen_url,
          marca: data.marca,
          categoria: data.categoria
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error del servidor');
      }

      await response.json();
      alert('Producto actualizado exitosamente');
      navigate('/admin/menu-producto');
      
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      alert('Error al actualizar producto: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  if (!admin.isAuthenticated) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Verificando permisos de administrador...</p>
      </div>
    );
  }

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
      <main className="main-content">
        <h1 className="page-title">Editar Producto</h1>

        {!producto ? (
          <div className="form-container">
            <div className="selection-header">
              Selecciona un producto para editar
            </div>

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

            {/* LISTA DE PRODUCTOS CORREGIDA */}
            <div className="products-list" style={{minHeight: '300px'}}>
              {productosFiltrados.length === 0 ? (
                <div className="no-products">
                  {productos.length === 0 ? 'No hay productos registrados' : 'No se encontraron productos'}
                </div>
              ) : (
                productosFiltrados.map(producto => (
                  <div 
                    key={producto.id}
                    className="product-item"
                    onClick={() => seleccionarProducto(producto)}
                    style={{
                      display: 'block',
                      opacity: 1,
                      visibility: 'visible'
                    }}
                  >
                    <div className="product-name">{producto.nombre}</div>
                    <div className="product-details">
                      <strong>Categoría:</strong> {producto.categoria} | 
                      <strong> Marca:</strong> {producto.marca} | 
                      <strong> Precio:</strong> {producto.precio_tipo === 'a_tratar' ? 'A tratar' : `$${Number(producto.precio).toLocaleString()}`} |
                      <span className="stock-info">Stock: {producto.stock}</span>
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
          <div className="form-container">
            <p className="page-subtitle">Editando: {producto.nombre}</p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid">
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
                      {errors.nombre.message?.toString()}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="categoria">Categoría *</label>
                  <select 
                    id="categoria" 
                    {...register('categoria')}
                    className={errors.categoria ? 'error' : ''}
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="puerta">Puerta</option>
                    <option value="motor">Motor</option>
                    <option value="accesorio">Accesorio</option>
                    <option value="herrajes">Herrajes</option>
                    <option value="ventanas">Ventanas</option>
                  </select>
                  {errors.categoria && (
                    <span className="error-message">
                      {errors.categoria.message?.toString()}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="precio">Precio (MXN) *</label>
                  <input 
                    type="text" 
                    id="precio" 
                    {...register('precio')}
                    className={errors.precio ? 'error' : ''}
                    placeholder='Ej: 1500.00 o "a tratar"' 
                  />
                  {errors.precio && (
                    <span className="error-message">
                      {errors.precio.message?.toString()}
                    </span>
                  )}
                  <small className="help-text">
                    Ingrese un número (ej: 1500.00) o escriba "a tratar" para productos sin precio fijo
                  </small>
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
                      {errors.stock.message?.toString()}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="marca">Marca *</label>
                  <input 
                    type="text" 
                    id="marca" 
                    {...register('marca')}
                    className={errors.marca ? 'error' : ''}
                    placeholder="Ej: Maram, BFT, Aluminio del Norte" 
                  />
                  {errors.marca && (
                    <span className="error-message">
                      {errors.marca.message?.toString()}
                    </span>
                  )}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="descripcion">Descripción *</label>
                  <textarea 
                    id="descripcion" 
                    {...register('descripcion')}
                    className={errors.descripcion ? 'error' : ''}
                    placeholder="Descripción detallada del producto, características, beneficios, etc."
                    rows={4}
                  ></textarea>
                  {errors.descripcion && (
                    <span className="error-message">
                      {errors.descripcion.message?.toString()}
                    </span>
                  )}
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

export default EditarProductoAdmin;