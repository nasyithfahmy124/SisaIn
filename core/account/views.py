from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from .serializers import RegisterSeri,ProfileSeri,UpdateProfileSeri,RiwayatDonasiSeri,RiwayatKlaimBarang
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import AkunProfile
from shop.models import MaterialForm
from shop.serializers import MaterialFormSerializer
from penerima.models import Klaim_Barang

User = get_user_model()


class RegistView(APIView):
    permission_classes = [AllowAny]     # <-- Izinkan siapa saja mengakses tanpa auth/sesi
    authentication_classes = []
    serializer_class = RegisterSeri
    def get(self, request):
        return Response({'message': 'Silakan kirim request POST untuk mendaftar.'})
    
    def post(self,request):
        seri = RegisterSeri(data=request.data)
        if seri.is_valid():
            seri.save()
            return Response(
                {'message' : 'Akun berhasil dibuat!'},
                status=status.HTTP_200_OK
            )
        return Response(seri.errors,status.HTTP_400_BAD_REQUEST)
    

class GoogleLoginAPIView(APIView):
    permission_classes = [] 

    def post(self, request):
        token = request.data.get('token')
        
        if not token:
            return Response({'error': 'Token Google tidak ditemukan.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )

            email = idinfo.get('email')
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')

            if not email:
                return Response({'error': 'Akun Google tidak memiliki email.'}, status=status.HTTP_400_BAD_REQUEST)
            user, created = User.objects.get_or_create(
                username=email, 
                defaults={
                    'email': email, 
                    'first_name': first_name, 
                    'last_name': last_name
                }
            )
            refresh = RefreshToken.for_user(user)

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Login Google berhasil',
                'user': {
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({'error': f'Token Google tidak valid: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        akun,created = AkunProfile.objects.get_or_create(user=request.user,defaults={'email':request.user.email})
        serializer = ProfileSeri(akun,context={'request':request})
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    
class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self,request):
        akun = get_object_or_404(AkunProfile,user=request.user)
        serializer = UpdateProfileSeri(akun,
                                    data=request.data,
                                    partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
class ProfileRiwayatDonasi(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        material = MaterialForm.objects.filter(user=request.user).order_by('-created')
        serializer = RiwayatDonasiSeri(material,many=True)
        return Response({
            "status": "success",
            "total": material.count(),
            "data": serializer.data
        }, status=status.HTTP_200_OK)

class ProfileRiwayatKlaim(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        klaim = Klaim_Barang.objects.filter(penerima=request.user).order_by('-tanggal_klaim')
        if not klaim.exists():
            return Response({
                "status": "success",
                "message": "Tidak ada barang yang diklaim.",
                "count": 0,
                "data": []
            }, status=status.HTTP_200_OK)
        serializer = RiwayatKlaimBarang(klaim, many=True)
        
        return Response({
            "status": "success",
            "count": klaim.count(),
            "data": serializer.data
        }, status=status.HTTP_200_OK)
        
    