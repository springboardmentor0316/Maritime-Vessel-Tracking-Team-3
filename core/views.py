from rest_framework import generics
from .models import Vessel, Port
from .serializers import VesselSerializer, PortSerializer

class VesselList(generics.ListCreateAPIView):
    queryset = Vessel.objects.all()
    serializer_class = VesselSerializer

class PortList(generics.ListCreateAPIView):
    queryset = Port.objects.all()
    serializer_class = PortSerializer