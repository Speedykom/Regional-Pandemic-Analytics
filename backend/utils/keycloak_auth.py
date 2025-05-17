import os
from keycloak import KeycloakAdmin, KeycloakOpenID
from django.conf import settings
from typing import Union
from core.user_id import get_current_user_id, get_current_user_name

def get_current_user_id(request=None) -> Union[str, None]:
    """Retrieves the ID (username) of the user who made the request

    Args:
        request (Request): A Request object to extract the user ID from. If omitted, will attempt to get the user ID from thread local storage.

    Returns:
        A user ID or None
    """
    if request is not None:
        cur_user = request.userinfo
        return cur_user['sub'] or cur_user['preferred_username']
    else:
        return get_current_user_id() or get_current_user_name()


def get_current_user_name(request):
    if request is not None:
        cur_user = request.userinfo
        return cur_user["preferred_username"]
    else:
        return get_current_user_name() or get_current_user_id()

def get_keycloak_admin():
    config = settings.KEYCLOAK_CONFIG
    verify_tls = os.getenv("KEYCLOAK_VERIFY_SSL", "True").lower() in (
        "true",
        "1",
        "t",
    )

    return KeycloakAdmin(
        server_url=config['KEYCLOAK_INTERNAL_SERVER_URL'] + "/auth",
        username=config['KEYCLOAK_ADMIN_USERNAME'],
        password=config['KEYCLOAK_ADMIN_PASSWORD'],
        realm_name=config['KEYCLOAK_REALM'],
        user_realm_name="master",
        verify=verify_tls)


def get_keycloak_openid(request = None) -> KeycloakOpenID:
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

        verify_tls = os.getenv("KEYCLOAK_VERIFY_SSL", "True").lower() in (
            "true",
            "1",
            "t",
        )

        keycloak = KeycloakOpenID(
            server_url=server_url,
            client_id=client_id,
            realm_name=realm,
            client_secret_key=client_secret_key,
            custom_headers=custom_headers,
            verify=verify_tls,
        )
        return keycloak
