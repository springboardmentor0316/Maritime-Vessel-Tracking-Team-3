import os
import django
import random
from datetime import datetime, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'maritime_backend.settings')
django.setup()

from core.models import User, Vessel, Port, Event, Voyage
from django.contrib.auth.hashers import make_password

def seed_data():
    print("🚢 Starting Final Fleet Synchronization...")

    # --- STEP 0: CLEAN SLATE ---
    # We wipe everything to ensure no duplicate IDs or role confusion
    Event.objects.all().delete()
    Voyage.objects.all().delete()
    Vessel.objects.all().delete()
    Port.objects.all().delete()
    User.objects.all().delete()
    print("🧹 Database Cleared: Ready for fresh deployment.")

    # --- STEP 1: CREATE IDENTITY PROFILES (RBAC) ---
    # 1. The Admin: Access to Dashboard + Django Backend
    User.objects.create(
        username='admin_boss',
        email='admin@maritime.com',
        password=make_password('Admin123!'),
        role='admin',
        is_staff=True,
        is_superuser=True
    )

    # 2. The Operator: Standard Surveillance Access
    User.objects.create(
        username='operator_one',
        email='op@maritime.com',
        password=make_password('Operator123!'),
        role='operator'
    )
    print("👥 Identities Created: [admin_boss] & [operator_one]")

    # --- STEP 2: STRATEGIC PORTS ---
    ports_data = [
        {"name": "Port of Mumbai", "loc": "18.94,72.84"},
        {"name": "Port of Singapore", "loc": "1.26,103.83"},
        {"name": "Port of Dubai", "loc": "25.02,55.06"},
        {"name": "Port of Rotterdam", "loc": "51.94,4.13"},
    ]
    ports = []
    for p in ports_data:
        obj = Port.objects.create(name=p['name'], location=p['loc'])
        ports.append(obj)

    # --- STEP 3: THE FLEET (Searchable by MMSI) ---
    vessel_types = ['Cargo', 'Tanker', 'Container', 'LNG Carrier']
    vessel_names = ['Titan Carrier', 'Oceanic Link', 'Poseidon Express', 'Silver Wave', 'Aurora Tanker']
    v_objs = []
    
    for i, name in enumerate(vessel_names):
        v = Vessel.objects.create(
            name=name,
            mmsi=300000000 + (i * 555),
            vessel_type=random.choice(vessel_types),
            last_position_lat=random.uniform(10.0, 22.0),
            last_position_lon=random.uniform(60.0, 75.0),
            status='Active'
        )
        v_objs.append(v)

    # --- STEP 4: RISK EVENTS (Map Circles) ---
    Event.objects.create(
        event_type="Storm", 
        location="15.0,68.0", 
        details="Cyclonic weather pattern detected in the Arabian Sea.",
        vessel=v_objs[0]
    )
    Event.objects.create(
        event_type="Piracy", 
        location="8.0,62.0", 
        details="Security breach reported - Vessel under armed escort.",
        vessel=v_objs[1]
    )

    # --- STEP 5: VOYAGE LOGS ---
    for v in v_objs:
        p_from, p_to = random.sample(ports, 2)
        Voyage.objects.create(
            vessel=v,
            port_from=p_from,
            port_to=p_to,
            departure_time=datetime.now() - timedelta(days=random.randint(1, 5)),
            status='On Schedule'
        )

    print("✅ Seeding Complete! The Maritime Command dashboard is now operational.")

if __name__ == "__main__":
    seed_data()