import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse, AxiosHeaders } from 'axios';

declare global {
  interface ImportMetaEnv {
    VITE_API_URL?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://lionstock.onrender.com',
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('lionstock_token');

  if (token) {
    const headers = new AxiosHeaders(config.headers);
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lionstock_token');
      localStorage.removeItem('lionstock_user');

      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  },
);

export const extractListData = <T>(response: AxiosResponse | T, fallback: T[] = []): T[] => {
  const payload = (response as { data?: T }).data ?? response;

  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (Array.isArray((payload as { data?: T[] }).data)) {
    return (payload as { data: T[] }).data;
  }

  const listCandidates = [
    (payload as { items?: T[] }).items,
    (payload as { results?: T[] }).results,
    (payload as { products?: T[] }).products,
    (payload as { categories?: T[] }).categories,
    (payload as { suppliers?: T[] }).suppliers,
    (payload as { movements?: T[] }).movements,
    (payload as { users?: T[] }).users,
  ];
  const foundList = listCandidates.find((value): value is T[] => Array.isArray(value));

  return foundList || fallback;
};

export default api;