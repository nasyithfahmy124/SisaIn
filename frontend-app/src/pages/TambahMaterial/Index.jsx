import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAiRedistribusi } from '../../hooks/useAiRedistribusi';
import { useProfile } from '../../hooks/useProfile';

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
const ENABLE_AI_MATCH_DEMO = false;

export default function ProsesTambahMaterial() {
    const navigate = useNavigate();

    const {
        profile,
        isLoading: isProfileLoading
    } = useProfile();

    const {
        analyzeImage,
        submitDistribusi,
        isLoading: isAILoading,
        isSubmitting,
        error: aiError
    } = useAiRedistribusi();

    const [step, setStep] = useState(INITIAL_STEP);
    const [imagePayload, setImagePayload] = useState(null);
    const [hasilAI, setHasilAI] = useState(null);
    const [finalData, setFinalData] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [deliveryData, setDeliveryData] = useState(null);
    const [trackingId, setTrackingId] = useState(null);
    const [submitError, setSubmitError] = useState(null);

    const goToStep = useCallback((nextStep) => {
        setStep(nextStep);
    }, []);

    const handleKirimKeAI = useCallback(
        async (payload) => {
            if (!payload) {
                return;
            }

            setImagePayload(payload);
            setHasilAI(null);
            setFinalData(null);
            setSelectedProject(null);
            setDeliveryData(null);
            setTrackingId(null);
            setSubmitError(null);

            goToStep(2);

            try {
                const result = await analyzeImage(payload);

                setHasilAI(result);
            } catch (error) {
                console.error('=== ERROR ANALISIS AI ===');
                console.error(error);

                setHasilAI(null);
            }
        },
        [analyzeImage, goToStep]
    );

    const handleLanjutKonfirmasi = useCallback(
        (data) => {
            const analysisData =
                data?.finalData ??
                data?.analysis ??
                data?.aiData ??
                data ??
                {};

            setFinalData((current) => ({
                ...(current || {}),
                ...(hasilAI || {}),
                ...analysisData
            }));

            goToStep(3);
        },
        [goToStep, hasilAI]
    );

    const handleLanjutDistribusi = useCallback(
        (data) => {
            setFinalData((current) => ({
                ...(current || {}),
                ...(data || {})
            }));

            goToStep(4);
        },
        [goToStep]
    );

    const handleSelesaiDistribusi = useCallback(
        (distributionData) => {
            const mergedData = {
                ...(finalData || {}),
                ...(distributionData || {})
            };

            const mode =
                distributionData?.jalur_distribusi ??
                distributionData?.distribution_mode ??
                distributionData?.metode_distribusi ??
                'redistribusi';

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
        },
        [
            finalData,
            goToStep,
            imagePayload,
            navigate
        ]
    );

    const handlePilihProyek = useCallback(
        (project) => {
            if (!project) {
                return;
            }

            const projectId =
                project?.id ??
                project?.project_id ??
                null;

            setSelectedProject(project);

            setFinalData((current) => ({
                ...(current || {}),
                project_id: projectId,
                selected_project: project
            }));

            goToStep(6);
        },
        [goToStep]
    );

    const handleLanjutPengiriman = useCallback(
        (data) => {
            setFinalData((current) => ({
                ...(current || {}),
                ...(data || {})
            }));

            goToStep(7);
        },
        [goToStep]
    );

    const handleSubmitSemuaData = useCallback(
        async (dataPengiriman) => {
            if (isSubmitting) {
                return;
            }

            setSubmitError(null);
            setDeliveryData(dataPengiriman);

            if (!profile && !isProfileLoading) {
                const message =
                    'Data profil belum tersedia. Silakan login kembali atau lengkapi profil terlebih dahulu.';

                setSubmitError(message);

                window.alert(message);

                return;
            }

            const namaPemilik = [
                profile?.first_name,
                profile?.last_name
            ]
                .filter(Boolean)
                .join(' ')
                .trim();

            const fallbackName =
                profile?.username ??
                profile?.name ??
                '';

            const noHp =
                profile?.no_tlp ??
                profile?.no_hp ??
                profile?.phone ??
                '';

            const alamatPemilik =
                profile?.alamat ??
                profile?.address ??
                '';

            const mergedFinalData = {
                ...(finalData || {}),

                nama_pemilik:
                    namaPemilik || fallbackName,

                namaPemilik:
                    namaPemilik || fallbackName,

                no_hp: noHp,
                no_tlp: noHp,

                alamat:
                    finalData?.alamat ||
                    alamatPemilik
            };

            console.log('=== SUBMIT REDISTRIBUSI ===');
            console.log({
                dataPengiriman,
                finalData: mergedFinalData,
                selectedProject,
                profile
            });

            try {
                const result = await submitDistribusi({
                    finalData: mergedFinalData,
                    selectedProject,
                    deliveryData: dataPengiriman,
                    imagePayload
                });

                console.log('=== RESPONSE REDISTRIBUSI ===');
                console.log(result);

                const responseData =
                    result?.data ??
                    result;

                const newTrackingId =
                    responseData?.tracking_id ??
                    responseData?.trackingId ??
                    responseData?.id ??
                    responseData?.kode_tracking ??
                    null;

                const completedData = {
                    ...mergedFinalData,
                    ...(result || {})
                };

                setFinalData(completedData);

                setTrackingId(
                    newTrackingId
                        ? String(newTrackingId)
                        : null
                );

                setDeliveryData(dataPengiriman);

                goToStep(8);
            } catch (error) {
                console.error(
                    '=== ERROR REDISTRIBUSI ==='
                );

                console.error(error);

                console.error(
                    'message:',
                    error?.message
                );

                console.error(
                    'status:',
                    error?.status
                );

                console.error(
                    'data:',
                    error?.data
                );

                const message =
                    error?.message ||
                    'Gagal menyimpan data redistribusi. Silakan coba kembali.';

                setSubmitError(message);

                window.alert(message);
            }
        },
        [
            finalData,
            imagePayload,
            isProfileLoading,
            isSubmitting,
            profile,
            selectedProject,
            submitDistribusi,
            goToStep
        ]
    );

    const handleReset = useCallback(() => {
        setStep(INITIAL_STEP);
        setImagePayload(null);
        setHasilAI(null);
        setFinalData(null);
        setSelectedProject(null);
        setDeliveryData(null);
        setTrackingId(null);
        setSubmitError(null);
    }, []);

    const renderDesktop = useCallback(() => {
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
                        enableDemoFallback={
                            ENABLE_AI_MATCH_DEMO
                        }
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
    }, [
        finalData,
        goToStep,
        handleKirimKeAI,
        handleLanjutKonfirmasi,
        handleLanjutDistribusi,
        handlePilihProyek,
        handleReset,
        handleSelesaiDistribusi,
        handleSubmitSemuaData,
        hasilAI,
        imagePayload,
        isAILoading,
        selectedProject,
        step,
        trackingId
    ]);

    const renderMobile = useCallback(() => {
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
                        enableDemoFallback={
                            ENABLE_AI_MATCH_DEMO
                        }
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
                        finalData={finalData}
                        onBack={handleReset}
                    />
                );

            default:
                return null;
        }
    }, [
        finalData,
        goToStep,
        handleKirimKeAI,
        handleLanjutKonfirmasi,
        handleLanjutDistribusi,
        handlePilihProyek,
        handleReset,
        handleSelesaiDistribusi,
        handleSubmitSemuaData,
        hasilAI,
        imagePayload,
        isAILoading,
        selectedProject,
        step,
        trackingId
    ]);

    const hasBlockingError =
        Boolean(aiError || submitError);

    return (
        <div className="min-h-screen">
            {isSubmitting && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 px-6 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl">
                        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#FFCC00]" />

                        <h3 className="text-lg font-black text-gray-900">
                            Memproses Rantai Sirkular...
                        </h3>

                        <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">
                            Menyimpan data material, gambar,
                            kebutuhan, dan pengiriman.
                        </p>
                    </div>
                </div>
            )}

            {hasBlockingError && step === 2 && (
                <div className="fixed bottom-5 left-1/2 z-[90] w-[calc(100%-32px)] max-w-lg -translate-x-1/2 rounded-2xl border border-red-100 bg-white px-4 py-3 shadow-xl">
                    <p className="text-sm font-semibold leading-relaxed text-red-600">
                        {aiError ||
                            'Analisis AI gagal diproses.'}
                    </p>
                </div>
            )}

            {hasBlockingError && step >= 7 && (
                <div className="fixed bottom-5 left-1/2 z-[90] w-[calc(100%-32px)] max-w-lg -translate-x-1/2 rounded-2xl border border-red-100 bg-white px-4 py-3 shadow-xl">
                    <p className="text-sm font-semibold leading-relaxed text-red-600">
                        {submitError}
                    </p>
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