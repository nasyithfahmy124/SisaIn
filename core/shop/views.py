from rest_framework import viewsets, permissions
from .models import MaterialForm
from .serializers import MaterialFormSerializer

class MaterialPemilikViewSet(viewsets.ModelViewSet):
    serializer_class = MaterialFormSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_sekarang = self.request.user
        return MaterialForm.objects.filter(user=user_sekarang).order_by('-id')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)