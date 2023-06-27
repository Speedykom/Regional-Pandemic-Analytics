from flask import redirect, request
from flask_appbuilder.security.manager import AUTH_OID
from superset.security import SupersetSecurityManager
from flask_oidc import OpenIDConnect
from flask_appbuilder.security.views import AuthOIDView
from flask_login import login_user
from urllib.parse import quote
from flask_appbuilder.views import ModelView, SimpleFormView, expose
import logging
import urllib.parse
import os
import jwt
import requests
from base64 import b64decode
from cryptography.hazmat.primitives import serialization

CLIENT_ID = os.getenv("SUPERSET_CLIENT_ID",'superset')
CLIENT_SECRET = os.getenv("SUPERSET_CLIENT_SECRET")
KEYCLOAK_HOSTNAME_URL=os.getenv("KEYCLOAK_HOSTNAME_URL")
OIDC_ISSUER = os.getenv("OIDC_ISSUER")
APP_REALM = os.getenv("APP_REALM", "regional-pandemic-analytics")

class OIDCSecurityManager(SupersetSecurityManager):

    def __init__(self, appbuilder):
        super(OIDCSecurityManager, self).__init__(appbuilder)
        if self.auth_type == AUTH_OID:
            self.oid = OpenIDConnect(self.appbuilder.get_app)
        self.authoidview = AuthOIDCView

req = requests.get(OIDC_ISSUER)
key_der_base64 = req.json()["public_key"]
key_der = b64decode(key_der_base64.encode())
public_key = serialization.load_der_public_key(key_der)

def get_roles(input_array):
    AUTH_ROLES_MAPPING = {
        "superset_admin": ["Admin"],
        "superset_public": ["Public"],
        "superset_alpha": ["Alpha"],
        "superset_gamma": ["Gamma"],
        "superset_granter": ["granter"],
        "superset_sql_lab": ["sql_lab"],
    }
    
    roles = []
    for item in input_array:
        if item in AUTH_ROLES_MAPPING:
            roles.extend(AUTH_ROLES_MAPPING[item])
    
    return roles

class AuthOIDCView(AuthOIDView):

    @expose('/login/', methods=['GET', 'POST'])
    def login(self, flag=True):
        sm = self.appbuilder.sm
        oidc = sm.oid

        @self.appbuilder.sm.oid.require_login
       
        def handle_login():
            user = sm.auth_user_oid(oidc.user_getfield('email'))
            if user is None:
                info = oidc.user_getinfo(['preferred_username', 'given_name', 'family_name', 'email' ])
                firstname = ""
                lastname = ""
                roles=["Gamma"]
                
                if(oidc.get_access_token()):
                    token = oidc.get_access_token()
                    decodedToken = jwt.decode(token, public_key, algorithms=['RS256'],options = {"verify_aud": False}, 
                                              issuer=KEYCLOAK_HOSTNAME_URL+"/realms/"+APP_REALM)
                    superset_roles = decodedToken["resource_access"]["superset"]["roles"]
                    roles=get_roles(superset_roles)

                    if not info.get('given_name'):
                        firstname = info.get('preferred_username')
                    else:
                        firstname = info.get('given_name')
                    if not info.get('family_name'):
                        lastname = info.get('preferred_username')
                    else:
                        lastname = info.get('family_name')
                    user = sm.add_user(info.get('preferred_username'), firstname, lastname,
                                    info.get('email'), [sm.find_role(role) for role in roles])
                else:
                    return self.backchannel_logout()
                
            login_user(user, remember=False)
            return redirect(self.appbuilder.get_url_for_index)

        return handle_login()

    @expose('/logout/', methods=['GET', 'POST'])
    def logout(self):
        oidc = self.appbuilder.sm.oid

        oidc.logout()
        super(AuthOIDCView, self).logout()
        redirect_url = urllib.parse.quote_plus(request.url_root.strip('/') + self.appbuilder.get_url_for_login)

        return redirect(
            oidc.client_secrets.get('issuer') + '/protocol/openid-connect/logout?client_id=' + oidc.client_secrets.get('client_id') + '&logout_redirect_uri=' + quote(redirect_url))

    @expose('/backchannel-logout/', methods=['GET', 'POST'])
    def backchannel_logout(self):
        oidc = self.appbuilder.sm.oid

        oidc.logout()
        super(AuthOIDCView, self).logout()        
        redirect_url = request.url_root.strip('/') + self.appbuilder.get_url_for_login
        
        return redirect(oidc.client_secrets.get('issuer') + '/protocol/openid-connect/logout')
