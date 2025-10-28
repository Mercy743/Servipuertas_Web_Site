import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import HomePage from './pages/HomePage';
import ProductosPage from './pages/ProductosPage';
import AgregarProducto from './pages/Admin/agregar_producto';
import EditarProducto from './pages/Admin/editar_producto';
import EliminarProducto from './pages/Admin/eliminar_producto';
import MenuProducto from './pages/Admin/menu_producto';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <HomePage />
            </>
          } />
          
          <Route path="/productos" element={
            <>
              <Header />
              <ProductosPage />
            </>
          } />
          
          <Route path="/admin/agregar-producto" element={<AgregarProducto />} />
          <Route path="/admin/menu-producto" element={<MenuProducto />} />
          <Route path="/admin/editar-producto" element={<EditarProducto />} />
          <Route path="/admin/eliminar-producto" element={<EliminarProducto />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;