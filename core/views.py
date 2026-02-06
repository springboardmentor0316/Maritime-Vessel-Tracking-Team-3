from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import User, Vessel, Port, VesselHistory, Voyage, Event, Notification
from .serializers import (
    UserSerializer, VesselSerializer, PortSerializer, 
    VesselHistorySerializer, VoyageSerializer, EventSerializer, 
    NotificationSerializer
)

# 1. User Management (Milestone 1) [cite: 13, 24]
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

# 2. Live Vessel Tracking (Milestone 2) [cite: 14, 28]
class VesselViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Vessel.objects.all()
    serializer_class = VesselSerializer

# 3. Port Congestion Analytics (Milestone 3) [cite: 15, 33]
class PortViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Port.objects.all()
    serializer_class = PortSerializer

# 4. Tracking Analytics (Milestone 3) [cite: 11]
class VesselHistoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = VesselHistory.objects.all()
    serializer_class = VesselHistorySerializer

# 5. Historical Voyage Playback & Audit (Milestone 4) 
class VoyageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Voyage.objects.all()
    serializer_class = VoyageSerializer

# 6. Safety Overlays (Storms, Piracy, Accidents) (Milestone 3) 
class EventViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Event.objects.all()
    serializer_class = EventSerializer

# 7. Event Notifications (Milestone 3) 
class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer