from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from core import views
from core.serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'vessels', views.VesselViewSet)
router.register(r'ports', views.PortViewSet)
router.register(r'history', views.VesselHistoryViewSet)
router.register(r'voyages', views.VoyageViewSet)
router.register(r'events', views.EventViewSet)
router.register(r'notifications', views.NotificationViewSet)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Endpoints
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/', include(router.urls)), 
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/password-reset/', views.PasswordResetRequestView.as_view(), name='password_reset'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),

    # --- FRONTEND SERVING ---
    # Serve the React index.html for the root
    path('', TemplateView.as_view(template_name='index.html')),
    
    # Catch-all: Redirect all other non-API routes to React
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]