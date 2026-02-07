from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Vessel, Port, VesselHistory, Voyage, Event, Notification

# --- Custom JWT Response (Powers Sidebar Role Display) ---
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Required for the Maritime Command identity badge
        data['role'] = self.user.role 
        data['username'] = self.user.username
        data['email'] = self.user.email
        return data

# --- User Serializer ---
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

# --- Live Tracking Serializer (Includes MMSI for search) ---
class VesselSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vessel
        fields = '__all__'

# --- Port Analytics Serializer ---
class PortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Port
        fields = '__all__'

# --- History Breadcrumbs Serializer ---
class VesselHistorySerializer(serializers.ModelSerializer):
    vessel_name = serializers.ReadOnlyField(source='vessel.name')

    class Meta:
        model = VesselHistory
        fields = ['id', 'vessel', 'vessel_name', 'latitude', 'longitude', 'timestamp']

# --- Voyage Audit Log Serializer (Sidebar Optimized) ---
class VoyageSerializer(serializers.ModelSerializer):
    vessel_name = serializers.ReadOnlyField(source='vessel.name')
    port_from_name = serializers.ReadOnlyField(source='port_from.name')
    port_to_name = serializers.ReadOnlyField(source='port_to.name')

    class Meta:
        model = Voyage
        fields = [
            'id', 'vessel', 'vessel_name', 'port_from', 'port_from_name', 
            'port_to', 'port_to_name', 'departure_time', 'arrival_time', 'status'
        ]

# --- Risk & Safety Intelligence Serializer ---
class EventSerializer(serializers.ModelSerializer):
    vessel_name = serializers.ReadOnlyField(source='vessel.name')

    class Meta:
        model = Event
        # Explicitly included timestamp to match model update
        fields = ['id', 'vessel', 'vessel_name', 'event_type', 'location', 'timestamp', 'details']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'created_at', 'is_read']