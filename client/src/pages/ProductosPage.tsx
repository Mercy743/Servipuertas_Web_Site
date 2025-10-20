import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import "../styles/ProductsPage.css";
import { Link } from 'react-router-dom';

export const ProductsPage: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [productsToShow, setProductsToShow] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  // Evitar hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProducts = productsToShow === 0
    ? products
    : products.slice(0, productsToShow);

  const formatPrice = (price: any, precioTipo: string) => {
    if (!mounted) return 'Cargando...';

    if (precioTipo === 'a_tratar') {
      return 'A tratar';
    }

    if (!price || isNaN(Number(price))) {
      return 'Consultar';
    }

    return `$${Number(price).toLocaleString('es-MX')}`;
  };

  // No renderizar hasta que esté montado en el cliente
  if (!mounted) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
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

  if (error) {
    return (
      <div className="error-container">
        <h2>Error al cargar productos</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Nuestros Productos</h1>
          <p className="page-subtitle">Calidad y seguridad en cada puerta</p>
        </div>

        <div className="filters-section">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${productsToShow === 3 ? 'active' : ''}`}
              onClick={() => setProductsToShow(3)}
            >
              Mostrar 3
            </button>
            <button
              className={`filter-btn ${productsToShow === 5 ? 'active' : ''}`}
              onClick={() => setProductsToShow(5)}
            >
              Mostrar 5
            </button>
            <button
              className={`filter-btn ${productsToShow === 0 ? 'active' : ''}`}
              onClick={() => setProductsToShow(0)}
            >
              Mostrar Todos
            </button>
          </div>
          <div className="products-counter">
            Mostrando {filteredProducts.length} de {products.length} productos
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => {
            const displayPrice = formatPrice(product.precio, product.precio_tipo);
            const isInStock = Number(product.stock) > 0;
            const isNegotiable = product.precio_tipo === 'a_tratar';

            return (
              <div key={`product-${product.id}-${product.nombre}`} className="product-card">
                <div className="product-header">
                  <h3 className="product-name">{product.nombre}</h3>
                  {product.marca && (
                    <div className="product-marca">
                      Marca: {product.marca}
                    </div>
                  )}
                </div>

                <div className="product-image">
                  {product.imagen_url ? (
                    <img
                      src={product.imagen_url}
                      alt={product.nombre}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200/2c5530/ffffff?text=Sin+Imagen';
                      }}
                    />
                  ) : (
                    <div className="image-placeholder">
                      <span>🚪</span>
                    </div>
                  )}
                </div>

                <div className="product-info">
                  <p className="product-description">
                    {product.descripcion}
                  </p>

                  <div className="product-details">
                    <div className="detail-row">
                      <span className="detail-label">Precio:</span>
                      <div className="price-info">
                        <span className={`product-price ${isNegotiable ? 'negotiable-price' : 'fixed-price'}`}>
                          {displayPrice}
                        </span>
                        <span className="price-type">
                          {isNegotiable ? 'Precio a tratar' : 'Precio fijo'}
                        </span>
                      </div>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Disponibilidad:</span>
                      <span className={`stock-status ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
                        {isInStock ? `En stock (${product.stock})` : 'Agotado'}
                      </span>
                    </div>
                  </div>

                  <button className={`contact-button ${isNegotiable ? 'negotiable' : 'fixed'}`}>
                    {isNegotiable ? 'Solicitar Cotización' : 'Consultar Producto'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <h3>No hay productos disponibles</h3>
            <p>Pronto agregaremos nuevos productos a nuestro catálogo.</p>
          </div>
        )}
      </div>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-info">
              <p>&copy; 2025 Servipuertas Morelia. Todos los derechos reservados.</p>
            </div>

            <div className="footer-links">
              <a href="#inicio">Inicio</a>
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

export default ProductsPage;