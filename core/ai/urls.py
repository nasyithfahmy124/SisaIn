from django.urls import path
from .views import RekomendasiMaterialAIView

urlpatterns = [
    path('rekomendasi/', RekomendasiMaterialAIView.as_view(), name='ai-rekomendasi-material'),
]