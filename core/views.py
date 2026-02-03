from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated # Added for security
from .models import Vessel, Port, VesselHistory
from .serializers import VesselSerializer, PortSerializer, VesselHistorySerializer

# Existing view for Vessels
class VesselViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated] # Milestone 1 Security Requirement
    queryset = Vessel.objects.all()
    serializer_class = VesselSerializer

# Existing view for Ports
class PortViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated] # Securing Port data
    queryset = Port.objects.all()
    serializer_class = PortSerializer

# NEW: View for Vessel History (Milestone 3)
class VesselHistoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated] # Securing Tracking Analytics
    queryset = VesselHistory.objects.all()
    serializer_class = VesselHistorySerializer