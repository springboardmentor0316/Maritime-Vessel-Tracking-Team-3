from django.db import models
from django.contrib.auth.models import AbstractUser

# 1. Custom User Model for Milestone 1
class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('operator', 'Operator'),
        ('analyst', 'Analyst'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='operator')

    def __str__(self):
        return f"{self.username} ({self.role})"

# 2. Vessel Model for Milestone 1 & 2
class Vessel(models.Model):
    imo_number = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    vessel_type = models.CharField(max_length=50) # e.g., Cargo, Tanker
    flag = models.CharField(max_length=50) # e.g., India, Panama
    cargo_type = models.CharField(max_length=100, blank=True, null=True)
    last_position_lat = models.FloatField()
    last_position_lon = models.FloatField()

    def __str__(self):
        return self.name # This fixes the 'Vessel Object' label in the Admin dropdown

# 3. Port Model for Milestone 1
class Port(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100) # Stored as "Lat, Lon" string
    country = models.CharField(max_length=50)

    def __str__(self):
        return self.name

# 4. Vessel History Model for Milestone 3
class VesselHistory(models.Model):
    vessel = models.ForeignKey(Vessel, on_delete=models.CASCADE, related_name='history')
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp'] # Shows the newest movement first

    def __str__(self):
        return f"{self.vessel.name} movement at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"