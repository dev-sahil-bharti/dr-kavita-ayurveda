import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin', 'patient', or null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (token && storedRole) {
      setRole(storedRole);
      fetchProfile(storedRole);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (currentRole) => {
    try {
      const endpoint = currentRole === 'admin' ? '/admin/profile' : '/patient/profile';
      const { data } = await api.get(endpoint);
      setUser(currentRole === 'admin' ? data.user : data);
    } catch (error) {
      console.error(`Failed to fetch ${currentRole} profile`, error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, isPatient = false) => {
    const endpoint = isPatient ? '/patient/login' : '/admin/login';
    const loginRole = isPatient ? 'patient' : 'admin';
    
    const { data } = await api.post(endpoint, { email, password });
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', loginRole);
    
    setRole(loginRole);
    setUser({ id: data._id, name: data.name, email: data.email, mobile: data.mobile });
    return data;
  };

  const registerPatient = async (formData) => {
    const { data } = await api.post('/patient/register', formData);
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', 'patient');
    
    setRole('patient');
    setUser({ id: data._id, name: data.name, email: data.email, mobile: data.mobile });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, registerPatient, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
