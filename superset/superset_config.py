import os
from flask_appbuilder.security.manager import AUTH_OAUTH
from superset.security import SupersetSecurityManager
from flask_appbuilder.security.sqla.models import (
    User
)
from flask import Request
from typing import Optional
import logging
from keycloak import KeycloakOpenID


# Superset Oauth2 Docs : https://superset.apache.org/docs/installation/configuring-superset/#custom-oauth2-configuration
# https://flask-appbuilder.readthedocs.io/en/latest/security.html#authentication-oauth

SUPERSET_KEYCLOAK_APP_REALM = os.getenv('SUPERSET_KEYCLOAK_APP_REALM', 'regional-pandemic-analytics')
SUPERSET_KEYCLOAK_CLIENT_ID=os.getenv('SUPERSET_KEYCLOAK_CLIENT_ID')
SUPERSET_KEYCLOAK_CLIENT_SECRET=os.getenv('SUPERSET_KEYCLOAK_CLIENT_SECRET')
SUPERSET_KEYCLOAK_EXTERNAL_URL = os.getenv('SUPERSET_KEYCLOAK_EXTERNAL_URL')
SUPERSET_KEYCLOAK_INTERNAL_URL=os.getenv('SUPERSET_KEYCLOAK_INTERNAL_URL')
SUPERSET_DATABASE_URI=os.getenv('SUPERSET_DATABASE_URI')
SECRET_KEY = os.getenv('SUPERSET_SECRET_KEY')

# Set the authentication type to OAuth
AUTH_TYPE = AUTH_OAUTH
OAUTH_PROVIDERS = [
    {
        "name": "keycloak",
        "icon": "fa-key",
        "token_key": "access_token",
        "remote_app": {
            "client_id": SUPERSET_KEYCLOAK_CLIENT_ID,
            "client_secret": SUPERSET_KEYCLOAK_CLIENT_SECRET,
            "api_base_url": f"{SUPERSET_KEYCLOAK_INTERNAL_URL}/realms/{SUPERSET_KEYCLOAK_APP_REALM}/protocol/openid-connect",
            "client_kwargs": {"scope": "openid email profile offline_access roles"},
            # 'access_token_method':'POST',    # HTTP Method to call access_token_url
            # 'access_token_params':{        # Additional parameters for calls to access_token_url
            #     'client_id':'myClientId'
            # },
            # 'access_token_headers':{    # Additional headers for calls to access_token_url
            #     'Authorization': 'Basic Base64EncodedClientIdAndSecret'
            # },
            "access_token_url": f"{SUPERSET_KEYCLOAK_INTERNAL_URL}/realms/{SUPERSET_KEYCLOAK_APP_REALM}/protocol/openid-connect/token",
            "authorize_url": f"{SUPERSET_KEYCLOAK_EXTERNAL_URL}/realms/{SUPERSET_KEYCLOAK_APP_REALM}/protocol/openid-connect/auth",
            "server_metadata_url": f"{SUPERSET_KEYCLOAK_INTERNAL_URL}/realms/{SUPERSET_KEYCLOAK_APP_REALM}/.well-known/openid-configuration"
            # "request_token_url": None,
        },
    }
]

# Will allow user self registration, allowing to create Flask users from Authorized User
AUTH_USER_REGISTRATION = True
AUTH_ROLES_SYNC_AT_LOGIN = True
AUTH_ROLES_MAPPING = {
    "superset_admin": ["Admin"],
    "superset_public": ["Public"],
    "superset_alpha": ["Alpha"],
    "superset_gamma": ["Gamma"],
    "superset_granter": ["granter"],
    "superset_sql_lab": ["sql_lab"],#
}
# The default user self registration role
AUTH_USER_REGISTRATION_ROLE = os.getenv('AUTH_USER_REGISTRATION_ROLE','Public')

logger = logging.getLogger(__name__)

# Configure client
keycloak_openid = KeycloakOpenID(server_url=SUPERSET_KEYCLOAK_INTERNAL_URL,
                                client_id=SUPERSET_KEYCLOAK_CLIENT_ID,
                                realm_name=SUPERSET_KEYCLOAK_APP_REALM,
                                client_secret_key=SUPERSET_KEYCLOAK_CLIENT_SECRET)

class CustomSupersetSecurityManager(SupersetSecurityManager):

    def get_oauth_user_info(self, provider, resp):
        """
        Since there are different OAuth API's with different ways to
        retrieve user info
        """
        # for Keycloak
        if provider in ["keycloak", "keycloak_before_17"]:
            me = self.appbuilder.sm.oauth_remotes[provider].get(
                "openid-connect/userinfo"
            )
            me.raise_for_status()
            data = me.json()
            #logger.debug("Response from Keycloak: %s", resp)
            #logger.debug("User info from Keycloak: %s", data)

            # Decode token to get the roles
            KEYCLOAK_PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\n" + keycloak_openid.public_key() + "\n-----END PUBLIC KEY-----"
            options = {"verify_signature": True, "verify_aud": False, "verify_exp": True}
            full_data = keycloak_openid.decode_token(resp['access_token'], key=KEYCLOAK_PUBLIC_KEY, options=options)
            #logger.debug("Full User info from Keycloak: %s", full_data)
            
            return {
                "username": data.get("preferred_username", ""),
                "first_name": data.get("given_name", ""),
                "last_name": data.get("family_name", ""),
                "email": data.get("email", ""),
                "role_keys": full_data["resource_access"]["superset"]["roles"]
            }
        else:
            return {}

    def request_loader(self, request: Request) -> Optional[User]:
        # pylint: disable=import-outside-toplevel
        from superset.extensions import feature_flag_manager

        # next, try to login using Basic Auth
        access_token = request.headers.get('X-KeycloakToken')
        if access_token:
            token_info = keycloak_openid.introspect(access_token)
            logger.info("Keycloak Introspect", token_info)
            if (token_info['active']):
                user = self.find_user(email=token_info['email'])
                logger.info("Keycloak auth success")
                return user
        
        if feature_flag_manager.is_feature_enabled("EMBEDDED_SUPERSET"):
            return self.get_guest_user_from_request(request)
        
        # finally, return None if both methods did not login the user
        return None

GUEST_ROLE_NAME = "Alpha"
CUSTOM_SECURITY_MANAGER = CustomSupersetSecurityManager
ENABLE_PROXY_FIX = True
WTF_CSRF_ENABLED = False
SQLALCHEMY_DATABASE_URI = SUPERSET_DATABASE_URI
