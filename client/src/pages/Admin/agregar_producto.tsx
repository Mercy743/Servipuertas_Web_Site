import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
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
  marca: yup.string().optional().default(''),
  descripcion: yup.string().optional().default('')
});

type FormData = {
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  marca?: string;
  descripcion?: string;
};

const agregar_producto: React.FC = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<FormData>({
    resolver: yupResolver(productSchema) as any
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      console.log('Producto a agregar:', data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('✅ Producto agregado exitosamente');
      
    } catch (error) {
      console.error('Error al agregar producto:', error);
      alert('❌ Error al agregar producto');
    }
  };

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
        <h1 className="page-title">Agregar Nuevo Producto</h1>

        <div id="message" className="message"></div>

        <div className="form-container">
          <form id="productForm" onSubmit={handleSubmit(onSubmit)}>
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
                  <option value="puertas-aluminio">Puertas de Aluminio</option>
                  <option value="puertas-hierro">Puertas de Hierro</option>
                  <option value="portones">Portones</option>
                  <option value="ventanas">Ventanas</option>
                  <option value="herrajes">Herrajes</option>
                  <option value="accesorios">Accesorios</option>
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
                    {errors.precio.message?.toString()}
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
                    {errors.stock.message?.toString()}
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

              <div className="form-group full-width">
                <label htmlFor="descripcion">Descripción</label>
                <textarea 
                  id="descripcion" 
                  {...register('descripcion')}
                  placeholder="Descripción detallada del producto, características, beneficios, etc."
                  rows={4}
                ></textarea>
              </div>
            </div>

            <div className="button-group">
              <Link to="/admin/menu" className="btn btn-secondary">
                Cancelar
              </Link>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                <span>💾</span> 
                {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </div>
          </form>
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

export default agregar_producto;