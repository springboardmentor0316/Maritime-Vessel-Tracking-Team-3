from django.db import models
from django.contrib.auth.models import AbstractUser

# Milestone 1: Custom User Model
class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('analyst', 'Analyst'),
        ('operator', 'Operator'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='operator')

# Milestone 2: Vessel Metadata
class Vessel(models.Model):
    name = models.CharField(max_length=100)
    vessel_type = models.CharField(max_length=50)
    last_position_lat = models.FloatField()
    last_position_lon = models.FloatField()

# Milestone 3: Port Metadata
class Port(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100) # format: "lat, lon"

# Milestone 3: Vessel History (for breadcrumbs)
class VesselHistory(models.Model):
    vessel = models.ForeignKey(Vessel, on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

# Milestone 4: Voyages (Added to fix your error)
class Voyage(models.Model):
    vessel = models.ForeignKey(Vessel, on_delete=models.CASCADE)
    port_from = models.ForeignKey(Port, related_name='departures', on_delete=models.CASCADE)
    port_to = models.ForeignKey(Port, related_name='arrivals', on_delete=models.CASCADE)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50)

# Milestone 3: Safety Events (Added to fix your error)
class Event(models.Model):
    vessel = models.ForeignKey(Vessel, on_delete=models.CASCADE)
    event_type = models.CharField(max_length=50) # Storm, Piracy, etc.
    location = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField()

# Milestone 3: Notifications (THE MISSING MODEL CAUSING YOUR ERROR)
class Notification(models.Model):
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)