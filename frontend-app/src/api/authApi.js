const BASE_URL = (import.meta.env.VITE_API_URL || 'https://sisa-in.vercel.app').replace(/\/+$/, '');

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const request = async (url, options = {}) => {
    let response;

    try {
        response = await fetch(`${BASE_URL}${url}`, options);
    } catch {
        throw new Error('Tidak dapat terhubung ke server.');
    }

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();

    let data = {};

    if (text) {
        if (contentType.includes('application/json')) {
            try {
                data = JSON.parse(text);
            } catch {
                data = { message: text };
            }
        } else {
            data = { message: text };
        }
    }

    if (!response.ok) {
        const error = new Error(
            data?.detail ||
            data?.message ||
            data?.error ||
            `Request gagal dengan status ${response.status}.`
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
};

const saveTokens = (data) => {
    const accessToken = data?.access;
    const refreshToken = data?.refresh;

    if (!accessToken) {
        throw new Error('Access token tidak ditemukan dari response login.');
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    return data;
};

const authHeaders = (token = getAccessToken()) => {
    if (!token) {
        throw new Error('Access token tidak ditemukan. Silakan login kembali.');
    }

    return {
        Authorization: `Bearer ${token}`
    };
};

export const authApi = {
    register: async (userData) => {
        return request('/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
    },

    login: async (credentials) => {
        const data = await request('/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        return saveTokens(data);
    },

    refreshToken: async () => {
        const refresh = getRefreshToken();

        if (!refresh) {
            throw new Error('Refresh token tidak ditemukan.');
        }

        const data = await request('/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh })
        });

        return saveTokens(data);
    },

    loginWithGoogle: async (token) => {
        const data = await request('/log/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });

        return saveTokens(data);
    },

    getProfile: async (token = getAccessToken()) => {
        return request('/profil/', {
            method: 'GET',
            headers: authHeaders(token)
        });
    },

    getAccessToken,
    getRefreshToken,
    clearTokens
};