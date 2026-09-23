export const redistribusiData = {
    impact: {
        period: "Q1 2026",
        totalWeight: "185",
        co2Reduced: "0.42t CO2e",
        facilitiesHelped: 3,
        facilityTypes: "Balai RW • Musala\nJalan Gang Warga",
        coins: 320
    },
    materials: [
        {
            id: 1,
            isFeatured: true,
            statusBadge: "Siap Disalurkan",
            category: "SEMEN & PEREKAT",
            title: "Semen Portland PCC 40kg",
            amount: "4 Sak (~160 Kg)",
            matchText: "Tercocokkan ke Musala Al-Ikhlas (Candisari)",
            progressText: "Menunggu Penjemputan Kurir",
            progressValue: 80,
            schedule: "Hari ini, 14.30 WIB",
            image: "/src/assets/img/semen-placeholder.jpg" // Sesuaikan path gambar Anda
        },
        {
            id: 2,
            isFeatured: false,
            aiVerified: true,
            category: "Kayu & Rangka",
            title: "Kayu Kaso Bekas Bekisting",
            desc: "Dijemput: Panitia Balai Warga • 12 Batang (3.8 m)",
            status: "Dalam Perjalanan",
            statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
            image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: 3,
            isFeatured: false,
            aiVerified: false,
            kurasiTag: "Kurasi Berjalan",
            category: "Lantai & Dinding",
            title: "Keramik Lantai Putih 30x30",
            desc: "Analisis Kualitas AI Sisain • 12 Dus (~18.5 m²)",
            status: "Validasi Citra (45%)",
            statusColor: "text-yellow-700 bg-yellow-50 border-yellow-200",
            image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=200"
        }
    ],
    projects: [
        {
            id: 1,
            isFeatured: true,
            badge: "URGENT FASUM • Candisari",
            location: "RT 03 / RW 05",
            title: "Perbaikan Jalan Gang Warga",
            desc: "Memanfaatkan semen & sisa paving block donatur untuk menutup lubang jalan akses warga lansia dan anak sekolah.",
            progress: 70,
            contribution: "Kontribusi Anda: 4 Sak Semen PCC",
            schedule: "Jadwal Kerja Bakti: Minggu, 08.00 WIB",
            image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 2,
            isFeatured: false,
            location: "Banyumanik",
            title: "Renovasi Tempat Wudhu Musala Nurul Huda",
            desc: "Butuh 5 Dus Keramik Sisa untuk lantai anti-slip.",
            progress: 70
        }
    ]
};