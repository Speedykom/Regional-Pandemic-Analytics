import os
import logging
import jwt
import requests

from base64 import b64decode
from cryptography.hazmat.primitives import serialization
from tokenize import Exponent

from flask import redirect
from flask_appbuilder import expose
from flask_appbuilder.security.manager import AUTH_OAUTH
from flask_appbuilder.security.views import AuthOAuthView

from airflow.www.security import AirflowSecurityManager

basedir = os.path.abspath(os.path.dirname(__file__))
log = logging.getLogger(__name__)

PROVIDER_NAME = os.getenv("PROVIDER_NAME")
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

OIDC_ISSUER = os.getenv("OIDC_ISSUER")
KEYCLOAK_BASE_URL = os.getenv("KEYCLOAK_BASE_URL")
KEYCLOAK_TOKEN_URL = os.getenv("KEYCLOAK_TOKEN_URL")
KEYCLOAK_AUTH_URL = os.getenv("KEYCLOAK_AUTH_URL")

AUTH_TYPE = AUTH_OAUTH
AUTH_USER_REGISTRATION = os.getenv("AUTH_USER_REGISTRATION")
AUTH_USER_REGISTRATION_ROLE = os.getenv("AUTH_USER_REGISTRATION_ROLE")
AUTH_ROLES_SYNC_AT_LOGIN = os.getenv("AUTH_ROLES_SYNC_AT_LOGIN")

AUTH_ROLES_MAPPING = {
  "airflow_admin": ["Admin"],
  "airflow_op": ["Op"],
  "airflow_user": ["User"],
  "airflow_viewer": ["Viewer"],
  "airflow_public": ["Public"],
}

OAUTH_PROVIDERS = [
  {
   'name': PROVIDER_NAME,
   'icon': 'fa-key',
   'token_key': 'access_token', 
   'remote_app': {
     'client_id': CLIENT_ID,
     'client_secret': CLIENT_SECRET,
     'client_kwargs': {
       'scope': 'email profile'
     },
     'api_base_url': KEYCLOAK_BASE_URL,
     'request_token_url': None,
     'access_token_url': KEYCLOAK_TOKEN_URL,
     'authorize_url': KEYCLOAK_AUTH_URL,
    },
  },
]

req = requests.get(OIDC_ISSUER)
key_der_base64 = req.json()["public_key"]
key_der = b64decode(key_der_base64.encode())
public_key = serialization.load_der_public_key(key_der)

class CustomAuthRemoteUserView(AuthOAuthView):
    @expose("/logout/")
    def logout(self):
        """Delete access token before logging out."""
        return super().logout()

class CustomSecurityManager(AirflowSecurityManager):
    authoauthview = CustomAuthRemoteUserView
  
    def oauth_user_info(self, provider, response):
        if provider == PROVIDER_NAME:
            token = response["access_token"]

            me = jwt.decode(token, public_key, algorithms=['HS256', 'RS256'], audience=CLIENT_ID)

            groups = me["resource_access"]["airflow"]["roles"]

            if len(groups) < 1:
                groups = ["airflow_public"]
            else:
                groups = [str for str in groups if "airflow" in str]

            userinfo = {
                "username": me.get("preferred_username"),
                "email": me.get("email"),
                "first_name": me.get("given_name"),
                "last_name": me.get("family_name"),
                "role_keys": groups,
            }

            log.info("user info: {0}".format(userinfo))

            return userinfo
        else:
            return {}

SECURITY_MANAGER_CLASS = CustomSecurityManager