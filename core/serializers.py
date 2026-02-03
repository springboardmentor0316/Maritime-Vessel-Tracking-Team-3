from rest_framework import serializers
from .models import Vessel, Port, VesselHistory

# Serializer for Milestone 1 & 2
class VesselSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vessel
        fields = '__all__'

# Serializer for Milestone 1
class PortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Port
        fields = '__all__'

# New Serializer for Milestone 3 (Vessel History)
class VesselHistorySerializer(serializers.ModelSerializer):
    # This allows us to see the vessel name in the API instead of just an ID
    vessel_name = serializers.ReadOnlyField(source='vessel.name')

    class Meta:
        model = VesselHistory
        fields = ['id', 'vessel', 'vessel_name', 'latitude', 'longitude', 'timestamp']