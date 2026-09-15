import os
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.urls import reverse
from google import genai
from .serializers import ChatRekomendasiSerializer
load_dotenv()

try:
    from shop.models import MaterialForm
except ImportError:
    MaterialForm = None

class RekomendasiMaterialAIView(APIView):
    def post(self, request):
        serializer = ChatRekomendasiSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        pesan_user = serializer.validated_data['pesan']
        if MaterialForm:
            queryset = MaterialForm.objects.all()
            daftar_barang = []
            for item in queryset:
                try:
                    detail_url = request.build_absolute_uri(reverse('material-detail', args=[item.id]))
                except Exception:
                    detail_url = f"barang-rekomendasi-detail/{item.id}/"
                daftar_barang.append({
                    "id": item.id,
                    "nama_material": item.nama_material,
                    "kategori": item.kategori,
                    "kondisi_barang": item.kondisi_barang,
                    "alamat": item.alamat,
                    "link_detail": detail_url 
                })
        else:
            daftar_barang = [
                {
                    "id": 1, 
                    "nama_material": "Semen Gresik", 
                    "kategori": "Semen", 
                    "kondisi_barang": "Baru", 
                    "alamat": "Ngaliyan, Semarang",
                    "link_detail": "http://127.0.0.1:8000/barang-rekomendasi-detail/2/"
                },
                {
                    "id": 2, 
                    "nama_material": "Pasir Merapi", 
                    "kategori": "Pasir", 
                    "kondisi_barang": "Layak Pakai", 
                    "alamat": "Bringin, Semarang",
                    "link_detail": "http://127.0.0.1:8000/barang-rekomendasi-detail/3/"
                }
            ]
        try:
            client = genai.Client()
        except Exception as e:
            return Response(
                {"error": f"Gagal menginisialisasi Gemini Client: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        prompt = f"""
        Anda adalah AI Asisten Pintar untuk aplikasi donasi material bangunan bernama SisaIn.
        Tugas Anda adalah merekomendasikan material bangunan yang tersedia berdasarkan kebutuhan user.

        Keluhan/Kebutuhan User: "{pesan_user}"

        Daftar Material Donasi yang Tersedia (lengkap dengan link-nya):
        {daftar_barang}

        Instruksi:
        1. Analisis material apa saja yang cocok untuk kebutuhan user tersebut dari daftar di atas.
        2. Berikan balasan yang ramah.
        3. Saat menyebutkan material yang direkomendasikan, **wajib mencantumkan link** (ambil dari properti `link_detail`) ke dalam teks balasannya agar user bisa mengkliknya.
        """
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            rekomendasi_teks = response.text
        except Exception as e:
            return Response(
                {"error": f"Terjadi kesalahan saat memproses AI: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            "status": "success",
            "pesan_user": pesan_user,
            "rekomendasi_ai": rekomendasi_teks,
            "daftar_rekomendasi_mentah": daftar_barang 
        }, status=status.HTTP_200_OK)