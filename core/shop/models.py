from django.db import models
from django.contrib.auth import get_user_model
import math

User = get_user_model()

class MaterialForm(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    nama_pemilik = models.CharField(max_length=100)
    no_hp = models.CharField(max_length=50)
    nama_material = models.CharField(max_length=100)
    kategori = models.CharField(max_length=100,
                                choices=[
                                    ('material','material'),
                                    ('batu','baru'),
                                    ('dll','dan lain lain')
                                ])
    deskripsi = models.TextField()
    bobot = models.DecimalField(max_digits=5, decimal_places=1,default=0.0)
    kondisi_barang = models.CharField(max_length=50,
                                    choices=[
                                        ('baru','baru'),
                                        ('layak','layak  pakai'),
                                        ('perbaikan' , 'perlu perbaikan'),
                                        ('second','setengah pakai'),
                                    ],
                                    default='layak')
    image = models.ImageField(upload_to='donations/', blank=True, null=True)
    tersedia = models.BooleanField(default=True)
    alamat = models.TextField()
    lat = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    catatan = models.TextField(default='Silahkan Ambill di Lokasi')
    created = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    def __str__(self):
        return self.nama_material
    
