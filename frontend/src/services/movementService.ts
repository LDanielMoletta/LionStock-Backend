import api from './api';

export type MovementType = 'ENTRY' | 'EXIT';

export interface Movement {
  _id: string;
  product: Product | string;
  type: MovementType;
  quantity: number;
  reason?: string;
  user: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface CreateMovementPayload {
  product: string;
  type: MovementType;
  quantity: number;
  reason?: string;
  user: string;
}

export const movementService = {
  getAll: () => api.get<Movement[]>('/api/movements'),
  getById: (id: string) => api.get<Movement>(`/api/movements/${id}`),
  create: (payload: CreateMovementPayload) => api.post<Movement>('/api/movements', payload),
  update: (id: string, payload: Partial<CreateMovementPayload>) => api.put<Movement>(`/api/movements/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/api/movements/${id}`),
};

export default movementService;