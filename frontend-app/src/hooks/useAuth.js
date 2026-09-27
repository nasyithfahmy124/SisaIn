import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

const getErrorMessage = (error, fallback = 'Terjadi kesalahan.') => {
    if (!error) {
        return fallback;
    }

    // Error dari authApi adalah instance Error
    if (error.message && error.message !== fallback) {
        return error.message;
    }

    // Error response dari backend
    const data = error.data;

    if (data) {
        if (typeof data === 'string') {
            return data;
        }

        if (data.detail) {
            return data.detail;
        }

        if (data.message) {
            return data.message;
        }

        if (data.error) {
            return data.error;
        }

        // Django REST Framework validation error
        if (typeof data === 'object') {
            const messages = Object.entries(data)
                .flatMap(([field, errors]) => {
                    const errorList = Array.isArray(errors)
                        ? errors
                        : [errors];

                    return errorList.map((message) => {
                        const fieldName =
                            field === 'non_field_errors'
                                ? ''
                                : `${field}: `;

                        return `${fieldName}${message}`;
                    });
                })
                .filter(Boolean);

            if (messages.length > 0) {
                return messages.join(', ');
            }
        }
    }

    return fallback;
};

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const loadProfile = useCallback(async (token) => {
        if (!token) {
            setUser(null);
            return null;
        }

        try {
            const profile = await authApi.getProfile(token);

            setUser({
                ...profile,
                isAuthenticated: true,
                token,
            });

            return profile;
        } catch (profileError) {
            console.warn(
                'Access token tidak valid, mencoba refresh token.',
                profileError
            );

            try {
                const refreshToken = authApi.getRefreshToken();

                if (!refreshToken) {
                    authApi.clearTokens();
                    setUser(null);
                    return null;
                }

                const tokenData = await authApi.refreshToken();

                const newAccessToken = tokenData?.access;

                if (!newAccessToken) {
                    throw new Error(
                        'Access token baru tidak ditemukan.'
                    );
                }

                const profile = await authApi.getProfile(
                    newAccessToken
                );

                setUser({
                    ...profile,
                    isAuthenticated: true,
                    token: newAccessToken,
                });

                return profile;
            } catch (refreshError) {
                console.error(
                    'Refresh token gagal:',
                    refreshError
                );

                authApi.clearTokens();
                setUser(null);

                return null;
            }
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async () => {
            const token = authApi.getAccessToken();

            if (!token) {
                if (isMounted) {
                    setUser(null);
                    setIsLoading(false);
                }

                return;
            }

            try {
                await loadProfile(token);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        initializeAuth();

        return () => {
            isMounted = false;
        };
    }, [loadProfile]);

    const login = async (credentials) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await authApi.login(credentials);

            if (!data?.access) {
                throw new Error(
                    'Access token tidak ditemukan dari response login.'
                );
            }

            await loadProfile(data.access);

            navigate('/beranda');
        } catch (err) {
            const message = getErrorMessage(
                err,
                'Username atau password tidak valid.'
            );

            setError(message);

            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async (googleToken) => {
        setIsLoading(true);
        setError(null);

        try {
            if (!googleToken) {
                throw new Error(
                    'Credential Google tidak ditemukan.'
                );
            }

            const data =
                await authApi.loginWithGoogle(googleToken);

            if (!data?.access) {
                throw new Error(
                    'Access token Google tidak ditemukan.'
                );
            }

            await loadProfile(data.access);

            navigate('/beranda');
        } catch (err) {
            const message = getErrorMessage(
                err,
                'Gagal masuk dengan akun Google.'
            );

            setError(message);

            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData) => {
        setIsLoading(true);
        setError(null);

        try {
            await authApi.register(userData);

            // Register berhasil, arahkan ke login
            navigate('/login');
        } catch (err) {
            const message = getErrorMessage(
                err,
                'Registrasi gagal. Silakan coba lagi.'
            );

            console.error('Register error:', {
                message,
                status: err?.status,
                data: err?.data,
            });

            setError(message);

            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authApi.clearTokens();
        setUser(null);
        setError(null);

        navigate('/login');
    };

    const refreshProfile = async () => {
        const token = authApi.getAccessToken();

        if (!token) {
            setUser(null);
            return null;
        }

        return loadProfile(token);
    };

    return {
        user,
        isLoading,
        error,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshProfile,
    };
};