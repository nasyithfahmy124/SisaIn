const DEFAULT_API_URL = 'https://sisa-in.vercel.app';

const BASE_URL = (
    import.meta.env.VITE_API_URL || DEFAULT_API_URL
).replace(/\/+$/, '');

const getAccessToken = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return localStorage.getItem('access_token');
};

const isFormData = (body) => {
    return (
        typeof FormData !== 'undefined' &&
        body instanceof FormData
    );
};

const createHeaders = ({ body } = {}) => {
    const token = getAccessToken();
    const headers = {};

    if (!isFormData(body)) {
        headers.Accept = 'application/json';
        headers['Content-Type'] = 'application/json';
    } else {
        headers.Accept = 'application/json';
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};

const buildUrl = (endpoint) => {
    if (!endpoint) {
        return BASE_URL;
    }

    if (/^https?:\/\//i.test(endpoint)) {
        return endpoint;
    }

    const normalizedEndpoint = endpoint.startsWith('/')
        ? endpoint
        : `/${endpoint}`;

    return `${BASE_URL}${normalizedEndpoint}`;
};

const parseResponse = async (response) => {
    const contentType =
        response.headers.get('content-type') || '';

    const isJson =
        contentType.includes('application/json') ||
        contentType.includes('+json');

    if (response.status === 204) {
        return null;
    }

    try {
        if (isJson) {
            return await response.json();
        }

        const text = await response.text();

        if (!text) {
            return null;
        }

        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    } catch {
        return null;
    }
};

const extractErrorMessage = (status, data) => {
    if (!data) {
        return null;
    }

    if (typeof data === 'string' && data.trim()) {
        return data.trim();
    }

    if (data?.detail) {
        return Array.isArray(data.detail)
            ? data.detail.join(', ')
            : String(data.detail);
    }

    if (data?.message) {
        return String(data.message);
    }

    if (data?.error) {
        return String(data.error);
    }

    if (typeof data === 'object') {
        const messages = Object.entries(data)
            .flatMap(([field, errors]) => {
                const errorList = Array.isArray(errors)
                    ? errors
                    : [errors];

                return errorList
                    .filter(
                        (error) =>
                            error !== undefined &&
                            error !== null &&
                            error !== ''
                    )
                    .map((error) => {
                        if (
                            typeof error === 'object'
                        ) {
                            return `${field}: ${JSON.stringify(error)}`;
                        }

                        return `${field}: ${String(error)}`;
                    });
            })
            .filter(Boolean);

        if (messages.length > 0) {
            return messages.join('\n');
        }
    }

    switch (status) {
        case 400:
            return 'Data yang dikirim tidak sesuai dengan format server.';

        case 401:
            return 'Sesi login tidak valid atau sudah kedaluwarsa. Silakan login kembali.';

        case 403:
            return 'Anda tidak memiliki izin untuk melakukan proses ini.';

        case 404:
            return 'Endpoint API tidak ditemukan.';

        case 408:
            return 'Request terlalu lama dan dihentikan oleh server.';

        case 413:
            return 'Ukuran file terlalu besar untuk diproses server.';

        case 415:
            return 'Format file atau media tidak didukung oleh server.';

        case 429:
            return 'Terlalu banyak request. Silakan coba beberapa saat lagi.';

        default:
            if (status >= 500) {
                return 'Server mengalami kesalahan saat memproses request.';
            }

            return `Request gagal dengan status ${status}.`;
    }
};

const createApiError = (response, data) => {
    const message =
        extractErrorMessage(response.status, data) ||
        `Request gagal dengan status ${response.status}.`;

    const error = new Error(message);

    error.name = 'ApiError';
    error.status = response.status;
    error.data = data;
    error.url = response.url;
    error.response = response;

    return error;
};

const handleResponse = async (response) => {
    const data = await parseResponse(response);

    if (!response.ok) {
        console.error('API ERROR', {
            url: response.url,
            status: response.status,
            statusText: response.statusText,
            data
        });

        throw createApiError(response, data);
    }

    return data;
};

const request = async (
    endpoint,
    {
        method = 'GET',
        body = undefined,
        signal = undefined
    } = {}
) => {
    const url = buildUrl(endpoint);

    const headers = createHeaders({ body });

    const requestConfig = {
        method,
        headers,
        signal
    };

    if (
        body !== undefined &&
        body !== null &&
        method !== 'GET' &&
        method !== 'HEAD'
    ) {
        requestConfig.body = body;
    }

    console.log('API REQUEST', {
        method,
        url,
        authenticated: Boolean(
            headers.Authorization
        ),
        multipart: isFormData(body)
    });

    let response;

    try {
        response = await fetch(url, requestConfig);
    } catch (error) {
        console.error('NETWORK ERROR', {
            url,
            method,
            error
        });

        const networkError = new Error(
            'Tidak dapat terhubung ke server. Periksa koneksi internet atau alamat API.'
        );

        networkError.name = 'NetworkError';
        networkError.cause = error;
        networkError.url = url;

        throw networkError;
    }

    return handleResponse(response);
};

const createJsonBody = (payload = {}) => {
    return JSON.stringify(payload);
};

const createFormData = (payload) => {
    if (isFormData(payload)) {
        return payload;
    }

    const formData = new FormData();

    if (!payload || typeof payload !== 'object') {
        return formData;
    }

    Object.entries(payload).forEach(([key, value]) => {
        if (
            value === undefined ||
            value === null ||
            value === ''
        ) {
            return;
        }

        formData.append(key, String(value));
    });

    return formData;
};

export const aiRedistribusiApi = {
    analyzeMaterial: async (payload) => {
        const formData = createFormData(payload);

        return request('/ai-analisis/', {
            method: 'POST',
            body: formData
        });
    },

    createMaterial: async (payload) => {
        const formData = createFormData(payload);

        return request('/barang-saya/', {
            method: 'POST',
            body: formData
        });
    },

    getRecommendations: async (payload = {}) => {
        return request('/rekomendasi/', {
            method: 'POST',
            body: createJsonBody(payload)
        });
    },

    claimMaterial: async (
        materialId,
        claimData = {}
    ) => {
        if (
            materialId === undefined ||
            materialId === null ||
            materialId === ''
        ) {
            throw new Error(
                'ID material untuk klaim tidak tersedia.'
            );
        }

        return request(
            `/barang-tersedia/klaim/${encodeURIComponent(
                materialId
            )}/`,
            {
                method: 'POST',
                body: createJsonBody(claimData)
            }
        );
    },

    getMyMaterials: async () => {
        return request('/barang-saya/', {
            method: 'GET'
        });
    }
};

export const authApiDebug = {
    getToken: getAccessToken,

    hasToken: () => {
        return Boolean(getAccessToken());
    },

    getTokenPreview: () => {
        const token = getAccessToken();

        if (!token) {
            return null;
        }

        if (token.length <= 30) {
            return `${token.slice(0, 10)}...`;
        }

        return `${token.slice(0, 20)}...${token.slice(-10)}`;
    }
};

export const apiConfig = {
    baseUrl: BASE_URL,

    isProduction: import.meta.env.PROD,

    isDevelopment: import.meta.env.DEV
};