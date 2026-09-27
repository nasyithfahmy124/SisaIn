const BASE_URL = (import.meta.env.VITE_API_URL || 'https://sisa-in.vercel.app').replace(/\/+$/, '');

const getAccessToken = () => localStorage.getItem('access_token');

const getAuthHeaders = ({ json = true } = {}) => {
    const token = getAccessToken();

    if (!token) {
        throw new Error('Access token tidak ditemukan. Silakan login kembali.');
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
    };

    if (json) {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
};

const parseResponse = async (response) => {
    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();

    if (!text) {
        return null;
    }

    if (contentType.includes('application/json')) {
        try {
            return JSON.parse(text);
        } catch {
            return { raw: text };
        }
    }

    return { raw: text };
};

const getErrorMessage = (data, status) => {
    if (!data) {
        return `Request gagal dengan status ${status}.`;
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

    if (data.errors && typeof data.errors === 'object') {
        return Object.entries(data.errors)
            .flatMap(([field, errors]) => {
                const messages = Array.isArray(errors) ? errors : [errors];
                return messages.map((message) => `${field}: ${message}`);
            })
            .join(', ');
    }

    if (data.raw) {
        return data.raw;
    }

    return `Request gagal dengan status ${status}.`;
};

const request = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;

    let response;

    try {
        response = await fetch(url, {
            ...options,
            headers: {
                Accept: 'application/json',
                ...(options.headers || {}),
            },
        });
    } catch (error) {
        console.error('API CONNECTION ERROR:', error);
        throw new Error('Tidak dapat terhubung ke server.');
    }

    const data = await parseResponse(response);

    console.log('API RESPONSE:', {
        endpoint,
        method: options.method || 'GET',
        status: response.status,
        data,
    });

    if (!response.ok) {
        const error = new Error(getErrorMessage(data, response.status));

        error.status = response.status;
        error.data = data;
        error.endpoint = endpoint;

        throw error;
    }

    return data;
};

export const profileApi = {
    getProfile: async () => {
        return request('/profil/', {
            method: 'GET',
            headers: getAuthHeaders(),
        });
    },

    updateProfile: async (profileData) => {
        const isFormData = profileData instanceof FormData;

        if (isFormData) {
            console.log('UPDATE PROFILE FORM DATA:');

            for (const [key, value] of profileData.entries()) {
                console.log(key, value);
            }
        } else {
            console.log('UPDATE PROFILE JSON:', profileData);
        }

        return request('/profil-update/', {
            method: 'PUT',
            headers: getAuthHeaders({
                json: !isFormData,
            }),
            body: isFormData ? profileData : JSON.stringify(profileData),
        });
    },

    getDonationHistory: async () => {
        return request('/riwayat-donasi/', {
            method: 'GET',
            headers: getAuthHeaders(),
        });
    },

    getClaimHistory: async () => {
        return request('/riwayat-klaim/', {
            method: 'GET',
            headers: getAuthHeaders(),
        });
    },

    getDashboard: async () => {
        const [profileResult, donationsResult, claimsResult] = await Promise.allSettled([
            profileApi.getProfile(),
            profileApi.getDonationHistory(),
            profileApi.getClaimHistory(),
        ]);

        return {
            profile: profileResult.status === 'fulfilled' ? profileResult.value : null,
            donations: donationsResult.status === 'fulfilled' ? donationsResult.value : [],
            claims: claimsResult.status === 'fulfilled' ? claimsResult.value : [],
        };
    },
};