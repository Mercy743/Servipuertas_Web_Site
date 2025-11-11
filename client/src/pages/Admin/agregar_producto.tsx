import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
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
  descripcion: yup.string().required('La descripción es requerida'),
  imagen_url: yup.string().required('La URL de la imagen es requerida').url('Debe ser una URL válida')
});

type FormData = {
  nombre: string;
  categoria: string;
  precio: number | string;
  stock: number;
  marca: string;
  descripcion: string;
  imagen_url: string;
};

const AgregarProductoAdmin: React.FC = () => {
  const { admin } = useAuth();
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    watch 
  } = useForm<FormData>({
    resolver: yupResolver(productSchema) as any
  });

  // Observar cambios en la URL de la imagen para mostrar vista previa
  const imagenUrl = watch('imagen_url');

  // Función para validar y mostrar vista previa de la imagen
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageError('');
    
    if (url) {
      const img = new Image();
      img.onload = () => {
        setImagePreview(url);
        setImageError('');
      };
      img.onerror = () => {
        setImagePreview('');
        setImageError('La URL de la imagen no es válida o no se puede cargar');
      };
      img.src = url;
    } else {
      setImagePreview('');
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // Validar que la imagen sea accesible antes de enviar
      if (data.imagen_url) {
        const img = new Image();
        img.onload = async () => {
          await submitForm(data);
        };
        img.onerror = () => {
          setImageError('No se puede acceder a la imagen. Verifica la URL.');
          return;
        };
        img.src = data.imagen_url;
      } else {
        await submitForm(data);
      }
    } catch (error) {
      console.error('Error al agregar producto:', error);
      alert('Error al agregar producto: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const submitForm = async (data: FormData) => {
    const precioValue = data.precio;
    const isPrecioATratar = typeof precioValue === 'string' && 
                            precioValue.toLowerCase().includes('tratar');
    
    const precioTipo = isPrecioATratar ? 'a_tratar' : 'fijo';
    const precioNumerico = isPrecioATratar ? null : Number(precioValue);
    
    const response = await fetch('http://localhost:3000/api/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: precioNumerico,
        precio_tipo: precioTipo,
        stock: data.stock,
        imagen_url: data.imagen_url,
        marca: data.marca,
        categoria: data.categoria
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error del servidor');
    }

    await response.json();
    alert('Producto agregado exitosamente');
    window.location.href = '/admin/menu-producto';
  };

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
        <h1 className="page-title">Agregar Nuevo Producto</h1>

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
                <label htmlFor="imagen_url">URL de la Imagen *</label>
                <input 
                  type="url" 
                  id="imagen_url" 
                  {...register('imagen_url')}
                  className={errors.imagen_url ? 'error' : ''}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  onChange={handleImageUrlChange}
                />
                {errors.imagen_url && (
                  <span className="error-message">
                    {errors.imagen_url.message?.toString()}
                  </span>
                )}
                {imageError && (
                  <span className="error-message">
                    {imageError}
                  </span>
                )}
                <small className="help-text">
                  Ingresa la URL completa de la imagen (debe ser accesible públicamente)
                </small>
              </div>

              {/* Vista previa de la imagen */}
              {imagePreview && (
                <div className="form-group full-width">
                  <label>Vista Previa de la Imagen</label>
                  <div className="image-preview-container">
                    <img 
                      src={imagePreview} 
                      alt="Vista previa" 
                      className="image-preview"
                      onError={() => setImageError('Error al cargar la imagen')}
                    />
                    <div className="image-preview-info">
                      ✅ Imagen válida - Se mostrará correctamente
                    </div>
                  </div>
                </div>
              )}

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
              <Link to="/admin/menu-producto" className="btn btn-secondary">
                Cancelar
              </Link>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting || !!imageError}
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

export default AgregarProductoAdmin;