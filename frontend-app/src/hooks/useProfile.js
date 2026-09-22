import { useCallback, useEffect, useState } from 'react';
import { profileApi } from '../api/profileApi';

export const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [donations, setDonations] = useState([]);
    const [claims, setClaims] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);

    const loadProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await profileApi.getDashboard();

            setProfile(data.profile);
            setDonations(data.donations?.data || []);
            setClaims(data.claims?.data || []);
        } catch (err) {
            setError(err.message || 'Gagal memuat data profil.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateProfile = useCallback(async profileData => {
        setIsUpdating(true);
        setError(null);

        try {
            const data = await profileApi.updateProfile(profileData);

            setProfile(data);

            return data;
        } catch (err) {
            setError(err.message || 'Gagal memperbarui profil.');
            throw err;
        } finally {
            setIsUpdating(false);
        }
    }, []);

    const refreshProfile = useCallback(async () => {
        await loadProfile();
    }, [loadProfile]);

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            setIsLoading(false);
            return;
        }

        loadProfile();
    }, [loadProfile]);

    const donationTotal = donations.length;
    const claimTotal = claims.length;

    return {
        profile,
        donations,
        claims,
        donationTotal,
        claimTotal,
        isLoading,
        isUpdating,
        error,
        loadProfile,
        refreshProfile,
        updateProfile
    };
};