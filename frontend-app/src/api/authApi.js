const BASE_URL = (
    import.meta.env.VITE_API_URL || 'https://sisa-in.vercel.app'
).replace(/\/+$/, '');

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/* ================================
   TOKEN HELPERS
================================ */

const getAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

const getRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/* ================================
   ERROR PARSER
================================ */

const parseErrorMessage = (data, status) => {
    if (!data) {
        return `Request gagal dengan status ${status}.`;
    }

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

    // Menangani error validation Django REST Framework
    // Contoh:
    // {
    //   "username": ["A user with that username already exists."]
    // }
    if (typeof data === 'object') {
        const messages = Object.entries(data)
            .flatMap(([field, errors]) => {
                const errorList = Array.isArray(errors)
                    ? errors
                    : [errors];

                return errorList.map((message) => {
                    return `${field}: ${message}`;
                });
            })
            .filter(Boolean);

        if (messages.length > 0) {
            return messages.join('\n');
        }
    }

    return `Request gagal dengan status ${status}.`;
};

/* ================================
   API REQUEST
================================ */

const request = async (url, options = {}) => {
    const endpoint = `${BASE_URL}${url}`;

    let response;

    try {
        response = await fetch(endpoint, {
            ...options,
            headers: {
                Accept: 'application/json',
                ...(options.headers || {}),
            },
        });
    } catch (error) {
        console.error('Network error:', error);

        throw new Error(
            'Tidak dapat terhubung ke server. Periksa koneksi internet atau server API.'
        );
    }

    const contentType = response.headers.get('content-type') || '';

    let data = null;

    try {
        const text = await response.text();

        if (text) {
            if (contentType.includes('application/json')) {
                try {
                    data = JSON.parse(text);
                } catch {
                    data = {
                        message: text,
                    };
                }
            } else {
                data = {
                    message: text,
                };
            }
        }
    } catch (error) {
        console.error('Response parsing error:', error);

        data = null;
    }

    if (!response.ok) {
        const error = new Error(
            parseErrorMessage(data, response.status)
        );

        error.status = response.status;
        error.data = data;
        error.url = endpoint;

        console.error('API Error:', {
            status: response.status,
            url: endpoint,
            data,
        });

        throw error;
    }

    return data;
};

/* ================================
   AUTH HELPERS
================================ */

const saveTokens = (data) => {
    const accessToken = data?.access;
    const refreshToken = data?.refresh;

    if (!accessToken) {
        throw new Error(
            'Access token tidak ditemukan dari response login.'
        );
    }

    localStorage.setItem(
        ACCESS_TOKEN_KEY,
        accessToken
    );

    if (refreshToken) {
        localStorage.setItem(
            REFRESH_TOKEN_KEY,
            refreshToken
        );
    }

    return data;
};

const authHeaders = (token = getAccessToken()) => {
    if (!token) {
        throw new Error(
            'Access token tidak ditemukan. Silakan login kembali.'
        );
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};

/* ================================
   AUTH API
================================ */

export const authApi = {

    /* ============================
       REGISTER
    ============================ */

    register: async (userData) => {
        const payload = {
            username: String(userData?.username || '').trim(),
            email: String(userData?.email || '').trim(),
            password: String(userData?.password || ''),
        };

        console.log('REGISTER PAYLOAD:', payload);

        if (!payload.username) {
            throw new Error('Username wajib diisi.');
        }

        if (!payload.password) {
            throw new Error('Password wajib diisi.');
        }

        const data = await request('/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        console.log('REGISTER RESPONSE:', data);

        return data;
    },

    /* ============================
       LOGIN
    ============================ */

    login: async (credentials) => {
        const payload = {
            username: String(credentials?.username || '').trim(),
            password: String(credentials?.password || ''),
        };

        console.log('LOGIN PAYLOAD:', {
            username: payload.username,
        });

        const data = await request('/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        return saveTokens(data);
    },

    /* ============================
       REFRESH TOKEN
    ============================ */

    refreshToken: async () => {
        const refresh = getRefreshToken();

        if (!refresh) {
            clearTokens();

            throw new Error(
                'Refresh token tidak ditemukan. Silakan login kembali.'
            );
        }

        const data = await request('/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh,
            }),
        });

        return saveTokens(data);
    },

    /* ============================
       GOOGLE LOGIN
    ============================ */

    loginWithGoogle: async (token) => {
        if (!token) {
            throw new Error(
                'Google credential tidak ditemukan.'
            );
        }

        console.log('GOOGLE LOGIN: credential diterima');

        const data = await request('/log/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
            }),
        });

        return saveTokens(data);
    },

    /* ============================
       GET PROFILE
    ============================ */

    getProfile: async (token = getAccessToken()) => {
        return request('/profil/', {
            method: 'GET',
            headers: authHeaders(token),
        });
    },

    /* ============================
       TOKEN ACCESS
    ============================ */

    getAccessToken,

    getRefreshToken,

    clearTokens,
};