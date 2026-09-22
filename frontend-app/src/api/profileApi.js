const BASE_URL = 'http://127.0.0.1:8000';

const getAccessToken = () => localStorage.getItem('access_token');

const createHeaders = (contentType = true) => {
    const token = getAccessToken();
    const headers = {};

    if (contentType) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;

    return headers;
};

const handleResponse = async response => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = data.detail || data.error || data.message || 'Terjadi kesalahan pada server.';
        throw new Error(message);
    }

    return data;
};

export const profileApi = {
    getProfile: async () => {
        const response = await fetch(`${BASE_URL}/profil/`, {
            method: 'GET',
            headers: createHeaders()
        });

        return handleResponse(response);
    },

    updateProfile: async profileData => {
        const isFormData = profileData instanceof FormData;

        const response = await fetch(`${BASE_URL}/profil-update/`, {
            method: 'PUT',
            headers: isFormData ? createHeaders(false) : createHeaders(),
            body: isFormData ? profileData : JSON.stringify(profileData)
        });

        return handleResponse(response);
    },

    getDonationHistory: async () => {
        const response = await fetch(`${BASE_URL}/riwayat-donasi/`, {
            method: 'GET',
            headers: createHeaders()
        });

        return handleResponse(response);
    },

    getClaimHistory: async () => {
        const response = await fetch(`${BASE_URL}/riwayat-klaim/`, {
            method: 'GET',
            headers: createHeaders()
        });

        return handleResponse(response);
    },

    getDashboard: async () => {
        const [profile, donations, claims] = await Promise.all([
            profileApi.getProfile(),
            profileApi.getDonationHistory(),
            profileApi.getClaimHistory()
        ]);

        return { profile, donations, claims };
    }
};