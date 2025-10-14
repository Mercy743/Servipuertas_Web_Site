const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen_url: string;
  stock: number;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en la solicitud API:', error);
      throw error;
    }
  }

  // Productos
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/productos');
  }

  async getProductById(id: number): Promise<Product> {
    return this.request<Product>(`/productos/${id}`);
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return this.request<Product>('/productos', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    return this.request<Product>(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: number): Promise<void> {
    return this.request<void>(`/productos/${id}`, {
      method: 'DELETE',
    });
  }

  // Categorías
  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/categorias');
  }
}

export const apiService = new ApiService();