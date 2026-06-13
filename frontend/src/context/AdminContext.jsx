import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('homents_admin');
    const savedToken = localStorage.getItem('homents_token');
    if (savedAdmin && savedToken) {
      setAdmin(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  const adminLogin = (adminData, token) => {
    setAdmin(adminData);
    localStorage.setItem('homents_token', token);
    localStorage.setItem('homents_admin', JSON.stringify(adminData));
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('homents_token');
    localStorage.removeItem('homents_admin');
  };

  return (
    <AdminContext.Provider value={{ admin, loading, adminLogin, adminLogout, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
