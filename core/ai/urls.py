from django.urls import path
from .views import RekomendasiMaterialAIView,ProsesAnalisisAIView

urlpatterns = [
    path('rekomendasi/', RekomendasiMaterialAIView.as_view(), name='ai-rekomendasi-material'),
    path('ai-analisis/',ProsesAnalisisAIView.as_view(),name='ai_analisis')
]