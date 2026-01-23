from django.contrib import admin
from .models import User, Vessel, Port

admin.site.register(User)
admin.site.register(Vessel)
admin.site.register(Port)