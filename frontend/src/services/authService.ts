import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => api.post('/api/auth/login', credentials),
};

export default authService;