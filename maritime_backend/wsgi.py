"""
WSGI config for maritime_backend project.
Wrapped with WhiteNoise for integrated frontend serving.
"""

import os
from django.core.wsgi import get_wsgi_application

# Ensure this matches your project folder name
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'maritime_backend.settings')

application = get_wsgi_application()

# --- HANDSHAKE: WhiteNoise Integration ---
# This allows WSGI to serve the React build files directly
try:
    from whitenoise import WhiteNoise
    application = WhiteNoise(application)
    
    # Optional: If you want to explicitly point to the build folder here as a backup
    # application.add_files(os.path.join(os.path.dirname(__file__), '../staticfiles'), prefix='static/')
except ImportError:
    pass