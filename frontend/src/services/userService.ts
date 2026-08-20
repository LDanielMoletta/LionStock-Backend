import api from './api';

export type UserRole = 'admin' | 'operator' | 'viewer';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  active?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  active?: boolean;
}

export const userService = {
  getAll: () => api.get<User[]>('/api/users'),
  getById: (id: string) => api.get<User>(`/api/users/${id}`),
  create: (payload: CreateUserPayload) => api.post<User>('/api/users', payload),
  update: (id: string, payload: UpdateUserPayload) => api.put<User>(`/api/users/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/api/users/${id}`),
};

export default userService;