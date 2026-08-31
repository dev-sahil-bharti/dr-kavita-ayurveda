import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../features/auth/services/authService';
import { STORAGE_KEYS, ROLES } from '../utils/constants';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin', 'patient', or null
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    setUser(null);
    setRole(null);
  }, []);

  const fetchProfile = useCallback(async (currentRole) => {
    try {
      if (currentRole === ROLES.ADMIN) {
        const data = await authService.getAdminProfile();
        setUser(data.user || data);
      } else {
        const data = await authService.getPatientProfile();
        setUser(data);
      }
    } catch (error) {
      console.error(`Failed to fetch ${currentRole} profile`, error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedRole = localStorage.getItem(STORAGE_KEYS.ROLE);

    if (token && storedRole) {
      setRole(storedRole);
      fetchProfile(storedRole);
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  const login = async (emailOrMobile, password, isPatient = false) => {
    const loginRole = isPatient ? ROLES.PATIENT : ROLES.ADMIN;
    const data = isPatient
      ? await authService.patientLogin(emailOrMobile, password)
      : await authService.adminLogin(emailOrMobile, password);

    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(STORAGE_KEYS.ROLE, loginRole);

    setRole(loginRole);
    setUser({
      id: data._id,
      _id: data._id,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
    });
    return data;
  };

  const registerPatient = async (formData) => {
    const data = await authService.patientRegister(formData);

    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(STORAGE_KEYS.ROLE, ROLES.PATIENT);

    setRole(ROLES.PATIENT);
    setUser({
      id: data._id,
      _id: data._id,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
    });
    return data;
  };

  const refreshUser = async () => {
    if (role) {
      await fetchProfile(role);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        login,
        registerPatient,
        logout,
        refreshUser,
        isAuthenticated: !!user && !!role,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
