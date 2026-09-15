from django.db import models
from shop.models import MaterialForm
from django.contrib.auth import get_user_model

User = get_user_model()
class Klaim_Barang(models.Model):
    penerima = models.ForeignKey(User,on_delete=models.CASCADE)
    material = models.ForeignKey(MaterialForm,on_delete=models.CASCADE)
    nama_penerima = models.CharField(max_length=100)
    alamat_penerima = models.CharField(max_length=100)
    no_hp = models.IntegerField()
    catatan = models.TextField()
    
    lat_penerima = models.DecimalField(max_digits=9, decimal_places=6)
    longitude_penerima = models.DecimalField(max_digits=9, decimal_places=6)
    
    jarak_km = models.FloatField(default=0.0)
    biaya_ongkir = models.IntegerField(default=0)

    tanggal_klaim = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.user
    
    