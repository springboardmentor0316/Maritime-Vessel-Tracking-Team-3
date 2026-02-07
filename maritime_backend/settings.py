import os
import environ
import dj_database_url
from pathlib import Path
from datetime import timedelta

# --- 1. BASE DIRECTORY DEFINITION ---
BASE_DIR = Path(__file__).resolve().parent.parent

# --- 2. ENVIRONMENT INITIALIZATION ---
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# --- 3. CORE SECURITY SETTINGS ---
SECRET_KEY = env('SECRET_KEY', default='django-insecure-command-center-key-772')
DEBUG = env.bool('DEBUG', default=True) 

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
    'rest_framework_simplejwt',
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', 
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # MUST stay here
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

# --- 7. STATIC FILES CONFIGURATION (THE FINAL FIX) ---
# Synchronized with React homepage: "/static/build/"
STATIC_URL = '/static/build/' 
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# We point to the parent folder of the 'static' folder inside build
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'maritime_backend', 'static', 'build'),
]

# Standard storage for WhiteNoise
STATICFILES_STORAGE = 'whitenoise.storage.StaticFilesStorage'
WHITENOISE_INDEX_FILE = True
WHITENOISE_USE_FINDERS = True

# --- 8. INTERNATIONALIZATION ---
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- 9. API & SECURITY ---
CORS_ALLOW_ALL_ORIGINS = True 

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=2),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
}