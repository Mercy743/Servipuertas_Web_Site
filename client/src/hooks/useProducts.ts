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
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/productos');
      
      if (!response.ok) throw new Error('Error en petición');
      
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts, isClient };
};