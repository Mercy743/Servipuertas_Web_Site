import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import "../../styles/form-products.css";

interface FormData {
  producto_id: number;
}

const eliminar_producto: React.FC = () => {
  const { 
    handleSubmit,
    formState: { isSubmitting } 
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      console.log('Producto a eliminar:', data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('✅ Producto eliminado exitosamente');
      
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('❌ Error al eliminar producto');
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
        <h1 className="page-title">Eliminar Producto</h1>

        <div className="form-container delete-container">
          <div className="warning-icon">⚠️</div>
          
          <h2 className="delete-title">¿Estás seguro de que deseas eliminar este producto?</h2>
          <p className="delete-warning">Esta acción no se puede deshacer.</p>

          <div className="product-info">
            <div className="info-row">
              <span className="info-label">Nombre:</span>
              <span className="info-value">Puerta de Aluminio Blanca</span>
            </div>
            <div className="info-row">
              <span className="info-label">Categoría:</span>
              <span className="info-value">Puertas de Aluminio</span>
            </div>
            <div className="info-row">
              <span className="info-label">Marca:</span>
              <span className="info-value">Aluminio del Norte</span>
            </div>
            <div className="info-row">
              <span className="info-label">Precio:</span>
              <span className="info-value">$1,500.00 MXN</span>
            </div>
            <div className="info-row">
              <span className="info-label">Stock:</span>
              <span className="info-value">10 unidades</span>
            </div>
            <div className="info-row">
              <span className="info-label">Descripción:</span>
              <span className="info-value">Puerta de entrada en aluminio blanco</span>
            </div>
          </div>

          <form id="deleteForm" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" id="producto_id" value="1" />

            <div className="button-group">
              <Link to="/admin/menu" className="btn btn-secondary">Cancelar</Link>
              <button 
                type="submit" 
                className="btn btn-danger"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Eliminando...' : 'Eliminar Producto'}
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

export default eliminar_producto;