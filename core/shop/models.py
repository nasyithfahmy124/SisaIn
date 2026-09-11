from django.db import models
from django.contrib.auth import get_user_model
import math

User = get_user_model()

class MaterialForm(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    nama_pemilik = models.CharField(max_length=100)
    no_hp = models.IntegerField()
    nama_material = models.CharField(max_length=100)
    kategori = models.CharField(max_length=100,
                                choices=[
                                    ('material','material'),
                                    ('batu','baru'),
                                    ('dll','dan lain lain')
                                ])
    deskripsi = models.TextField()
    kondisi_barang = models.CharField(max_length=50,
                                    choices=[
                                        ('baru','baru'),
                                        ('layak','layak  pakai'),
                                        ('perbaikan' , 'perlu perbaikan'),
                                        ('second','setengah pakai'),
                                    ],
                                    default='layak')
    image = models.ImageField(upload_to='donations/', blank=True, null=True)
    
    alamat = models.TextField()
    lat = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    
    catatan = models.TextField(default='Silahkan Ambill di Lokasi')
    
    def __str__(self):
        return self.nama_material
    
    # def hitung_jarak(self,lat_penerima,lng_penerima):
    #     radius_bumi = 6371
        
    #     lat1 = math.radians(float(self.lat))
    #     lon1 = math.radians(float(self.longitude))
    #     lat2 = math.radians(float(lat_penerima))
    #     lon2 = math.radians(float(lng_penerima))
        
        
    #     dlon = lon2 - lon1
    #     dlat = lat2 - lat1
        
    #     a = (
    #     math.sin(dlat / 2) ** 2
    #     + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2)
    #     c = 2 * math.asin(math.sqrt(a))

    #     jarak_km = radius_bumi * c
    #     return round(jarak_km, 2)
    
    # def simulasi_pengiriman(self, lat_penerima, lng_penerima):
    #     jarak_km = self.hitung_jarak(lat_penerima, lng_penerima)

    #     if jarak_km <= 10.0:
    #         biaya_ongkir = 0
    #         keterangan = 'Gratis Ongkir (Dalam Radius 10 km)'
    #         opsi_pengambilan = ['ambil_di_tempat', 'kurir_gratis']

    #     elif 10.0 < jarak_km <= 15.0:
    #         biaya_ongkir = 10000
    #         keterangan = 'Tarif Khusus (Radius 10-15 km)'
    #         opsi_pengambilan = ['ambil_di_tempat', 'pakai_kurir']

    #     else:
    #         tarif_dasar = 15000
    #         tarif_per_km = 2500
    #         kelebihan_jarak = jarak_km - 15
    #         biaya_ongkir = int(tarif_dasar + (kelebihan_jarak * tarif_per_km))
    #         keterangan = 'Jarak Jauh (> 15 km)'
    #         opsi_pengambilan = ['ambil_di_tempat', 'pakai_kurir']

    #     return {
    #         'jarak_km': jarak_km,
    #         'biaya_ongkir': biaya_ongkir,
    #         'keterangan_jarak': keterangan,
    #         'opsi_pengambilan': opsi_pengambilan,
    #     }