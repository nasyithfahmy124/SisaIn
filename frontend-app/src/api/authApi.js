const BASE_URL = 'http://127.0.0.1:8000';

const request = async (url, options = {}) => {
    const response = await fetch(`${BASE_URL}${url}`, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) throw data;
    return data;
};

const authHeaders = token => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
});

export const authApi = {
    register: userData => request('/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    }),

    login: credentials => request('/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    }),

    refreshToken: refresh => request('/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh })
    }),

    loginWithGoogle: token => request('/log/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    }),

    getProfile: token => request('/profil/', {
        method: 'GET',
        headers: authHeaders(token)
    })
};