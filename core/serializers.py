from rest_framework import serializers
from .models import User, Vessel, Port, VesselHistory, Voyage, Event, Notification

# Milestone 1: User & Role Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

# Milestone 2: Live Tracking Serializer
class VesselSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vessel
        fields = '__all__'

# Milestone 3: Port Congestion Serializer
class PortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Port
        fields = '__all__'

# Milestone 3: Tracking Analytics Serializer
class VesselHistorySerializer(serializers.ModelSerializer):
    vessel_name = serializers.ReadOnlyField(source='vessel.name')

    class Meta:
        model = VesselHistory
        fields = ['id', 'vessel', 'vessel_name', 'latitude', 'longitude', 'timestamp']

# Milestone 4: Historical Voyage Replay Serializer
class VoyageSerializer(serializers.ModelSerializer):
    vessel_name = serializers.ReadOnlyField(source='vessel.name')

    class Meta:
        model = Voyage
        fields = ['id', 'vessel', 'vessel_name', 'port_from', 'port_to', 'departure_time', 'arrival_time', 'status']

# Milestone 3: Safety Events Serializer
class EventSerializer(serializers.ModelSerializer):
    vessel_name = serializers.ReadOnlyField(source='vessel.name')

    class Meta:
        model = Event
        fields = ['id', 'vessel', 'vessel_name', 'event_type', 'location', 'timestamp', 'details']

# Milestone 3: Notifications Serializer
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'created_at', 'is_read']