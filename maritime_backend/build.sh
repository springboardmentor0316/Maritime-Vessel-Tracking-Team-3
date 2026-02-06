#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Convert static files for WhiteNoise
python manage.py collectstatic --no-input

# Apply database migrations to PostgreSQL
python manage.py migrate