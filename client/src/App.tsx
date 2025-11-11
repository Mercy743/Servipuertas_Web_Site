// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeaderClient from './components/Layout/HeaderClient'; // ← NUEVO
import HeaderAdmin from './components/Layout/HeaderAdmin';   // ← NUEVO
import HomePage from './pages/HomePage';
import ProductosPage from './pages/ProductosPage';
import AgregarProducto from './pages/Admin/agregar_producto';
import EditarProducto from './pages/Admin/editar_producto';
import EliminarProducto from './pages/Admin/eliminar_producto';
import MenuProducto from './pages/Admin/menu_producto';
import LoginAdmin from './components/LoginAdmin';
import AdminRoute from './components/AdminRoute';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* RUTAS PÚBLICAS - HEADER CLIENTE */}
          <Route path="/" element={
            <>
              <HeaderClient /> {/* ← HEADER PARA CLIENTES */}
              <HomePage />
            </>
          } />
          
          <Route path="/productos" element={
            <>
              <HeaderClient /> {/* ← HEADER PARA CLIENTES */}
              <ProductosPage />
            </>
          } />
          
          {/* RUTA DE LOGIN */}
          <Route path="/admin/login" element={<LoginAdmin />} />
          
          {/* RUTAS ADMIN PROTEGIDAS - HEADER ADMIN */}
          <Route path="/admin/agregar-producto" element={
            <AdminRoute>
              <HeaderAdmin /> {/* ← HEADER PARA ADMIN */}
              <AgregarProducto />
            </AdminRoute>
          } />
          
          <Route path="/admin/menu-producto" element={
            <AdminRoute>
              <HeaderAdmin /> {/* ← HEADER PARA ADMIN */}
              <MenuProducto />
            </AdminRoute>
          } />
          
          <Route path="/admin/editar-producto" element={
            <AdminRoute>
              <HeaderAdmin /> {/* ← HEADER PARA ADMIN */}
              <EditarProducto />
            </AdminRoute>
          } />
          
          <Route path="/admin/eliminar-producto" element={
            <AdminRoute>
              <HeaderAdmin /> {/* ← HEADER PARA ADMIN */}
              <EliminarProducto />
            </AdminRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;