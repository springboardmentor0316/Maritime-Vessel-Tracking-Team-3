import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'maritime_backend.settings')
django.setup()

from core.models import Vessel, Port, Event

def seed_maritime_data():
    print("🚢 Seeding Maritime Database...")

    # 1. Create Ports
    ports = [
        {"name": "Port of Mumbai", "location": "18.94,72.84"},
        {"name": "Port of Singapore", "location": "1.26,103.83"},
        {"name": "Port of Dubai", "location": "25.02,55.06"},
        {"name": "Port of Colombo", "location": "6.94,79.84"},
    ]
    for p in ports:
        Port.objects.get_or_create(name=p['name'], location=p['location'])

    # 2. Create Vessels
    vessels = [
        {"name": "Ocean Voyager", "v_type": "Cargo", "lat": 15.0, "lon": 70.0, "status": "Active"},
        {"name": "Sea Stallion", "v_type": "Tanker", "lat": 10.0, "lon": 65.0, "status": "Active"},
        {"name": "Gulf Explorer", "v_type": "Container", "lat": 22.0, "lon": 60.0, "status": "Active"},
        {"name": "Blue Whale", "v_type": "Oil Tanker", "lat": 5.0, "lon": 80.0, "status": "Active"},
    ]
    for v in vessels:
        Vessel.objects.get_or_create(
            name=v['name'], 
            vessel_type=v['v_type'], 
            last_position_lat=v['lat'], 
            last_position_lon=v['lon'],
            status=v['status']
        )

    # 3. Create Safety Events
    events = [
        {"type": "Storm", "loc": "12.0,68.0", "details": "Category 2 Cyclone developing."},
        {"type": "Risk", "loc": "3.0,75.0", "details": "High Piracy Alert zone."},
    ]
    for e in events:
        Event.objects.get_or_create(event_type=e['type'], location=e['loc'], details=e['details'])

    print("✅ Database successfully seeded with demo data!")

if __name__ == '__main__':
    seed_maritime_data()