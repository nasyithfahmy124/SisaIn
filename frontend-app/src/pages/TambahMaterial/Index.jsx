import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAiRedistribusi } from '../../hooks/useAiRedistribusi';

import FotoMaterialDesktop from '../../components/TambahMaterial/FotoMaterialDesktop';
import AnalisisAIDesktop from '../../components/TambahMaterial/AnalisisAIDesktop';
import KonfirmasiDesktop from '../../components/TambahMaterial/KonfirmasiDesktop';
import DistribusiDesktop from '../../components/TambahMaterial/DistribusiDesktop';
import AiMatchDesktop from '../../components/TambahMaterial/AiMatchDesktop';
import DetailKebutuhanDesktop from '../../components/TambahMaterial/DetailKebutuhanDesktop';
import KonfirmasiPengirimanDesktop from '../../components/TambahMaterial/KonfirmasiPengirimanDesktop';
import LacakPengirimanDesktop from '../../components/TambahMaterial/LacakPengirimanDesktop';

import FotoMaterialMobile from '../../components/TambahMaterial/FotoMaterialMobile';
import AnalisisAIMobile from '../../components/TambahMaterial/AnalisisAIMobile';
import KonfirmasiMobile from '../../components/TambahMaterial/KonfirmasiMobile';
import DistribusiMobile from '../../components/TambahMaterial/DistribusiMobile';
import AiMatchMobile from '../../components/TambahMaterial/AiMatchMobile';
import DetailKebutuhanMobile from '../../components/TambahMaterial/DetailKebutuhanMobile';
import KonfirmasiPengirimanMobile from '../../components/TambahMaterial/KonfirmasiPengirimanMobile';
import LacakPengirimanMobile from '../../components/TambahMaterial/LacakPengirimanMobile';

const INITIAL_STEP = 1;
const ENABLE_AI_MATCH_DEMO = true;
const DEMO_MODE = true;

export default function ProsesTambahMaterial() {
    const navigate = useNavigate();

    const {
        analyzeImage,
        submitDistribusi,
        isLoading: isAILoading,
        isSubmitting
    } = useAiRedistribusi();

    const [step, setStep] = useState(INITIAL_STEP);
    const [imagePayload, setImagePayload] = useState(null);
    const [hasilAI, setHasilAI] = useState(null);
    const [finalData, setFinalData] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [deliveryData, setDeliveryData] = useState(null);
    const [trackingId, setTrackingId] = useState(null);

    const goToStep = useCallback((nextStep) => {
        setStep(nextStep);
    }, []);

    const handleKirimKeAI = useCallback(async (payload) => {
        if (!payload) return;

        setImagePayload(payload);
        setHasilAI(null);
        setFinalData(null);
        setSelectedProject(null);
        setDeliveryData(null);
        setTrackingId(null);
        goToStep(2);

        try {
            const result = await analyzeImage(payload);
            setHasilAI(result);
        } catch {
            setHasilAI(null);
        }
    }, [analyzeImage, goToStep]);

    const handleLanjutKonfirmasi = useCallback((data) => {
        const analysisData = data?.finalData ?? data?.analysis ?? data?.aiData ?? data ?? {};

        setFinalData((current) => ({
            ...(current || {}),
            ...(hasilAI || {}),
            ...analysisData
        }));

        goToStep(3);
    }, [goToStep, hasilAI]);

    const handleLanjutDistribusi = useCallback((data) => {
        setFinalData((current) => ({
            ...(current || {}),
            ...(data || {})
        }));

        goToStep(4);
    }, [goToStep]);

    const handleSelesaiDistribusi = useCallback((distributionData) => {
        const mergedData = {
            ...(finalData || {}),
            ...(distributionData || {})
        };

        const mode = distributionData?.jalur_distribusi
            ?? distributionData?.distribution_mode
            ?? distributionData?.metode_distribusi
            ?? 'donasi';

        setFinalData(mergedData);

        if (mode === 'p2p') {
            navigate('/maps', {
                state: {
                    mode: 'p2p',
                    source: 'tambah-material',
                    materialData: mergedData,
                    imagePayload
                }
            });

            return;
        }

        goToStep(5);
    }, [finalData, goToStep, imagePayload, navigate]);

    const handlePilihProyek = useCallback((project) => {
        if (!project) return;

        setSelectedProject(project);

        setFinalData((current) => ({
            ...(current || {}),
            project_id: project?.id ?? project?.project_id ?? null,
            selected_project: project
        }));

        goToStep(6);
    }, [goToStep]);

    const handleLanjutPengiriman = useCallback((data) => {
        setFinalData((current) => ({
            ...(current || {}),
            ...(data || {})
        }));

        goToStep(7);
    }, [goToStep]);

    const handleSubmitSemuaData = useCallback(async (dataPengiriman) => {
        setDeliveryData(dataPengiriman);

        const namaPemilik = [
            profile?.first_name,
            profile?.last_name
        ]
            .filter(Boolean)
            .join(' ')
            .trim();

        const noHp = profile?.no_tlp ?? '';
        const alamatPemilik = profile?.alamat ?? '';

        const mergedFinalData = {
            ...(finalData || {}),
            nama_pemilik: namaPemilik,
            namaPemilik,
            no_hp: noHp,
            no_tlp: noHp,
            alamat: finalData?.alamat || alamatPemilik
        };

        console.log('=== KONFIRMASI PENGIRIMAN ===');
        console.log({
            demoMode: DEMO_MODE,
            dataPengiriman,
            finalData: mergedFinalData,
            selectedProject,
            profile
        });

        if (DEMO_MODE) {
            const demoTrackingId = `SISAIN-DEMO-${Date.now()
                .toString()
                .slice(-6)}`;

            const demoDeliveryData = {
                ...dataPengiriman,
                demo_mode: true,
                tracking_id: demoTrackingId
            };

            setFinalData({
                ...mergedFinalData,
                ...demoDeliveryData
            });

            setDeliveryData(demoDeliveryData);
            setTrackingId(demoTrackingId);
            goToStep(8);

            return;
        }

        try {
            const result = await submitDistribusi({
                finalData: mergedFinalData,
                selectedProject,
                deliveryData: dataPengiriman,
                imagePayload,
                profile
            });

            console.log('=== RESPONSE DISTRIBUSI ===');
            console.log(result);

            const trackingId =
                result?.tracking_id ??
                result?.trackingId ??
                result?.id ??
                result?.data?.tracking_id ??
                result?.data?.id;

            setFinalData(mergedFinalData);
            setTrackingId(trackingId ? String(trackingId) : null);

            goToStep(8);
        } catch (error) {
            console.error('=== ERROR DISTRIBUSI ===');
            console.error(error);
            console.error('message:', error?.message);
            console.error('status:', error?.status);
            console.error('data:', error?.data);

            window.alert(
                error?.message ||
                'Gagal menyimpan data distribusi.'
            );
        }
    }, [
        finalData,
        imagePayload,
        profile,
        selectedProject,
        submitDistribusi,
        goToStep
    ]);

    const handleReset = useCallback(() => {
        setStep(INITIAL_STEP);
        setImagePayload(null);
        setHasilAI(null);
        setFinalData(null);
        setSelectedProject(null);
        setDeliveryData(null);
        setTrackingId(null);
    }, []);

    const renderDesktop = () => {
        switch (step) {
            case 1:
                return (
                    <FotoMaterialDesktop
                        onNextStep={handleKirimKeAI}
                        isAILoading={isAILoading}
                    />
                );

            case 2:
                return (
                    <AnalisisAIDesktop
                        imagePayload={imagePayload}
                        aiData={hasilAI}
                        onBack={() => goToStep(1)}
                        onNext={handleLanjutKonfirmasi}
                    />
                );

            case 3:
                return (
                    <KonfirmasiDesktop
                        imagePayload={imagePayload}
                        finalData={finalData}
                        onBack={() => goToStep(2)}
                        onNext={handleLanjutDistribusi}
                    />
                );

            case 4:
                return (
                    <DistribusiDesktop
                        imagePayload={imagePayload}
                        finalData={finalData}
                        onBack={() => goToStep(3)}
                        onNext={handleSelesaiDistribusi}
                    />
                );

            case 5:
                return (
                    <AiMatchDesktop
                        finalData={finalData}
                        imagePayload={imagePayload}
                        enableDemoFallback={ENABLE_AI_MATCH_DEMO}
                        onBack={() => goToStep(4)}
                        onNext={handlePilihProyek}
                    />
                );

            case 6:
                return (
                    <DetailKebutuhanDesktop
                        projectData={selectedProject}
                        materialData={finalData}
                        onBack={() => goToStep(5)}
                        onNext={handleLanjutPengiriman}
                    />
                );

            case 7:
                return (
                    <KonfirmasiPengirimanDesktop
                        finalData={finalData}
                        projectData={selectedProject}
                        onBack={() => goToStep(6)}
                        onNext={handleSubmitSemuaData}
                    />
                );

            case 8:
                return (
                    <LacakPengirimanDesktop
                        trackingId={trackingId}
                        finalData={finalData}
                        projectData={selectedProject}
                        onBack={handleReset}
                    />
                );

            default:
                return null;
        }
    };

    const renderMobile = () => {
        switch (step) {
            case 1:
                return (
                    <FotoMaterialMobile
                        onNextStep={handleKirimKeAI}
                        isAILoading={isAILoading}
                    />
                );

            case 2:
                return (
                    <AnalisisAIMobile
                        imagePayload={imagePayload}
                        aiData={hasilAI}
                        onBack={() => goToStep(1)}
                        onNext={handleLanjutKonfirmasi}
                    />
                );

            case 3:
                return (
                    <KonfirmasiMobile
                        imagePayload={imagePayload}
                        finalData={finalData}
                        onBack={() => goToStep(2)}
                        onNext={handleLanjutDistribusi}
                    />
                );

            case 4:
                return (
                    <DistribusiMobile
                        imagePayload={imagePayload}
                        finalData={finalData}
                        onBack={() => goToStep(3)}
                        onNext={handleSelesaiDistribusi}
                    />
                );

            case 5:
                return (
                    <AiMatchMobile
                        finalData={finalData}
                        imagePayload={imagePayload}
                        onBack={() => goToStep(4)}
                        onNext={handlePilihProyek}
                    />
                );

            case 6:
                return (
                    <DetailKebutuhanMobile
                        projectData={selectedProject}
                        materialData={finalData}
                        onBack={() => goToStep(5)}
                        onNext={handleLanjutPengiriman}
                    />
                );

            case 7:
                return (
                    <KonfirmasiPengirimanMobile
                        finalData={finalData}
                        projectData={selectedProject}
                        onBack={() => goToStep(6)}
                        onNext={handleSubmitSemuaData}
                    />
                );

            case 8:
                return (
                    <LacakPengirimanMobile
                        trackingId={trackingId}
                        onBack={handleReset}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen">
            {isSubmitting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 px-6 backdrop-blur-sm">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#FFCC00]" />

                        <h3 className="text-lg font-black text-gray-900">
                            Memproses Rantai Sirkular...
                        </h3>

                        <p className="mt-1 text-xs font-medium text-gray-500">
                            Menyimpan data, gambar, kebutuhan, dan pengiriman.
                        </p>
                    </div>
                </div>
            )}

            <div className="hidden lg:block">
                {renderDesktop()}
            </div>

            <div className="block lg:hidden">
                {renderMobile()}
            </div>
        </div>
    );
}