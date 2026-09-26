const BASE_URL = (import.meta.env.VITE_API_URL || 'https://sisa-in.vercel.app').replace(/\/+$/, '');

const getAccessToken = () => localStorage.getItem('access_token');

const getAuthHeaders = ({ json = true } = {}) => {
    const token = getAccessToken();

    if (!token) {
        throw new Error('Access token tidak ditemukan. Silakan login kembali.');
    }

    const headers = {
        Authorization: `Bearer ${token}`
    };

    if (json) {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
};

const parseResponse = async (response) => {
    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();

    if (!text) return null;

    if (contentType.includes('application/json')) {
        try {
            return JSON.parse(text);
        } catch {
            return { raw: text };
        }
    }

    return { raw: text };
};

const request = async (endpoint, options = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await parseResponse(response);

    console.log('API RESPONSE', {
        endpoint,
        method: options.method || 'GET',
        status: response.status,
        data
    });

    if (!response.ok) {
        const message =
            data?.detail ||
            data?.message ||
            data?.error ||
            data?.raw ||
            `Request gagal dengan status ${response.status}.`;

        const error = new Error(message);
        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
};

export const profileApi = {
    getProfile: async () => {
        return request('/profil/', {
            method: 'GET',
            headers: getAuthHeaders()
        });
    },

    updateProfile: async (profileData) => {
        const isFormData = profileData instanceof FormData;

        if (isFormData) {
            console.log('=== UPDATE PROFILE FORM DATA ===');

            for (const [key, value] of profileData.entries()) {
                console.log(key, value);
            }
        } else {
            console.log('=== UPDATE PROFILE JSON ===');
            console.log(profileData);
        }

        return request('/profil-update/', {
            method: 'PUT',
            headers: getAuthHeaders({
                json: !isFormData
            }),
            body: isFormData
                ? profileData
                : JSON.stringify(profileData)
        });
    },

    getDonationHistory: async () => {
        return request('/riwayat-donasi/', {
            method: 'GET',
            headers: getAuthHeaders()
        });
    },

    getClaimHistory: async () => {
        return request('/riwayat-klaim/', {
            method: 'GET',
            headers: getAuthHeaders()
        });
    },

    getDashboard: async () => {
        const [profile, donations, claims] = await Promise.allSettled([
            profileApi.getProfile(),
            profileApi.getDonationHistory(),
            profileApi.getClaimHistory()
        ]);

        return {
            profile: profile.status === 'fulfilled' ? profile.value : null,
            donations: donations.status === 'fulfilled' ? donations.value : [],
            claims: claims.status === 'fulfilled' ? claims.value : []
        };
    }
};