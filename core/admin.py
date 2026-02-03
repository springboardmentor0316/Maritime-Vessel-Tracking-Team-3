from django.contrib import admin
from .models import User, Vessel, Port
from .models import VesselHistory

admin.site.register(User)
admin.site.register(Vessel)
admin.site.register(Port)

@admin.register(VesselHistory)
class VesselHistoryAdmin(admin.ModelAdmin):
    list_display = ('vessel', 'latitude', 'longitude', 'timestamp')