import { useCallback, useEffect, useState } from 'react';
import { profileApi } from '../api/profileApi';

const getProfileData = (response) => {
    if (!response) return null;

    if (response?.profile) {
        return response.profile;
    }

    if (response?.data?.profile) {
        return response.data.profile;
    }

    if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        return response.data;
    }

    return response;
};

const getListData = (response) => {
    if (!response) return [];

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.results)) {
        return response.results;
    }

    if (Array.isArray(response?.data?.results)) {
        return response.data.results;
    }

    return [];
};

const getErrorMessage = (error, fallbackMessage) => {
    if (typeof error === 'string') {
        return error;
    }

    if (error?.response?.data?.detail) {
        return error.response.data.detail;
    }

    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    if (error?.message) {
        return error.message;
    }

    return fallbackMessage;
};

export const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [donations, setDonations] = useState([]);
    const [claims, setClaims] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const [error, setError] = useState(null);

    const loadProfile = useCallback(async () => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            setProfile(null);
            setDonations([]);
            setClaims([]);
            setError(null);
            setIsLoading(false);

            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const profileResponse = await profileApi.getProfile();
            const profileData = getProfileData(profileResponse);

            setProfile(profileData);

            const [donationResult, claimResult] = await Promise.allSettled([
                profileApi.getDonationHistory(),
                profileApi.getClaimHistory()
            ]);

            if (donationResult.status === 'fulfilled') {
                const donationData = getListData(donationResult.value);

                setDonations(donationData);
            }

            if (claimResult.status === 'fulfilled') {
                const claimData = getListData(claimResult.value);

                setClaims(claimData);
            }

            return profileData;
        } catch (error) {
            const message = getErrorMessage(
                error,
                'Gagal memuat data profil.'
            );

            setError(message);

            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateProfile = useCallback(async (profileData) => {
        if (!profileData || typeof profileData !== 'object') {
            return null;
        }

        setIsUpdating(true);
        setError(null);

        try {
            const response = await profileApi.updateProfile(profileData);
            const updatedProfile = getProfileData(response);

            if (updatedProfile) {
                setProfile((currentProfile) => ({
                    ...(currentProfile || {}),
                    ...updatedProfile
                }));
            }

            try {
                const refreshedResponse = await profileApi.getProfile();
                const refreshedProfile = getProfileData(refreshedResponse);

                if (refreshedProfile) {
                    setProfile(refreshedProfile);

                    return refreshedProfile;
                }
            } catch (refreshError) {
                console.warn(
                    'Profil berhasil diperbarui, tetapi refresh gagal:',
                    refreshError
                );
            }

            return updatedProfile;
        } catch (error) {
            const message = getErrorMessage(
                error,
                'Gagal memperbarui data profil.'
            );

            setError(message);

            throw error;
        } finally {
            setIsUpdating(false);
        }
    }, []);

    const refreshProfile = useCallback(async () => {
        return loadProfile();
    }, [loadProfile]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    return {
        profile,

        donations,
        claims,

        donationTotal: donations.length,
        claimTotal: claims.length,

        isLoading,
        isUpdating,

        error,

        loadProfile,
        refreshProfile,
        updateProfile
    };
};

export default useProfile;