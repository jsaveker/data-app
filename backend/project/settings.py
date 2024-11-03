import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = 'your secret key here'  # Replace with your actual secret key

DEBUG = True

ROOT_URLCONF = 'project.urls'

CORS_ALLOW_ALL_ORIGINS = True

ALLOWED_HOSTS = []

# Installed apps
INSTALLED_APPS = [
    # Default Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'corsheaders',

    # Your apps
    'app',  # Replace 'app' with your actual app name
]

# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # If using CORS headers
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',  # Must be before AuthenticationMiddleware
    'django.middleware.common.CommonMiddleware',
   # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # Required
    'django.contrib.messages.middleware.MessageMiddleware',    # Required
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],  # Update as needed
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                # Default processors
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'detections_db',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'db',  # Change 'db' to 'localhost'
        'PORT': '5432',
    }
}

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS settings (if applicable)
# CORS_ALLOWED_ORIGINS = [
#    'http://localhost:3000',  # Your frontend URL
# ]

# Rest framework settings (if needed)
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

STATIC_URL = '/static/'

# ... rest of your settings ...