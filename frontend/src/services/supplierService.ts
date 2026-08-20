import api from './api';

export interface Supplier {
  _id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierPayload {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  active?: boolean;
}

export interface UpdateSupplierPayload {
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  active?: boolean;
}

export const supplierService = {
  getAll: () => api.get<Supplier[]>('/api/suppliers'),
  getById: (id: string) => api.get<Supplier>(`/api/suppliers/${id}`),
  create: (payload: CreateSupplierPayload) => api.post<Supplier>('/api/suppliers', payload),
  update: (id: string, payload: UpdateSupplierPayload) => api.put<Supplier>(`/api/suppliers/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/api/suppliers/${id}`),
};

export default supplierService;