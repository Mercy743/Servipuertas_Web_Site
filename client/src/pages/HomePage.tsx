import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSmoothScroll, useActiveSection } from '../utils/scriptUtils'; 

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio_referencia: number;
}

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  useSmoothScroll();      // ← Navegación suave
  useActiveSection();     // ← Resaltado de menú

  // Cargar productos destacados
  useEffect(() => {
  const loadFeaturedProducts = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE}/api/productos`);
      
      if (!response.ok) throw new Error('Error al cargar productos');
      
      const data = await response.json();
      setFeaturedProducts(data.slice(0, 3));
    } catch (error) {
      console.error('Error cargando productos:', error);
      setFeaturedProducts([
        {
          id: 1,
          nombre: "Puerta Automática Residencial",
          descripcion: "Sistema automático para hogares con control remoto",
          precio_referencia: 15000
        },
        {
          id: 2,
          nombre: "Puerta Corrediza Comercial",
          descripcion: "Ideal para negocios y locales comerciales", 
          precio_referencia: 25000
        }
      ]);
    }
  };

  loadFeaturedProducts();
}, []);

  // Mostrar/ocultar botón volver arriba 
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
        {/*Bienvenida*/}
      <section id="inicio" className="section">
        <h1>Bienvenido a Servipuertas Morelia</h1>
        <p>En Servipuertas Morelia ofrecemos soluciones en puertas automáticas y sistemas de acceso, garantizando comodidad, seguridad y tecnología de vanguardia para hogares, negocios e industrias. Nos especializamos en la instalación, mantenimiento y reparación
            de servipuertas, brindando un servicio confiable y adaptado a las necesidades de cada cliente.
        </p>
        <a href="#mision" className="cta-button">Conoce más</a>
      </section>

      {/*Misión*/}
      <section id="mision" className="section">
        <div className="container">
          <h2>Nuestro propósito</h2>
          <div className="card">
            <h3>Solucionamos tu vida</h3>
            <p>Ofrecer soluciones innovadoras en automatización de puertas y accesos, combinando diseño, tecnología y seguridad para brindar a nuestros clientes comodidad y confianza en su hogar, negocio o fraccionamiento.</p>
          </div>
        </div>
      </section>

      {/*Visión*/}
      <section id="vision" className="section">
        <div className="container">
          <h2>Lo que aspiramos</h2>
          <div className="card">
            <h3>Ser líderes en el mercado</h3>
            <p>Ser la empresa de referencia en puertas automáticas y sistemas de acceso inteligente en la región, reconocida por la calidad de nuestros productos</p>
            <p>El servicio personalizado y la integración de tecnología moderna como controles WiFi y apertura móvil.</p>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section id="productos-destacados" className="section">
        <div className="container">
          <h2>Productos Destacados</h2>
          <div className="card-grid">
            {featuredProducts.map(product => (
              <div key={product.id} className="card">
                <h3>{product.nombre}</h3>
                <p>{product.descripcion || "Sin descripción"}</p>
                <p><strong>Precio aprox:</strong> ${product.precio_referencia}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*Contacto*/}
      <section id="contacto" className="section">
        <div className="container">
          <h2>Contacto</h2>
          <div className="card">
            <h3>¿Tienes alguna pregunta o necesitas más información? No dudes en contactarnos. Estamos aquí para ayudarte.</h3>
            <p>Cels. +52 443 511 1173</p>
            <p>+52 443 186 2420</p>
          </div>
        </div>
      </section>

      {/*Botón de Volver arriba*/}
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

export default HomePage;