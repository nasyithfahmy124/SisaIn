from django.urls import path
from .views import DaftarBarangTersediaAPIView, KlaimBarangAPIView,BarangDetailRekomendasi

urlpatterns = [
    path(
        'barang-tersedia/',
        DaftarBarangTersediaAPIView.as_view(),
        name='daftar_barang_tersedia',
    ),
    path("barang-rekomendasi-detail/<int:id>/", 
        BarangDetailRekomendasi.as_view(), 
        name="barang-rekomendasi-detail"),
    path(
        'barang-tersedia/klaim/<int:material_id>/',
        KlaimBarangAPIView.as_view(),
        name='klaim_barang',
    ),
]