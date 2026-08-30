import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('trackr_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosClient.get('/auth/me');
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('trackr_token', token);
    setUser(user);
    return user;
  };

  const signup = async (name, email, password) => {
    const res = await axiosClient.post('/auth/signup', { name, email, password });
    const { token, user } = res.data;
    localStorage.setItem('trackr_token', token);
    setUser(user);
    return user;
  };

  // Google sign-in: takes the credential (ID token) from Google
  // Backend handles both new-user creation AND login + account linking
  const loginWithGoogle = async (credential) => {
    const res = await axiosClient.post('/auth/google', { credential });
    const { token, user } = res.data;
    localStorage.setItem('trackr_token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('trackr_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};