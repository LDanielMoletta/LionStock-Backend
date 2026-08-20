import api from './api';

export interface Product {
  _id: string;
  sku: string;
  name: string;
  description?: string;
  category: Category | string;
  supplier: Supplier | string;
  quantity: number;
  unitPrice: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Supplier {
  _id: string;
  name: string;
}

export interface CreateProductPayload {
  sku: string;
  name: string;
  description?: string;
  category: string;
  supplier: string;
  quantity?: number;
  unitPrice?: number;
  active?: boolean;
}

export interface UpdateProductPayload {
  sku?: string;
  name?: string;
  description?: string;
  category?: string;
  supplier?: string;
  quantity?: number;
  unitPrice?: number;
  active?: boolean;
}

export const productService = {
  getAll: () => api.get<Product[]>('/api/products'),
  getById: (id: string) => api.get<Product>(`/api/products/${id}`),
  create: (payload: CreateProductPayload) => api.post<Product>('/api/products', payload),
  update: (id: string, payload: UpdateProductPayload) => api.put<Product>(`/api/products/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/api/products/${id}`),
};

export default productService;