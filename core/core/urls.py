from django.contrib import admin
from django.urls import path,include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    path('admin/', admin.site.urls),
    path('',include('account.urls')),
    path('',include('shop.urls')),
    path('', include('penerima.urls')),
    path('',include('ai.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api-doc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
