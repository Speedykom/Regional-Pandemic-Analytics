import os
import environ
from pathlib import Path
from django.core.management.utils import get_random_secret_key

env = environ.Env()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
HOP_FILES_DIR = os.path.abspath(
    os.path.join(BASE_DIR, os.getenv("HOP_TEMPLATE_PATH", ""))
)
COPY_HOP_FILES_DIR = os.path.abspath(
    os.path.join(BASE_DIR, os.getenv("HOP_PIPELINE_PATH", ""))
)

environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", get_random_secret_key())

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]
# CORS_ORIGIN_ALLOW_ALL = os.getenv("CORS_ORIGIN_ALLOW_ALL", "False")
# CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_WHITELIST = os.getenv(
    "CORS_ORIGIN_WHITELIST", "http://localhost:3000,http://localhost:8000"
).split(",")
# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "api",
    "accounts",
    "process",
    "pipeline",
    "data",
    "hop",
    "shared_datasets",
    "rest_framework.authtoken",
    "rest_framework",
    "corsheaders",
    "drf_yasg",
    "storages",
    "rest_framework_swagger"
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "core.middleware.KeycloakMiddleware",
    "core.user_id.UserIdMiddleware",
    "django.middleware.gzip.GZipMiddleware"
]

SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header',
            'description': 'JWT Authorization header using the Bearer scheme. Example: "Bearer your_token_here"',
        }
    },
    'USE_SESSION_AUTH': False,
    'DEFAULT_MODEL_RENDERING': 'example',
    'DOC_EXPANSION': 'none',
    'VALIDATOR_URL': None,
    'JSON_EDITOR': True,
}

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

DEVELOPMENT_MODE = os.getenv("DEVELOPMENT_MODE", "True").lower() in ("true", "1", "t")

if DEVELOPMENT_MODE is True:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": os.getenv("DB_ENGINE", "django.db.backends.postgresql"),
            "USER": os.environ.get("DB_USER"),
            "PASSWORD": os.environ.get("DB_PASSWORD"),
            "NAME": os.environ.get("DB_NAME"),
            "PORT": os.environ.get("DB_PORT"),
            "HOST": os.environ.get("DB_HOST"),
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

STATIC_URL = "/static/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        # 'rest_framework.authentication.BasicAuthentication',
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        #'rest_framework.permissions.IsAuthenticated'
    ),
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {"anon": "5000/day", "user": "1000/day"},
    "DEFAULT_SCHEMA_CLASS": "rest_framework.schemas.coreapi.AutoSchema",
}

# TESTING = len(sys.argv) > 1 and sys.argv[1] == 'test'

# if TESTING:
#   del REST_FRAMEWORK['DEFAULT_THROTTLE_RATES']

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "https://data2.repan.info",
]

# Excempt list - URL paths that doesn't need Keycloak Authorization
KEYCLOAK_BEARER_AUTHENTICATION_EXEMPT_PATHS = [
    "admin",
    "accounts",
]
CONFIG_DIR = os.path.join(os.path.dirname(__file__), os.pardir)
KEYCLOAK_CONFIG = {
    "KEYCLOAK_REALM": os.getenv("KEYCLOAK_REALM"),
    "KEYCLOAK_CLIENT_ID": os.getenv("CLIENT_ID"),
    "KEYCLOAK_DEFAULT_ACCESS": "ALLOW",  # DENY or ALLOW
    "KEYCLOAK_METHOD_VALIDATE_TOKEN": "DECODE",
    "KEYCLOAK_SERVER_URL": os.getenv("KEYCLOAK_SERVER_URL"),
    "KEYCLOAK_INTERNAL_SERVER_URL": os.getenv(
        "BASE_URL"
    ),  # @todo : rename env var BASE_URL
    "KEYCLOAK_CLIENT_SECRET_KEY": os.getenv("CLIENT_SECRET"),
    "KEYCLOAK_ADMIN_USERNAME": os.getenv("KEYCLOAK_ADMIN_USERNAME"),
    "KEYCLOAK_ADMIN_PASSWORD": os.getenv("KEYCLOAK_ADMIN_PASSWORD"),
    "KEYCLOAK_REDIRECT_URI": os.getenv("KEYCLOAK_REDIRECT_URI"),
    
    
}

SERVICE_USER_PASSWORD = os.environ.get("SERVICE_USER_PASSWORD", "JFKLDSF4562£µFEZF556ZEF6ZEF")

SERVICE_USER_PASSWORD = os.environ.get("SERVICE_USER_PASSWORD", "JFKLDSF4562£µFEZF556ZEF6ZEF")

DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"

MEDIA_ROOT = os.path.join(BASE_DIR, "media")

MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET")
PIPELINES_BUCKET_NAME = os.getenv("PIPELINES_BUCKET_NAME", "pipelines")
PARQUETS_BUCKET_NAME = os.getenv("PARQUETS_BUCKET_NAME", "parquets")
MINIO_ENDPOINT = os.getenv("MINIO_URL")

# EMAIL TRASMISSION SETTINGS

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.getenv("MAIL_HOST")
EMAIL_PORT = 587
EMAIL_HOST_USER = os.getenv("MAIL_USER")
EMAIL_HOST_PASSWORD = os.getenv("MAIL_PASSWORD")
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False

AWS_ACCESS_KEY_ID = MINIO_ACCESS_KEY
AWS_SECRET_ACCESS_KEY = MINIO_SECRET_KEY
AWS_STORAGE_BUCKET_NAME = MINIO_BUCKET_NAME
AWS_S3_ENDPOINT_URL = MINIO_ENDPOINT
AWS_DEFAULT_ACL = None
AWS_QUERYSTRING_AUTH = False
AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_REGION = "us-east-1"
AWS_S3_SECURE_URLS = False
AWS_S3_VERIFY = False
DATA_UPLOAD_MAX_MEMORY_SIZE = 104857600  # 100 MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 104857600  # 100 MB
