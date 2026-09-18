import math
from rest_framework import status,generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Klaim_Barang
from shop.models import MaterialForm
from .serializers import KlaimDonasiSerializer, MaterialListSerializer
from django.shortcuts  import get_object_or_404


class DaftarBarangTersediaAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        barang = MaterialForm.objects.filter(tersedia=True).order_by('-id')
        serializer = MaterialListSerializer(
            barang, many=True, context={'request': request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

class BarangDetailRekomendasi(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,id):
        barang = MaterialForm.objects.get(id=id)
        serializer = MaterialListSerializer(
            barang,
            context={'request':request})
        return Response(serializer.data,status=status.HTTP_200_OK)
    
class KlaimBarangAPIView(generics.CreateAPIView):

    queryset = Klaim_Barang.objects.all()
    serializer_class = KlaimDonasiSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        material_id = self.kwargs.get('material_id')
        try:
            material = MaterialForm.objects.get(id=material_id)
        except MaterialForm.DoesNotExist:
            return Response(
                {'detail': 'Barang tidak ditemukan.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not material.tersedia:
            return Response(
                {'detail': 'Maaf, barang ini sudah diklaim oleh orang lain.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = request.data.copy()
        data['material'] = material.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        lat_penerima = float(serializer.validated_data['lat_penerima'])
        lng_penerima = float(serializer.validated_data['longitude_penerima'])

        def hitung_jarak(lat1, lon1, lat2, lon2):
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

        jarak_km = hitung_jarak(
            float(material.lat), float(material.longitude), lat_penerima, lng_penerima
        )

        if jarak_km <= 10.0:
            biaya_ongkir = 0
        elif 10.0 < jarak_km <= 15.0:
            biaya_ongkir = 10000
        else:
            biaya_ongkir = int(15000 + ((jarak_km - 15) * 2500))

        klaim = serializer.save(
            penerima=request.user, jarak_km=jarak_km, biaya_ongkir=biaya_ongkir
        )
        material.tersedia = False
        material.save()

        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                'pesan': 'Barang berhasil diklaim!',
                'data_klaim': serializer.data,
            },
            status=status.HTTP_201_CREATED,
            headers=headers,
        )