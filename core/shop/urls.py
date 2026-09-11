from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaterialPemilikViewSet

router = DefaultRouter()
router.register(r'barang-saya', MaterialPemilikViewSet, basename='barang-saya')

urlpatterns = [
    path('api/', include(router.urls)),
]