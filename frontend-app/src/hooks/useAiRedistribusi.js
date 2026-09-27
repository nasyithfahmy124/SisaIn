import { useCallback, useState } from 'react';
import { aiRedistribusiApi } from '../api/aiRedistribusiApi';

const parseResultData = (resultData) => {
    if (!resultData) {
        return {};
    }

    if (typeof resultData === 'object') {
        return resultData;
    }

    if (typeof resultData !== 'string') {
        return {};
    }

    try {
        return JSON.parse(resultData);
    } catch {
        return {};
    }
};

const extractResponseData = (response) => {
    if (!response) {
        return {};
    }

    if (response?.data?.data) {
        return response.data.data;
    }

    if (response?.data && typeof response.data === 'object') {
        return response.data;
    }

    return response;
};

const normalizeAnalysisResult = (response) => {
    const responseData = extractResponseData(response);
    const resultData = parseResultData(responseData?.result_data);

    const mergedData = {
        ...responseData,
        ...resultData
    };

    return {
        ...mergedData,
        nama_material:
            resultData.nama_material ??
            responseData?.nama_material ??
            null,

        kategori:
            resultData.kategori ??
            responseData?.kategori ??
            null,

        kondisi_barang:
            resultData.kondisi_barang ??
            resultData.kondisi ??
            responseData?.kondisi_barang ??
            responseData?.kondisi ??
            null,

        bobot:
            resultData.bobot ??
            resultData.berat ??
            responseData?.bobot ??
            responseData?.berat ??
            null,

        deskripsi:
            resultData.deskripsi ??
            responseData?.deskripsi ??
            null,

        confidence:
            resultData.confidence ??
            resultData.accuracy ??
            responseData?.confidence ??
            null,

        kelayakan:
            resultData.kelayakan ??
            resultData.grade ??
            responseData?.kelayakan ??
            null,

        jumlah:
            resultData.jumlah ??
            resultData.quantity ??
            responseData?.jumlah ??
            null,

        satuan:
            resultData.satuan ??
            resultData.unit ??
            responseData?.satuan ??
            null,

        isFallback: false
    };
};

const getErrorMessage = (error, fallbackMessage) => {
    const responseData = error?.response?.data;

    if (typeof responseData === 'string') {
        return responseData;
    }

    if (responseData?.detail) {
        return responseData.detail;
    }

    if (responseData?.error) {
        return responseData.error;
    }

    if (responseData?.message) {
        return responseData.message;
    }

    if (error?.message) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return fallbackMessage;
};

const extractList = (response) => {
    if (!response) {
        return [];
    }

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.results)) {
        return response.results;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.data?.results)) {
        return response.data.results;
    }

    if (Array.isArray(response?.data?.data)) {
        return response.data.data;
    }

    return [];
};

const resolveFile = (payload) => {
    if (!payload) {
        return null;
    }

    if (typeof File !== 'undefined' && payload instanceof File) {
        return payload;
    }

    if (
        typeof File !== 'undefined' &&
        payload?.file instanceof File
    ) {
        return payload.file;
    }

    if (
        typeof Blob !== 'undefined' &&
        payload instanceof Blob
    ) {
        return payload;
    }

    if (
        typeof Blob !== 'undefined' &&
        payload?.file instanceof Blob
    ) {
        return payload.file;
    }

    return null;
};

const createFallbackAnalysis = () => ({
    nama_material: 'Semen Portland (PCC)',
    kategori: 'Semen',
    kondisi_barang: 'Layak Pakai',
    bobot: 40,
    deskripsi:
        'Material bangunan terdeteksi dari foto dan dapat digunakan kembali.',
    confidence: 94,
    kelayakan: 'Layak',
    jumlah: 1,
    satuan: 'pcs',
    isFallback: true
});

const appendFormData = (formData, fields) => {
    Object.entries(fields).forEach(([key, value]) => {
        if (
            value === undefined ||
            value === null ||
            value === ''
        ) {
            return;
        }

        if (value instanceof File || value instanceof Blob) {
            formData.append(key, value);
            return;
        }

        formData.append(key, String(value));
    });
};

export const useAiRedistribusi = () => {
    const [materials, setMaterials] = useState([]);
    const [analysisResult, setAnalysisResult] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState(null);

    const analyzeImage = useCallback(async (payload) => {
        const file = resolveFile(payload);

        if (!file) {
            const message =
                'File gambar tidak ditemukan. Silakan pilih atau unggah foto material terlebih dahulu.';

            setError(message);
            setAnalysisResult(null);

            throw new Error(message);
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const formData = new FormData();

            formData.append(
                'image',
                file,
                file.name || 'material.jpg'
            );

            const response =
                await aiRedistribusiApi.analyzeMaterial(formData);

            const result = normalizeAnalysisResult(response);

            const hasValidResult =
                result.nama_material ||
                result.kategori ||
                result.result_data;

            if (!hasValidResult) {
                throw new Error(
                    'Server tidak mengembalikan hasil analisis AI yang valid.'
                );
            }

            setAnalysisResult(result);

            return result;
        } catch (error) {
            const message = getErrorMessage(
                error,
                'Gagal menganalisis gambar melalui AI.'
            );

            setError(message);
            setAnalysisResult(null);

            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const submitDistribusi = useCallback(
        async ({
            finalData = {},
            selectedProject = null,
            deliveryData = {},
            imagePayload = null
        }) => {
            setIsSubmitting(true);
            setError(null);

            try {
                const formData = new FormData();
                const file = resolveFile(imagePayload);

                if (file) {
                    formData.append(
                        'image',
                        file,
                        file.name || 'material.jpg'
                    );
                }

                const fields = {
                    nama_pemilik: finalData?.nama_pemilik,
                    no_hp: finalData?.no_hp,
                    nama_material: finalData?.nama_material,
                    kategori: finalData?.kategori,
                    kondisi_barang: finalData?.kondisi_barang,
                    deskripsi: finalData?.deskripsi,
                    bobot: finalData?.bobot,
                    alamat: finalData?.alamat,
                    lat: finalData?.lat,
                    longitude: finalData?.longitude,
                    catatan: finalData?.catatan,
                    metode_pengiriman: deliveryData?.metode,
                    project_id: selectedProject?.id
                };

                appendFormData(formData, fields);

                const response =
                    await aiRedistribusiApi.createMaterial(formData);

                const materialData =
                    extractResponseData(response);

                setMaterials((currentMaterials) => [
                    materialData,
                    ...currentMaterials
                ]);

                return materialData;
            } catch (error) {
                const message = getErrorMessage(
                    error,
                    'Gagal menyimpan data distribusi.'
                );

                setError(message);

                throw new Error(message);
            } finally {
                setIsSubmitting(false);
            }
        },
        []
    );

    const fetchMyMaterials = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response =
                await aiRedistribusiApi.getMyMaterials();

            const data = extractList(response);

            setMaterials(data);

            return data;
        } catch (error) {
            const message = getErrorMessage(
                error,
                'Gagal memuat daftar material Anda.'
            );

            setError(message);

            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchRecommendations = useCallback(async (pesan) => {
        const message =
            typeof pesan === 'string'
                ? pesan.trim()
                : '';

        if (!message) {
            const errorMessage =
                'Pesan kebutuhan material tidak boleh kosong.';

            setError(errorMessage);

            throw new Error(errorMessage);
        }

        setIsLoading(true);
        setError(null);

        try {
            return await aiRedistribusiApi.getRecommendations({
                pesan: message
            });
        } catch (error) {
            const errorMessage = getErrorMessage(
                error,
                'Gagal memuat rekomendasi AI.'
            );

            setError(errorMessage);

            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const claimItem = useCallback(
        async (materialId, claimData = {}) => {
            if (!materialId) {
                const message =
                    'ID material tidak ditemukan.';

                setError(message);

                throw new Error(message);
            }

            setIsLoading(true);
            setError(null);

            try {
                const response =
                    await aiRedistribusiApi.claimMaterial(
                        materialId,
                        claimData
                    );

                return extractResponseData(response);
            } catch (error) {
                const message = getErrorMessage(
                    error,
                    'Gagal memproses klaim material.'
                );

                setError(message);

                throw new Error(message);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearAnalysis = useCallback(() => {
        setAnalysisResult(null);
        setError(null);
    }, []);

    return {
        materials,
        analysisResult,

        isLoading,
        isSubmitting,

        error,

        analyzeImage,
        submitDistribusi,
        fetchMyMaterials,
        fetchRecommendations,
        claimItem,

        clearError,
        clearAnalysis
    };
};

export default useAiRedistribusi;