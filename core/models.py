from django.db import models
from django.contrib.auth.models import AbstractUser

# 1. User Model: Define roles as Operator, Analyst, Admin [cite: 24]
class User(AbstractUser):
    ROLE_CHOICES = (
        ('operator', 'Operator'),
        ('analyst', 'Analyst'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='operator')

# 2. Vessel Model: Track ship metadata [cite: 55, 65-102]
class Vessel(models.Model):
    imo_number = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    vessel_type = models.CharField(max_length=100)
    flag = models.CharField(max_length=100)
    cargo_type = models.CharField(max_length=100, null=True)
    last_position_lat = models.FloatField(null=True)
    last_position_lon = models.FloatField(null=True)

# 3. Port Model: Track congestion and location [cite: 103, 112-144]
class Port(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    congestion_score = models.FloatField(default=0.0)
    avg_wait_time = models.FloatField(default=0.0)