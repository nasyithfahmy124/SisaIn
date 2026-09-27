import { useCallback, useEffect, useState } from 'react';
import { profileApi } from '../api/profileApi';

const getProfileData = (data) => {
    if (!data) return null;
    if (data?.profile) return data.profile;
    if (data?.data?.profile) return data.data.profile;
    if (data?.data && typeof data.data === 'object') return data.data;
    return data;
};

const getListData = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
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

            if (profileData) {
                setProfile(profileData);
            }

            const [donationResult, claimResult] = await Promise.allSettled([
                profileApi.getDonationHistory(),
                profileApi.getClaimHistory()
            ]);

            if (donationResult.status === 'fulfilled') {
                setDonations(getListData(donationResult.value));
            }

            if (claimResult.status === 'fulfilled') {
                setClaims(getListData(claimResult.value));
            }

            return profileData;
        } catch (err) {
            const message = err?.message || 'Gagal memuat data profil.';
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateProfile = useCallback(async (profileData) => {
        setIsUpdating(true);
        setError(null);

        try {
            const response = await profileApi.updateProfile(profileData);
            const updatedProfile = getProfileData(response);

            if (updatedProfile) {
                setProfile((current) => ({
                    ...(current || {}),
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
                    'Profile berhasil disimpan, tetapi refresh gagal:',
                    refreshError
                );
            }

            return updatedProfile;
        } catch (err) {
            const message = err?.message || 'Gagal memperbarui data profil.';
            setError(message);
            throw err;
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