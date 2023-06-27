import os

# ---------------------------KEYCLOACK ----------------------------

KC_SUPERSET_SSO_ENABLED = os.getenv('KC_SUPERSET_SSO_ENABLED', 'true')

WTF_CSRF_ENABLED = False

if KC_SUPERSET_SSO_ENABLED == "true":
    SECRET_KEY = os.getenv('SECRET_KEY')
    OIDC_OPENID_REALM = os.getenv('APP_REALM', 'regional-pandemic-analytics')
    AUTH_USER_REGISTRATION_ROLE = os.getenv('AUTH_USER_REGISTRATION_ROLE','Gamma')
    KC_REALM_NAME = os.getenv('APP_REALM','regional-pandemic-analytics')
    KC_FRONTEND_URL = os.getenv('KEYCLOAK_HOSTNAME_URL')

    from keycloack_security_manager  import  OIDCSecurityManager
    from flask_appbuilder.security.manager import AUTH_OID, AUTH_REMOTE_USER, AUTH_DB, AUTH_LDAP, AUTH_OAUTH

    AUTH_TYPE = AUTH_OID
    SECRET_KEY: SECRET_KEY
    OIDC_CLIENT_SECRETS = '/app/pythonpath/client_secret.json'
    OIDC_ID_TOKEN_COOKIE_SECURE = False
    OIDC_REQUIRE_VERIFIED_EMAIL = False
    OIDC_OPENID_REALM: OIDC_OPENID_REALM
    OIDC_INTROSPECTION_AUTH_METHOD: 'client_secret_post'
    CUSTOM_SECURITY_MANAGER = OIDCSecurityManager
    AUTH_USER_REGISTRATION = True
    AUTH_USER_REGISTRATION_ROLE = AUTH_USER_REGISTRATION_ROLE
    OIDC_VALID_ISSUERS = [KC_FRONTEND_URL + '/realms/' + KC_REALM_NAME]
    ENABLE_PROXY_FIX = True

