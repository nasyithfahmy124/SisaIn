const BASE_URL = (import.meta.env.VITE_API_URL || 'https://sisa-in.vercel.app').replace(/\/+$/, '');

const getAccessToken = () => localStorage.getItem('access_token');

const createHeaders = (json = true) => {
    const token = getAccessToken();
    const headers = {};

    if (json) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};

const parseResponse = async (response) => {
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    let data = null;

    try {
        data = isJson
            ? await response.json()
            : await response.text();
    } catch {
        data = null;
    }

    return { data, response };
};

const getErrorMessage = (status, data) => {
    if (typeof data === 'string' && data.trim()) return data;

    if (status === 400) {
        if (data && typeof data === 'object') {
            const messages = Object.entries(data)
                .flatMap(([field, errors]) => {
                    const list = Array.isArray(errors) ? errors : [errors];
                    return list.map((error) => `${field}: ${error}`);
                })
                .filter(Boolean);

            if (messages.length) return messages.join('\n');
        }

        return 'Data yang dikirim tidak sesuai dengan format server.';
    }

    if (status === 401) {
        return data?.detail || 'Sesi login tidak valid atau sudah kedaluwarsa. Silakan login kembali.';
    }

    if (status === 403) {
        return data?.detail || 'Anda tidak memiliki izin untuk melakukan proses ini.';
    }

    if (status === 404) {
        return data?.detail || data?.message || 'Endpoint API tidak ditemukan.';
    }

    if (status >= 500) {
        return data?.detail || data?.error || data?.message || 'Server mengalami kesalahan saat memproses request.';
    }

    return data?.detail || data?.error || data?.message || `Request gagal dengan status ${status}.`;
};

const handleResponse = async (response) => {
    const { data } = await parseResponse(response);

    if (!response.ok) {
        console.error('API ERROR', {
            url: response.url,
            status: response.status,
            statusText: response.statusText,
            data
        });

        const error = new Error(getErrorMessage(response.status, data));

        error.status = response.status;
        error.data = data;
        error.response = response;

        throw error;
    }

    return data;
};

const request = async (endpoint, { method = 'GET', body, json = true } = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const headers = createHeaders({ json });

    console.log('API REQUEST', {
        method,
        url,
        authenticated: Boolean(headers.Authorization)
    });

    const response = await fetch(url, {
        method,
        headers,
        body
    });

    return handleResponse(response);
};

export const aiRedistribusiApi = {
    analyzeMaterial: async (payload) => {
        const isFormData = payload instanceof FormData;

        return request('/ai-analisis/', {
            method: 'POST',
            json: !isFormData,
            body: isFormData ? payload : JSON.stringify(payload)
        });
    },

    createMaterial: async (formData) => {
        const response = await fetch(`${BASE_URL}/barang-saya/`, {
            method: 'POST',
            headers: createHeaders(false),
            body: formData
        });

        return handleResponse(response);
    },

    getRecommendations: async (payload) => {
        return request('/rekomendasi/', {
            method: 'POST',
            json: true,
            body: JSON.stringify(payload)
        });
    },

    claimMaterial: async (materialId, claimData) => {
        if (!materialId) {
            throw new Error('ID material untuk klaim tidak tersedia.');
        }

        return request(`/barang-tersedia/klaim/${materialId}/`, {
            method: 'POST',
            json: true,
            body: JSON.stringify(claimData)
        });
    },

    getMyMaterials: async () => {
        return request('/barang-saya/', {
            method: 'GET',
            json: true
        });
    }
};

export const authApiDebug = {
    getToken: getAccessToken,
    hasToken: () => Boolean(getAccessToken()),
    getTokenPreview: () => {
        const token = getAccessToken();

        if (!token) return null;

        return `${token.slice(0, 20)}...${token.slice(-10)}`;
    }
};