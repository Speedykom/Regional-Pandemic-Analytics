import os

KEYCLOAK_ADMIN_AUTH_URL = os.getenv("KEYCLOAK_ADMIN_AUTH_URL")
KEYCLOAK_ADMIN_CLIENT_ID = os.getenv("KEYCLOAK_ADMIN_CLIENT_ID")
KEYCLOAK_ADMIN_CLIENT_SECRET = os.getenv("KEYCLOAK_ADMIN_CLIENT_SECRET")
KEYCLOAK_ADMIN_USERNAME=os.getenv("KEYCLOAK_ADMIN_USERNAME")
KEYCLOAK_ADMIN_PASSWORD=os.getenv("KEYCLOAK_ADMIN_PASSWORD")

APP_USER_BASE_URL = os.getenv("APP_USER_BASE_URL")
APP_USER_ROLES = os.getenv("APP_USER_ROLES")
APP_REALM = os.getenv("APP_REALM")
APP_CLIENT_ID = os.getenv("APP_CLIENT_ID")
APP_CLIEND_UUID = os.getenv("APP_CLIEND_UUID")
APP_CLIENT_SECRET = os.getenv("APP_CLIENT_SECRET")
APP_SECRET_KEY = os.getenv("APP_SECRET_KEY")
BASE_URL = os.getenv("BASE_URL")
REST_REDIRECT_URI = os.getenv("REST_REDIRECT_URI")
