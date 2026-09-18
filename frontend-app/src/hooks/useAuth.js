import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cek apakah user sudah login saat aplikasi pertama kali dimuat
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        setUser({ isAuthenticated: true, token });
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authApi.login(credentials);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setUser({ isAuthenticated: true, token: data.access });
      navigate('/beranda');
    } catch (err) {
      setError(err.message);
      throw err; // Lempar error agar bisa ditangkap oleh UI form
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.register(userData);
      navigate('/login');
    } catch (err) {
      const errorText = typeof err === 'object' ? Object.values(err).flat().join(", ") : "Terjadi kesalahan server.";
      setError(errorText);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/login');
  };

  return { user, isLoading, error, login, register, logout };
};