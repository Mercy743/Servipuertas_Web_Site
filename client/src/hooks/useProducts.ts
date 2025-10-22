import { useState, useEffect } from 'react';

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_tipo: string;
  stock: number;
  imagen_url: string;
  marca: string;
  categoria: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // GET ALL
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/productos');
      if (!response.ok) throw new Error('Error al cargar productos');
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const createProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!response.ok) throw new Error('Error al crear producto');
      const newProduct = await response.json();
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      throw err;
    }
  };

  // UPDATE
  const updateProduct = async (id: number, productData: Partial<Product>) => {
    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!response.ok) throw new Error('Error al actualizar producto');
      const updatedProduct = await response.json();
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      throw err;
    }
  };

  // DELETE
  const deleteProduct = async (id: number) => {
    try {
      const response = await fetch(`/api/productos/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar producto');
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
};