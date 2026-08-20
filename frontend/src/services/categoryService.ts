import api from './api';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  active?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  active?: boolean;
}

export const categoryService = {
  getAll: () => api.get<Category[]>('/api/categories'),
  getById: (id: string) => api.get<Category>(`/api/categories/${id}`),
  create: (payload: CreateCategoryPayload) => api.post<Category>('/api/categories', payload),
  update: (id: string, payload: UpdateCategoryPayload) => api.put<Category>(`/api/categories/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/api/categories/${id}`),
};

export default categoryService;