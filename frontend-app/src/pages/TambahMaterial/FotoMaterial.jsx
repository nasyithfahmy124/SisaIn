import React from 'react';
import FotoMaterialDesktop from '../../components/TambahMaterial/FotoMaterialDesktop';
import FotoMaterialMobile from '../../components/TambahMaterial/FotoMaterialMobile';

export default function FotoMaterial({ onNextStep }) {
    const handleLanjutAnalisis = (imagePayload) => {
        console.log("Memproses payload gambar:", imagePayload);
        if (onNextStep) {
            onNextStep(imagePayload);
        }
    };

    return (
        <>
            {/* Tampil hanya di layar besar (Laptop/PC) */}
            <div className="hidden lg:block">
                <FotoMaterialDesktop onNextStep={handleLanjutAnalisis} />
            </div>

            {/* Tampil hanya di layar kecil (HP/Tablet) */}
            <div className="block lg:hidden">
                <FotoMaterialMobile onNextStep={handleLanjutAnalisis} />
            </div>
        </>
    );
}