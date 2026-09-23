import React, { useState } from 'react';
import FotoMaterialDesktop from '../../components/TambahMaterial/FotoMaterialDesktop'
import FotoMaterialMobile from '../../components/TambahMaterial/FotoMaterialMobile';
import AnalisisAIDesktop from '../../components/TambahMaterial/AnalisisAIDesktop';
import AnalisisAIMobile from '../../components/TambahMaterial/AnalisisAIMobile';
import KonfirmasiDesktop from '../../components/TambahMaterial/KonfirmasiDesktop';

export default function ProsesTambahMaterial() {
    const [step, setStep] = useState(1);
    const [imagePayload, setImagePayload] = useState(null);
    const [hasilAI, setHasilAI] = useState(null);
    const [isAILoading, setIsAILoading] = useState(false);

    const handleKirimKeAI = async (payload) => {
        setImagePayload(payload);
        setStep(2);
        setIsAILoading(true);

        if (payload.isSimulated || !payload.file) {
            setTimeout(() => {
                setHasilAI({ 
                    category: 'Semen Portland Composite (PCC 40kg)', 
                    weight: 160,
                    quantity: 4,
                    condition: 'Grade A',
                    location: 'Jl. Pandanaran No. 42, Candisari, Semarang'
                });
                setIsAILoading(false);
            }, 2400);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', payload.file);

            const response = await fetch('http://localhost:8000/api/ai/analyze/', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const data = await response.json();
            setHasilAI(data);
        } catch (error) {
            console.error('Gagal diproses AI:', error);
            setHasilAI({ 
                category: 'Semen Portland Composite (PCC)', 
                weight: 160, quantity: 4, condition: 'Grade A' 
            });
        } finally {
            setIsAILoading(false);
        }
    };

    const handleKembali = (targetStep) => {
        setStep(targetStep);
    };

    const handleLanjutKonfirmasi = (finalData) => {
        setHasilAI(finalData);
        setStep(3);
    };

    const handleSubmitFinal = async (finalVerifiedData) => {
        console.log("Data siap dikirim ke Backend (Distribusi):", finalVerifiedData);
        // TODO: Hit API final submission di sini (POST ke endpoint material)
        setStep(4);
    };

    return (
        <div>
            {/* TAMPILAN DESKTOP */}
            <div className="hidden lg:block">
                {step === 1 && <FotoMaterialDesktop onNextStep={handleKirimKeAI} />}
                {step === 2 && (
                    <AnalisisAIDesktop 
                        imagePayload={imagePayload} 
                        onBack={() => handleKembali(1)}
                        onNext={handleLanjutKonfirmasi}
                    />
                )}
                {step === 3 && (
                    <KonfirmasiDesktop 
                        imagePayload={imagePayload}
                        aiData={hasilAI}
                        onBack={() => handleKembali(2)}
                        onNext={handleSubmitFinal}
                    />
                )}
                {step === 4 && (
                    <div className="min-h-screen flex items-center justify-center font-bold text-xl">
                        Halaman 04 Distribusi (Segera Hadir)
                    </div>
                )}
            </div>

            {/* TAMPILAN MOBILE (Placeholder sementara) */}
            <div className="block lg:hidden">
                {step === 1 && <FotoMaterialMobile onNextStep={handleKirimKeAI} />}
                {step === 2 && (
                    <AnalisisAIMobile 
                        imagePayload={imagePayload} 
                        onBack={() => handleKembali(1)}
                        onNext={handleLanjutKonfirmasi}
                    />
                )}
                {step === 3 && (
                    <div className="min-h-screen flex items-center justify-center font-bold text-lg px-4 text-center">
                        Halaman Konfirmasi Mobile (Segera Hadir)
                    </div>
                )}
            </div>
        </div>
    );
}