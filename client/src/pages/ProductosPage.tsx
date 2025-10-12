import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio_referencia: number;
  stock: number;
}

const ProductosPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // CONEXIÓN A POSTGRESQL
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/productos');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error cargando productos:', error);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <section id="productos" className="section">
        <div className="container">
          <h1>Catálogo de Productos</h1>
          <table className="tabla-productos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio aproximado</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id_producto}>
                  <td>{product.id_producto}</td>
                  <td>{product.nombre}</td>
                  <td>{product.descripcion || "—"}</td>
                  <td>${product.precio_referencia}</td>
                  <td>{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`} 
        onClick={scrollToTop}
      >
        ↑
      </button>

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

export default ProductosPage;