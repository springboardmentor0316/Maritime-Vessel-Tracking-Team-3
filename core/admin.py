from django.contrib import admin
from .models import User, Vessel, Port, VesselHistory, Voyage, Event, Notification

# Milestone 1: User & Role Management
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff')
    search_fields = ('username', 'email')

# Milestone 2: Vessel & Port Metadata
@admin.register(Vessel)
class VesselAdmin(admin.ModelAdmin):
    list_display = ('name', 'vessel_type', 'last_position_lat', 'last_position_lon')
    search_fields = ('name', 'vessel_type')

@admin.register(Port)
class PortAdmin(admin.ModelAdmin):
    list_display = ('name', 'location')
    search_fields = ('name',)

# Milestone 3: Tracking & Analytics
@admin.register(VesselHistory)
class VesselHistoryAdmin(admin.ModelAdmin):
    list_display = ('vessel', 'latitude', 'longitude', 'timestamp')
    list_filter = ('vessel', 'timestamp')
    date_hierarchy = 'timestamp' # Adds a time-based drill-down for historical audits

# Milestone 4: Historical Voyage Replay & Audit
@admin.register(Voyage)
class VoyageAdmin(admin.ModelAdmin):
    list_display = ('vessel', 'port_from', 'port_to', 'status', 'departure_time', 'arrival_time')
    list_filter = ('status', 'vessel', 'port_from', 'port_to')
    search_fields = ('vessel__name', 'status')

# Milestone 3: Safety Overlays (Storms, Piracy, Accidents)
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('event_type', 'vessel', 'location', 'timestamp')
    list_filter = ('event_type', 'timestamp')
    search_fields = ('event_type', 'details')

# Milestone 3: Real-time Notifications & Alerts
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('message', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')