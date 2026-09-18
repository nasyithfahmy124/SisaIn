import {
    ScanSearch,
    MapPinned,
    Trophy,
} from "lucide-react";

export const PILLARS = [
    {
        id: "01",
        key: "ai-valuasi",
        tagline: "SMART SCAN",
        title: "AI Valuasi Instan",
        description:
            "Deteksi jenis, kondisi, dan estimasi nilai material proyek dalam hitungan detik.",
        icon: ScanSearch,
        metric: "45 TON+",
        metricLabel: "material berhasil diselamatkan",
        color: "yellow",
    },
    {
        id: "02",
        key: "peta-realtime",
        tagline: "LIVE TRACKING",
        title: "Peta Real-Time",
        description:
            "Temukan pengepul dan proyek terdekat yang sedang membutuhkan material Anda.",
        icon: MapPinned,
        metric: "24",
        metricLabel: "partner aktif di sekitar",
        color: "green",
    },
    {
        id: "03",
        key: "reward-tier",
        tagline: "GAMIFIED IMPACT",
        title: "Reward Tier",
        description:
            "Kumpulkan poin dari setiap material yang diselamatkan dan lihat kontribusi Anda bertumbuh.",
        icon: Trophy,
        metric: "1,280",
        metricLabel: "impact points terkumpul",
        color: "dark",
    },
];