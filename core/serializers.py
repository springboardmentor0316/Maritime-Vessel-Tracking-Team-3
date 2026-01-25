from rest_framework import serializers
from .models import Vessel, Port

class VesselSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vessel
        fields = '__all__' 

class PortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Port
        fields = '__all__'