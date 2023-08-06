from keycloak import KeycloakAdmin
from django.conf import settings

def get_keycloak_admin():
    config = settings.KEYCLOAK_CONFIG
    return KeycloakAdmin(
        server_url=config['KEYCLOAK_INTERNAL_SERVER_URL'] + "/auth",
        username=config['KEYCLOAK_ADMIN_USERNAME'],
        password=config['KEYCLOAK_ADMIN_PASSWORD'],
        realm_name=config['KEYCLOAK_REALM'],
        user_realm_name="master",
        verify=False)
