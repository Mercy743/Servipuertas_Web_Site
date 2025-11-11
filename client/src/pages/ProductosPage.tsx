import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import "../styles/ProductsPage.css";
import { Link } from 'react-router-dom';

export const ProductsPage: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [productsToShow, setProductsToShow] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'scroll'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [priceFilter, setPriceFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filtrado MEJORADO - solo por nombre y marca
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Filtro por búsqueda - SOLO nombre y marca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.nombre.toLowerCase().includes(term) ||
        (product.marca && product.marca.toLowerCase().includes(term))
      );
    }
    
    // Filtro por categoría
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.categoria === selectedCategory
      );
    }
    
    // Filtro por tipo de precio
    if (priceFilter) {
      filtered = filtered.filter(product => 
        product.precio_tipo === priceFilter
      );
    }
    
    // Filtro por stock
    if (stockFilter === 'in_stock') {
      filtered = filtered.filter(product => Number(product.stock) > 0);
    } else if (stockFilter === 'out_of_stock') {
      filtered = filtered.filter(product => Number(product.stock) === 0);
    }
    
    // Ordenamiento
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.nombre.localeCompare(b.nombre);
        case 'price':
          return (a.precio || 0) - (b.precio || 0);
        case 'stock':
          return Number(b.stock) - Number(a.stock);
        default:
          return 0;
      }
    });
    
    // Limitar cantidad si es necesario
    if (productsToShow > 0) {
      filtered = filtered.slice(0, productsToShow);
    }
    
    return filtered;
  }, [products, searchTerm, selectedCategory, priceFilter, stockFilter, sortBy, productsToShow]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

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

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceFilter('');
    setStockFilter('');
    setProductsToShow(0);
  };

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

  const ProductCard = ({ product }: { product: any }) => {
    const displayPrice = formatPrice(product.precio, product.precio_tipo);
    const isInStock = Number(product.stock) > 0;
    const isNegotiable = product.precio_tipo === 'a_tratar';

    return (
      <div className="product-card">
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
            {product.descripcion || 'Sin descripción disponible'}
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
  };

  const ListProductCard = ({ product }: { product: any }) => {
    const displayPrice = formatPrice(product.precio, product.precio_tipo);
    const isInStock = Number(product.stock) > 0;
    const isNegotiable = product.precio_tipo === 'a_tratar';

    return (
      <div className="product-list-item">
        <div className="list-item-image">
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

        <div className="list-item-content">
          <div className="list-item-header">
            <h3 className="list-item-name">{product.nombre}</h3>
            {product.marca && (
              <div className="list-item-marca">
                Marca: {product.marca}
              </div>
            )}
          </div>

          <p className="list-item-description">
            {product.descripcion || 'Sin descripción disponible'}
          </p>

          <div className="list-item-details">
            <div className="list-detail">
              <span className="detail-label">Precio</span>
              <span className={`detail-value ${isNegotiable ? 'negotiable-price' : 'fixed-price'}`}>
                {displayPrice}
              </span>
              <span className="detail-label">
                {isNegotiable ? 'Precio a tratar' : 'Precio fijo'}
              </span>
            </div>

            <div className="list-detail">
              <span className="detail-label">Disponibilidad</span>
              <span className={`stock-status ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
                {isInStock ? `En stock (${product.stock})` : 'Agotado'}
              </span>
            </div>

            <div className="list-detail">
              <span className="detail-label">Categoría</span>
              <span className="detail-value">{product.categoria}</span>
            </div>
          </div>

          <div className="list-item-actions">
            <button className={`contact-button ${isNegotiable ? 'negotiable' : 'fixed'}`}>
              {isNegotiable ? 'Solicitar Cotización' : 'Consultar Producto'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Nuestros Productos</h1>
          <p className="page-subtitle">Calidad y seguridad en cada puerta</p>
        </div>

        {/* Sistema de Filtros y Búsqueda Mejorado */}
        <div className="filters-container">
          <div className="search-section">
            <div className="search-box">
              <span className="search-icon"></span>
              <input 
                type="text" 
                className="search-input"
                placeholder="Buscar por nombre o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <span>⏹️</span> Cuadrícula
              </button>
              <button 
                className={`view-btn ${viewMode === 'scroll' ? 'active' : ''}`}
                onClick={() => setViewMode('scroll')}
              >
                <span>↔️</span> Horizontal
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <span>📋</span> Lista
              </button>
            </div>
          </div>
          
          <div className="filters-section">
            <div className="filter-group">
              <label className="filter-label">Categoría</label>
              <select 
                className="filter-select" 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                <option value="puerta">Puertas</option>
                <option value="motor">Motores</option>
                <option value="accesorio">Accesorios</option>
                <option value="herrajes">Herrajes</option>
                <option value="ventanas">Ventanas</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Tipo de Precio</label>
              <select 
                className="filter-select" 
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="">Todos los precios</option>
                <option value="fijo">Precio fijo</option>
                <option value="a_tratar">Precio a tratar</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Disponibilidad</label>
              <select 
                className="filter-select" 
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="in_stock">En stock</option>
                <option value="out_of_stock">Agotados</option>
              </select>
            </div>
            
            <div className="filter-actions">
              <button className="btn btn-primary" onClick={clearFilters}>
                🔄 Limpiar Filtros
              </button>
            </div>
          </div>

          {/* Filtros Rápidos */}
          <div className="quick-filters">
            <button 
              className={`quick-filter ${productsToShow === 3 ? 'active' : ''}`}
              onClick={() => setProductsToShow(3)}
            >
              Mostrar 3
            </button>
            <button 
              className={`quick-filter ${productsToShow === 6 ? 'active' : ''}`}
              onClick={() => setProductsToShow(6)}
            >
              Mostrar 6
            </button>
            <button 
              className={`quick-filter ${productsToShow === 0 ? 'active' : ''}`}
              onClick={() => setProductsToShow(0)}
            >
              Mostrar Todos
            </button>
          </div>
        </div>

        {/* Controles de Productos */}
        <div className="products-controls">
          <div className="results-info">
            Mostrando {filteredProducts.length} de {products.length} productos
            {searchTerm && ` para "${searchTerm}"`}
            {selectedCategory && ` en ${selectedCategory}`}
          </div>
          <div className="sort-options">
            <span className="sort-label">Ordenar por:</span>
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="name">Nombre A-Z</option>
              <option value="price">Precio: Menor a Mayor</option>
              <option value="stock">Stock: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Vista de Scroll Horizontal */}
        <div className={`horizontal-view ${viewMode === 'scroll' ? 'active' : ''}`}>
          <div className="scroll-container">
            <div className="scroll-header">
              <h3 className="scroll-title">Productos Destacados</h3>
              <div className="scroll-nav">
                <button className="nav-btn" onClick={scrollLeft}>‹</button>
                <button className="nav-btn" onClick={scrollRight}>›</button>
              </div>
            </div>
            <div className="products-scroll" ref={scrollContainerRef}>
              {filteredProducts.map((product) => (
                <div key={product.id} className="scroll-product-card">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vista de Cuadrícula */}
        <div className={`products-grid ${viewMode === 'grid' ? 'active' : ''}`} 
             style={{display: viewMode === 'grid' ? 'grid' : 'none'}}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Vista de Lista */}
        <div className={`products-list ${viewMode === 'list' ? 'active' : ''}`} 
             style={{display: viewMode === 'list' ? 'flex' : 'none'}}>
          {filteredProducts.map((product) => (
            <ListProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <h3>No se encontraron productos</h3>
            <p>Intenta ajustar los filtros de búsqueda o limpiar los filtros actuales.</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Limpiar Filtros
            </button>
          </div>
        )}

        {/* Paginación Simple */}
        {filteredProducts.length > 0 && (
          <div className="pagination">
            <button className="page-btn active">1</button>
            {filteredProducts.length > 8 && <button className="page-btn">2</button>}
            {filteredProducts.length > 16 && <button className="page-btn">3</button>}
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