import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadProfile = async token => {
        try {
            const profile = await authApi.getProfile(token);
            setUser({ ...profile, isAuthenticated: true, token });
            return profile;
        } catch {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            setIsLoading(false);
            return;
        }

        loadProfile(token).finally(() => setIsLoading(false));
    }, []);

    const login = async credentials => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await authApi.login(credentials);

            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);

            await loadProfile(data.access);
            navigate('/beranda');
        } catch (err) {
            setError(err.detail || 'Username atau password tidak valid.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async googleToken => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await authApi.loginWithGoogle(googleToken);

            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);

            await loadProfile(data.access);
            navigate('/beranda');
        } catch (err) {
            setError(err.error || 'Gagal masuk dengan akun Google.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async userData => {
        setIsLoading(true);
        setError(null);

        try {
            await authApi.register(userData);
            navigate('/login');
        } catch (err) {
            const message = typeof err === 'object' ? Object.values(err).flat().join(', ') : 'Terjadi kesalahan server.';
            setError(message);
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

    const refreshProfile = async () => {
        const token = localStorage.getItem('access_token');

        if (token) await loadProfile(token);
    };

    return { user, isLoading, error, login, loginWithGoogle, register, logout, refreshProfile };
};