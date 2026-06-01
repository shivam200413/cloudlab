import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../components/api';
import { useRouter } from 'next/router';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const u = localStorage.getItem('cl_user');
      const t = localStorage.getItem('cl_token');
      if (u && t) setUser(JSON.parse(u));
    } catch {}
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authApi.login(email, password);
    localStorage.setItem('cl_token', data.token);
    localStorage.setItem('cl_user', JSON.stringify(data.user));
    setUser(data.user);
    router.push('/dashboard');
  };

  const register = async (email, password, name) => {
    const { data } = await authApi.register(email, password, name);
    localStorage.setItem('cl_token', data.token);
    localStorage.setItem('cl_user', JSON.stringify(data.user));
    setUser(data.user);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('cl_token');
    localStorage.removeItem('cl_user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
