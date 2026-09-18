import math
from rest_framework import serializers
from .models import Klaim_Barang, MaterialForm


class MaterialListSerializer(serializers.ModelSerializer):

    simulasi_pengiriman = serializers.SerializerMethodField()
    nama_pemilik_akun = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = MaterialForm
        fields = [
            'id',
            'nama_pemilik_akun',
            'nama_pemilik',
            'no_hp',
            'nama_material',
            'kategori',
            'deskripsi',
            'kondisi_barang',
            'image',
            'alamat',
            'lat',
            'longitude',
            'catatan',
            'tersedia',
            'simulasi_pengiriman',
        ]

    def hitung_jarak(self, lat1, lon1, lat2, lon2):
        radius_bumi = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.asin(math.sqrt(a))
        return round(radius_bumi * c, 2)

    def get_simulasi_pengiriman(self, obj):
        request = self.context.get('request')
        if request:
            lat_penerima = request.query_params.get('lat_penerima')
            lng_penerima = request.query_params.get('lng_penerima')

        if lat_penerima and lng_penerima:
            try:
                lat_penerima = float(lat_penerima)
                lng_penerima = float(lng_penerima)

                jarak_km = self.hitung_jarak(
                    float(obj.lat), float(obj.longitude), lat_penerima, lng_penerima
                )

                if jarak_km <= 10.0:
                    biaya_ongkir = 0
                    keterangan = 'Gratis Ongkir (Dalam Radius 10 km)'
                    opsi_pengambilan = ['ambil_di_tempat', 'kurir_gratis']
                elif 10.0 < jarak_km <= 15.0:
                    biaya_ongkir = 10000
                    keterangan = 'Tarif Khusus (Radius 10-15 km)'
                    opsi_pengambilan = ['ambil_di_tempat', 'pakai_kurir']
                else:
                    tarif_dasar = 15000
                    tarif_per_km = 2500
                    biaya_ongkir = int(
                        tarif_dasar + ((jarak_km - 15) * tarif_per_km)
                    )
                    keterangan = 'Jarak Jauh (> 15 km)'
                    opsi_pengambilan = ['ambil_di_tempat', 'pakai_kurir']

                return {
                    'jarak_km': jarak_km,
                    'biaya_ongkir': biaya_ongkir,
                    'keterangan_jarak': keterangan,
                    'opsi_pengambilan': opsi_pengambilan,
                }
            except ValueError:
                return {'error': 'Format koordinat penerima tidak valid.'}

        return {
            'pesan': (
                'Kirim parameter ?lat_penerima=...&lng_penerima=... untuk melihat'
                ' estimasi ongkir.'
            )
        }


class KlaimDonasiSerializer(serializers.ModelSerializer):

        class Meta:
            model = Klaim_Barang
            fields = [
                'id',
                'material',
                'nama_penerima',
                'no_hp',
                'alamat_penerima',
                'lat_penerima',
                'longitude_penerima',
                # 'metode_pilihan',
                'jarak_km',
                'biaya_ongkir',
                'tanggal_klaim',
            ]
            read_only_fields = [
                'id',
                'jarak_km',
                'biaya_ongkir',
                'tanggal_klaim',
            ]  