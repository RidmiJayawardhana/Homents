import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('homents_token'));

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('homents_token');
      const savedUser = localStorage.getItem('homents_user');
      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          const { data } = await api.get('/auth/me');
          setUser(data.user);
          setProvider(data.provider);
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (userData, tokenValue, providerData = null) => {
    setUser(userData);
    setToken(tokenValue);
    setProvider(providerData);
    localStorage.setItem('homents_token', tokenValue);
    localStorage.setItem('homents_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setProvider(null);
    localStorage.removeItem('homents_token');
    localStorage.removeItem('homents_user');
    localStorage.removeItem('homents_admin');
  };

  return (
    <AuthContext.Provider value={{ user, provider, token, loading, login, logout, setUser, setProvider }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
