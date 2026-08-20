import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  active: boolean;
}

interface LoginResponse {
  token: string;
  user: User;
}

type LoginPayload = LoginResponse | { data: LoginResponse };

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (authData: LoginPayload) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('lionstock_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('lionstock_token') || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('lionstock_token', token);
    } else {
      localStorage.removeItem('lionstock_token');
    }
  }, [token]);

  const login = (authData: LoginPayload) => {
    const payload = 'data' in authData ? authData.data : authData;
    const nextToken = payload.token ?? null;
    const nextUser = payload.user ?? null;

    setToken(nextToken);
    setUser(nextUser);

    if (nextToken) {
      localStorage.setItem('lionstock_token', nextToken);
    } else {
      localStorage.removeItem('lionstock_token');
    }

    if (nextUser) {
      localStorage.setItem('lionstock_user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('lionstock_user');
    }

    navigate('/dashboard');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('lionstock_token');
    localStorage.removeItem('lionstock_user');
    navigate('/login');
  };

  const isAuthenticated = () => Boolean(token);

  const hasRole = (role: string) => user?.role === role;

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated,
      hasRole,
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};