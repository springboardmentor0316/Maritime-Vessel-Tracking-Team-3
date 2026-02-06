from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core import views  # Importing your expanded views from the core app [cite: 151]
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# 1. Initialize the Router for Milestone 1 & 4 [cite: 151, 40]
router = DefaultRouter()

# 2. Register all ViewSets to fulfill the Platform Modules [cite: 13-19, 151]
router.register(r'users', views.UserViewSet)         # Module 1: Auth & Role Management [cite: 13]
router.register(r'vessels', views.VesselViewSet)     # Module 2: Live Tracking [cite: 14]
router.register(r'ports', views.PortViewSet)         # Module 3: Port Congestion [cite: 15]
router.register(r'history', views.VesselHistoryViewSet) # Module 5: History Logs [cite: 17]
router.register(r'voyages', views.VoyageViewSet)     # Module 5: Voyage Replay & Audit [cite: 17]
router.register(r'events', views.EventViewSet)       # Module 4: Safety Overlays [cite: 16]
router.register(r'notifications', views.NotificationViewSet) # Module 3: Alerts [cite: 36]

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 3. API Endpoints [cite: 27, 151]
    path('api/', include(router.urls)), 
    
    # 4. JWT Authentication Endpoints (Milestone 1 Requirements) 
    # This allows your frontend 'Login.js' to obtain and refresh security tokens
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Optional: DRF browsable API login for testing
    path('api-auth/', include('rest_framework.urls')),
]