from keycloak import KeycloakAdmin, KeycloakOpenID
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


def get_keycloak_openid(request = None):
        """
        :param get_response:
        """
        config = settings.KEYCLOAK_CONFIG

        # Read configurations
        try:
            server_url = config['KEYCLOAK_SERVER_URL']
            client_id = config['KEYCLOAK_CLIENT_ID']
            realm = config['KEYCLOAK_REALM']
        except KeyError as e:
            raise Exception("KEYCLOAK_SERVER_URL, KEYCLOAK_CLIENT_ID or KEYCLOAK_REALM not found.")

        client_secret_key = config.get('KEYCLOAK_CLIENT_SECRET_KEY', None)

        # Create Keycloak instance
        if request is None:
            custom_headers = {}
        else:
            custom_headers = {
                "X-Forwarded-For": request.headers.get('X-Forwarded-For')
            }

        keycloak = KeycloakOpenID(server_url=server_url,
                                       client_id=client_id,
                                       realm_name=realm,
                                       client_secret_key=client_secret_key,
                                       custom_headers=custom_headers,
                                       verify=False) # @todo : add env var for local dev
        return keycloak
