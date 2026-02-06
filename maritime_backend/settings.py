import os
import environ
import dj_database_url
from pathlib import Path

# --- 1. BASE DIRECTORY DEFINITION ---
BASE_DIR = Path(__file__).resolve().parent.parent

# --- 2. ENVIRONMENT INITIALIZATION ---
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# --- 3. CORE SECURITY SETTINGS ---
SECRET_KEY = env('SECRET_KEY', default='your-default-secret-key')
DEBUG = env.bool('DEBUG', default=False) 

ALLOWED_HOSTS = ['127.0.0.1', 'localhost', '.onrender.com']

# --- 4. DATABASE CONFIGURATION ---
DATABASES = {
    'default': dj_database_url.config(
        default=env('DATABASE_URL', default=f'sqlite:///{BASE_DIR}/db.sqlite3'),
        conn_max_age=600
    )
}

# --- 5. APPLICATION DEFINITION ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic', 
    'django.contrib.staticfiles',
    'core',
    'rest_framework',
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', 
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', 
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'maritime_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # FIX: Added 'maritime_backend' to the path to match your folder structure
        'DIRS': [os.path.join(BASE_DIR, 'maritime_backend', 'static', 'build')], 
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'maritime_backend.wsgi.application'

# --- 6. AUTHENTICATION & USER MODELS ---
AUTH_USER_MODEL = 'core.User'

# --- 7. STATIC FILES CONFIGURATION ---
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# FIX: Point exactly to where your React assets (CSS/JS) live inside the backend folder
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'maritime_backend', 'static', 'build'),
]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# --- 8. INTERNATIONALIZATION ---
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- 9. API & SECURITY ---
# This allows your React "npm start" (port 3000) to talk to Django (port 8000)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Keep this True for development, but in production, CORS_ALLOWED_ORIGINS is safer
CORS_ALLOW_ALL_ORIGINS = True 

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny', 
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}