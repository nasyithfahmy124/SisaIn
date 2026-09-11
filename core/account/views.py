from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import RegisterSeri
from rest_framework.response import Response
from rest_framework import status

class RegistView(APIView):
    serializers_class = RegisterSeri
    def get(self, request):
        # Opsional: Agar saat URL dibuka di browser via GET tidak error 405
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