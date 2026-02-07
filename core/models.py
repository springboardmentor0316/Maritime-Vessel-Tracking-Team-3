from django.db import models
from django.contrib.auth.models import AbstractUser

# --- Milestone 1: Custom User & Role-Based Access ---
class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('analyst', 'Analyst'),
        ('operator', 'Operator'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='operator')

# --- Milestone 2: Vessel Metadata ---
class Vessel(models.Model):
    name = models.CharField(max_length=100)
    mmsi = models.IntegerField(unique=True, null=True) 
    vessel_type = models.CharField(max_length=50)
    last_position_lat = models.FloatField()
    last_position_lon = models.FloatField()
    status = models.CharField(max_length=20, default='Active') 

    def __str__(self):
        return self.name

# --- Milestone 3: Port Metadata ---
class Port(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100) # format: "lat, lon"

    def __str__(self):
        return self.name

# --- Milestone 3: Vessel History ---
class VesselHistory(models.Model):
    # Using 'Vessel' as a string to avoid model registry issues
    vessel = models.ForeignKey('Vessel', on_delete=models.CASCADE, related_name='history')
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

# --- Milestone 4: Voyages ---
class Voyage(models.Model):
    vessel = models.ForeignKey('Vessel', on_delete=models.CASCADE, related_name='voyages')
    port_from = models.ForeignKey('Port', related_name='departures', on_delete=models.CASCADE)
    port_to = models.ForeignKey('Port', related_name='arrivals', on_delete=models.CASCADE)
    departure_time = models.DateTimeField(auto_now_add=True)
    arrival_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, default='On Schedule')

# --- Milestone 3: Safety Events ---
class Event(models.Model):
    vessel = models.ForeignKey('Vessel', on_delete=models.CASCADE, null=True, blank=True)
    event_type = models.CharField(max_length=50) 
    location = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True) # Re-added for Admin visibility
    details = models.TextField()

# --- Milestone 3: Notifications ---
class Notification(models.Model):
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)