import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'maritime_backend.settings')
django.setup()

from core.models import Vessel, Port, VesselHistory

def seed():
    # 1. Create a Test Port (Milestone 3)
    port, _ = Port.objects.get_or_create(
        name="Mumbai Port",
        location="18.94, 72.85"
    )

    # 2. Create a Test Vessel (Milestone 2)
    vessel, _ = Vessel.objects.get_or_create(
        name="Evergreen Alpha",
        vessel_type="Cargo",
        defaults={'last_position_lat': 18.96, 'last_position_lon': 72.80}
    )

    # 3. Create Path History (Milestone 4 - Voyage Replay)
    path = [
        (18.90, 72.70), (18.92, 72.75), (18.94, 72.78), (18.96, 72.80)
    ]
    for lat, lon in path:
        VesselHistory.objects.get_or_create(
            vessel=vessel,
            latitude=lat,
            longitude=lon
        )
    
    print("✅ Database seeded with a vessel, port, and history!")

if __name__ == '__main__':
    seed()