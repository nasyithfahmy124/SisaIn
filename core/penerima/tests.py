from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIRequestFactory

from shop.models import MaterialForm
from .serializers import MaterialListSerializer
from .views import KlaimBarangAPIView

User = get_user_model()


class PenerimaApiTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='penerima',
            email='penerima@example.com',
            password='Password123',
        )
        self.material = MaterialForm.objects.create(
            user=self.user,
            nama_pemilik='Donatur',
            no_hp='08123456789',
            nama_material='Kayu',
            kategori='material',
            deskripsi='Deskripsi kayu',
            kondisi_barang='layak',
            alamat='Jl. Contoh No. 12',
            lat='-6.200000',
            longitude='106.800000',
            tersedia=True,
        )

    def test_material_list_serializer_uses_tersedia_flag(self):
        payload = MaterialListSerializer(self.material).data
        self.assertTrue(payload['is_tersedia'])
        self.assertTrue(self.material.tersedia)

    def test_claim_api_accepts_valid_payload_and_marks_material_unavailable(self):
        factory = APIRequestFactory()
        payload = {
            'nama_penerima': 'Budi',
            'alamat_penerima': 'Jl. Pahlawan 2',
            'no_hp_penerima': '0811223344',
            'catatan': 'Ambil hari Jumat',
            'lat_penerima': '-6.210000',
            'longitude_penerima': '106.810000',
            'metode_pilihan': 'ambil_di_tempat',
        }
        request = factory.post(
            f'/penerima/klaim/{self.material.id}/',
            payload,
            format='json',
        )
        request.user = self.user

        response = KlaimBarangAPIView.as_view()(request, material_id=self.material.id)

        self.assertEqual(response.status_code, 201)
        self.material.refresh_from_db()
        self.assertFalse(self.material.tersedia)
