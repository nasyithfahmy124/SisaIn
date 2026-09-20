from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from rest_framework_simplejwt.views import  TokenRefreshView
from .views import GoogleLoginAPIView,ProfileView,UpdateProfileView

urlpatterns = [
    #login form
    path('register/', views.RegistView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/', TokenRefreshView.as_view(), name='token_refresh'),
    #login google
    path('log/',GoogleLoginAPIView.as_view(),name='login_google'),
    #get profile
    path('profil/',ProfileView.as_view(),name='profil_user'),
    #update profile
    path('profil-update/',UpdateProfileView.as_view(),name='profil_update')
]