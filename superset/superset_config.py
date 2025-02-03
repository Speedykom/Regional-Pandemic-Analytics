import os
import re
from flask_appbuilder.security.manager import AUTH_OAUTH
from superset.security import SupersetSecurityManager
from flask_appbuilder.security.sqla.models import (
    User
)
import jose
from flask import Request
from flask_appbuilder.views import expose
from werkzeug.wrappers import Response as WerkzeugResponse
from flask import flash, redirect, request, session, g
from flask_appbuilder._compat import as_unicode
from flask_caching.backends.rediscache import RedisCache
from flask_login import login_user, logout_user, current_user
from flask_appbuilder.utils.base import get_safe_redirect
from flask_appbuilder.security.views import AuthOAuthView
import html
import time
import jwt
from typing import Optional
import logging
from keycloak import KeycloakOpenID, KeycloakAdmin
from superset.superset_typing import CacheConfig

log = logging.getLogger(__name__)

# Superset Oauth2 Docs : https://superset.apache.org/docs/installation/configuring-superset/#custom-oauth2-configuration
# https://flask-appbuilder.readthedocs.io/en/latest/security.html#authentication-oauth

SUPERSET_KEYCLOAK_APP_REALM = os.getenv('SUPERSET_KEYCLOAK_APP_REALM', 'regional-pandemic-analytics')
SUPERSET_KEYCLOAK_CLIENT_ID=os.getenv('SUPERSET_KEYCLOAK_CLIENT_ID')
SUPERSET_KEYCLOAK_CLIENT_SECRET=os.getenv('SUPERSET_KEYCLOAK_CLIENT_SECRET')
SUPERSET_KEYCLOAK_EXTERNAL_URL = os.getenv('SUPERSET_KEYCLOAK_EXTERNAL_URL')
SUPERSET_KEYCLOAK_INTERNAL_URL=os.getenv('SUPERSET_KEYCLOAK_INTERNAL_URL')
SUPERSET_KEYCLOAK_ADMIN_USERNAME=os.getenv('SUPERSET_KEYCLOAK_ADMIN_USERNAME')
SUPERSET_KEYCLOAK_ADMIN_PASSWORD=os.getenv('SUPERSET_KEYCLOAK_ADMIN_PASSWORD')
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
            "client_kwargs": {
                "scope": "openid email profile offline_access roles"
            },
            "access_token_url": f"{SUPERSET_KEYCLOAK_INTERNAL_URL}/realms/{SUPERSET_KEYCLOAK_APP_REALM}/protocol/openid-connect/token",
            "authorize_url": f"{SUPERSET_KEYCLOAK_EXTERNAL_URL}/realms/{SUPERSET_KEYCLOAK_APP_REALM}/protocol/openid-connect/auth",
            "server_metadata_url": f"{SUPERSET_KEYCLOAK_INTERNAL_URL}/realms/{SUPERSET_KEYCLOAK_APP_REALM}/.well-known/openid-configuration"
        },
    }
]

# JWTs are decyphered by `JWTManager` from `flask-jwt-extended`. That library fetches its
# configuration from Flask's `current_app.config`. Short of subclassing the `Config` class and
# convincing Superset of using that subclass there does not appear to be a way to have a dynamic
# property in the config for the `JWT_PUBLIC_KEY`. Therefore, we read the key from Keycloak once
# here, even though that strips us of the ability to replace the public key at runtime.
JWT_ALGORITHM="RS256"
keycloak_openid = KeycloakOpenID(server_url=SUPERSET_KEYCLOAK_INTERNAL_URL,
                                client_id=SUPERSET_KEYCLOAK_CLIENT_ID,
                                realm_name=SUPERSET_KEYCLOAK_APP_REALM,
                                client_secret_key=SUPERSET_KEYCLOAK_CLIENT_SECRET)
# Decode token to get the roles
JWT_PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\n" + keycloak_openid.public_key() + "\n-----END PUBLIC KEY-----"

# Will allow user self registration, allowing to create Flask users from Authorized User
AUTH_USER_REGISTRATION = True
TALISMAN_ENABLED = False
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

# Mapping of Keycloak user names or ids to superset user names. This is used in JWT-based
# authentication. Taken from env, where `SUPERSET_JWT_USER_MAPPING` is a semicolon(;) separated list
# of colon (:) separated pairs of JWT `sub` or `preferred_username` values to superset usernames,
# e.g.: `jwt_user:superset_user;foo:bar;another:user`
REPAN_JWT_USER_MAPPING = dict(
    (jwt, ass) for jwt, ass in
        map(
            lambda pair: pair.split(':'),
            filter(
                lambda str: str != '',
                os.getenv('SUPERSET_JWT_USER_MAPPING', '').split(';')
            )
        )
)

logger = logging.getLogger(__name__)

class CustomAuthOAuthView(AuthOAuthView):
    @expose("/oauth-authorized/<provider>")
    def oauth_authorized(self, provider: str) -> WerkzeugResponse:
        log.debug("Authorized init")
        if provider not in self.appbuilder.sm.oauth_remotes:
            flash("Provider not supported.", "warning")
            log.warning("OAuth authorized got an unknown provider %s", provider)
            return redirect(self.appbuilder.get_url_for_login)
        try:
            resp = self.appbuilder.sm.oauth_remotes[provider].authorize_access_token(claims_options={
                    'iss': {
                        'essential': True,
                        'values': [
                            f"{SUPERSET_KEYCLOAK_INTERNAL_URL}/realms/{SUPERSET_KEYCLOAK_APP_REALM}",
                            f"{SUPERSET_KEYCLOAK_EXTERNAL_URL}/realms/{SUPERSET_KEYCLOAK_APP_REALM}"
                        ]
                    }
                })
        except Exception as e:
            log.error("Error authorizing OAuth access token: {0}".format(e))
            flash("The request to sign in was denied.", "error")
            return redirect(self.appbuilder.get_url_for_login)
        if resp is None:
            flash("You denied the request to sign in.", "warning")
            return redirect(self.appbuilder.get_url_for_login)
        # log.debug("OAUTH Authorized resp: {0}".format(resp))
        # Retrieves specific user info from the provider
        try:
            self.appbuilder.sm.set_oauth_session(provider, resp)
            userinfo = self.appbuilder.sm.oauth_user_info(provider, resp)
        except Exception as e:
            log.error("Error returning OAuth user info: {0}".format(e))
            user = None
        else:
            # log.debug("User info retrieved from {0}: {1}".format(provider, userinfo))
            # User email is not whitelisted
            if provider in self.appbuilder.sm.oauth_whitelists:
                whitelist = self.appbuilder.sm.oauth_whitelists[provider]
                allow = False
                for email in whitelist:
                    if "email" in userinfo and re.search(email, userinfo["email"]):
                        allow = True
                        break
                if not allow:
                    flash("You are not authorized.", "warning")
                    return redirect(self.appbuilder.get_url_for_login)
            else:
                log.debug("No whitelist for OAuth provider")
            user = self.appbuilder.sm.auth_user_oauth(userinfo)

        if user is None:
            flash(as_unicode(self.invalid_login_message), "warning")
            return redirect(self.appbuilder.get_url_for_login)
        else:
            try:
                state = jwt.decode(
                    request.args["state"], session["oauth_state"], algorithms=["HS256", "RS256"]
                )
            except (jwt.InvalidTokenError, KeyError):
                flash(as_unicode("Invalid state signature"), "warning")
                return redirect(self.appbuilder.get_url_for_login)

            # Update email on login
            if (user.email != userinfo["email"]):
                user.email = userinfo["email"]
                self.appbuilder.sm.update_user(user)

            login_user(user)
            next_url = self.appbuilder.get_url_for_index
            # Check if there is a next url on state
            if "next" in state and len(state["next"]) > 0:
                # Need to run it through html.unescape because Flask will encode `&` in query params as `&amp;`
                next_url = get_safe_redirect(html.unescape(state["next"][0]))
            return redirect(next_url)

class CustomSupersetSecurityManager(SupersetSecurityManager):
    authoauthview = CustomAuthOAuthView

    def get_oauth_user_info(self, provider, resp):
        """
        Since there are different OAuth API's with different ways to
        retrieve user info
        """
        # for Keycloak
        if provider in ["keycloak", "keycloak_before_17"]:
            try:
                me = self.appbuilder.sm.oauth_remotes[provider].get(
                    f"{SUPERSET_KEYCLOAK_EXTERNAL_URL}/realms/{SUPERSET_KEYCLOAK_APP_REALM}/protocol/openid-connect/userinfo",
                    verify=False
                )
                me.raise_for_status()
                data = me.json()

                # Configure client
                keycloak_openid = KeycloakOpenID(server_url=SUPERSET_KEYCLOAK_INTERNAL_URL,
                                                 client_id=SUPERSET_KEYCLOAK_CLIENT_ID,
                                                 realm_name=SUPERSET_KEYCLOAK_APP_REALM,
                                                 client_secret_key=SUPERSET_KEYCLOAK_CLIENT_SECRET)
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
                    "role_keys": full_data["resource_access"][SUPERSET_KEYCLOAK_CLIENT_ID]["roles"]
                }
            except Exception as e:
                logger.error(f"Error getting OAuth user info: {str(e)}")
                return {}
        else:
            return {}

    def request_loader(self, request: Request) -> Optional[User]:
        # pylint: disable=import-outside-toplevel
        from superset.extensions import feature_flag_manager


        keycloak_openid = KeycloakOpenID(server_url=SUPERSET_KEYCLOAK_EXTERNAL_URL,
                                client_id=SUPERSET_KEYCLOAK_CLIENT_ID,
                                realm_name=SUPERSET_KEYCLOAK_APP_REALM,
                                client_secret_key=SUPERSET_KEYCLOAK_CLIENT_SECRET,
                                verify=False) # @todo : add env var for local dev

        # next, try to login using Basic Auth
        access_token = request.headers.get('X-KeycloakToken')
        if access_token:
            try:
                token_info = keycloak_openid.introspect(access_token)
                logger.info("Keycloak Introspect")
                if token_info['active']:
                    user = self.find_user(username=token_info['preferred_username'])
                    if user:
                        logger.info("Keycloak auth success {}".format(vars(user)))
                        return user
                    else:
                        try:
                            userinfo = {
                                "username": token_info.get("preferred_username", ""),
                                "first_name": token_info.get("given_name", ""),
                                "last_name": token_info.get("family_name", ""),
                                "email": token_info.get("email", ""),
                                "role_keys": token_info["resource_access"][SUPERSET_KEYCLOAK_CLIENT_ID]["roles"]
                            }
                            logger.info(f"Creating user with info: {userinfo}")
                            created_user = self.auth_user_oauth(userinfo)
                            if created_user:
                                logger.info(f"User created successfully: {vars(created_user)}")
                                new_user = self.find_user(username=token_info['preferred_username'])
                                if new_user:
                                    logger.info("Created new user: {}".format(vars(new_user)))
                                    return new_user
                                else:
                                    logger.error(f"User creation failed, user not found after creation: {token_info['preferred_username']}")
                            else:
                                logger.error(f"User creation failed: {userinfo}")
                            return None
                        except Exception as e:
                            logger.error(f"Error creating user: {str(e)}")
                            return None
                else:
                    logger.error("Keycloak Token is invalid")
                    raise ValueError("Keycloak Token is invalid")
            except Exception as e:
                logger.error(f"Error during Keycloak introspection or user lookup: {str(e)}")
                return None

        if feature_flag_manager.is_feature_enabled("EMBEDDED_SUPERSET"):
            return self.get_guest_user_from_request(request)

        # finally, return None if both methods did not login the user
        return None

    @staticmethod
    def before_request():
        from superset import security_manager as sm
        g.user = current_user
        api_token = request.headers.get('X-KeycloakToken')
        if api_token:
            # Register user if he did his first sign-in via frontend
            try:
                keycloak_openid = KeycloakOpenID(server_url=SUPERSET_KEYCLOAK_EXTERNAL_URL,
                                                 client_id=SUPERSET_KEYCLOAK_CLIENT_ID,
                                                 realm_name=SUPERSET_KEYCLOAK_APP_REALM,
                                                 client_secret_key=SUPERSET_KEYCLOAK_CLIENT_SECRET,
                                                 verify=False)
                KEYCLOAK_PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\n" + keycloak_openid.public_key() + "\n-----END PUBLIC KEY-----"
                options = {"verify_signature": True,
                           "verify_aud": False, "verify_exp": True}
                full_data = keycloak_openid.decode_token(api_token, key=KEYCLOAK_PUBLIC_KEY, options=options)

                user = sm.find_user(username=full_data['preferred_username'])
                if not user:
                    try:
                        userinfo = {
                            "username": full_data.get("preferred_username", ""),
                            "first_name": full_data.get("given_name", ""),
                            "last_name": full_data.get("family_name", ""),
                            "email": full_data.get("email", ""),
                            "role_keys": full_data["resource_access"][SUPERSET_KEYCLOAK_CLIENT_ID]["roles"]
                        }
                        logger.info(f"Creating user in before_request with info: {userinfo}")
                        created_user = sm.auth_user_oauth(userinfo)
                        if created_user:
                            logger.info(f"User created successfully in before_request: {vars(created_user)}")
                            new_user = sm.find_user(username=full_data['preferred_username'])
                            if new_user:
                                logger.info("Created new user in before_request: {}".format(vars(new_user)))
                            else:
                                logger.error(f"User creation failed in before_request, user not found after creation: {full_data['preferred_username']}")
                        else:
                            logger.error(f"User creation failed in before_request: {userinfo}")
                    except Exception as e:
                        logger.error(f"Error creating user in before_request: {str(e)}")
                else:
                    logger.info(f"User already exists: {user.username}")
            except Exception as e:
                logger.error(f"Error in before_request: {str(e)}")
        elif current_user.is_authenticated and not api_token and session.get('oauth', ""):
            access_token, _ = session.get('oauth', "")
            ts = time.time()
            last_check = session.get('last_sso_check', None)
            # Check if user has active session every 10 sec, else logout
            if access_token and (last_check is None or (ts - last_check) > 10):
                try:
                    keycloak_openid = KeycloakOpenID(server_url=SUPERSET_KEYCLOAK_EXTERNAL_URL,
                                                     client_id=SUPERSET_KEYCLOAK_CLIENT_ID,
                                                     realm_name=SUPERSET_KEYCLOAK_APP_REALM,
                                                     client_secret_key=SUPERSET_KEYCLOAK_CLIENT_SECRET,
                                                     verify=False)
                    KEYCLOAK_PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\n" + keycloak_openid.public_key() + "\n-----END PUBLIC KEY-----"
                    options = {"verify_signature": True,
                               "verify_aud": False, "verify_exp": True}
                    full_data = keycloak_openid.decode_token(access_token, key=KEYCLOAK_PUBLIC_KEY, options=options)

                    keycloak_admin = KeycloakAdmin(
                            server_url=SUPERSET_KEYCLOAK_EXTERNAL_URL + "/auth",
                            username=SUPERSET_KEYCLOAK_ADMIN_USERNAME,
                            password=SUPERSET_KEYCLOAK_ADMIN_PASSWORD,
                            realm_name=SUPERSET_KEYCLOAK_APP_REALM,
                            user_realm_name="master",
                            verify=False)
                    sessions = keycloak_admin.get_sessions(user_id=full_data["sub"])

                    if (len(sessions) > 0):
                        session["last_sso_check"] = ts
                    else:
                        logout_user()
                        redirect("/")
                except jose.exceptions.ExpiredSignatureError:
                    session.clear()
                    redirect("/login")
                except Exception as e:
                    logger.error(f"Error during token refresh: {str(e)}")
                    session.clear()
                    redirect("/login")

    # The default implementation will simply look for the numeric user ID in `sub`. Override in
    # order to implement a slightly more complex user account lookup logic
    def load_user_jwt(self, _jwt_header, jwt_data):
        try:
            logger.info(f"Loading user from JWT data: {jwt_data}")
            superset_user_name = None
            for claim in ["sub", "preferred_username"]:
                remote = jwt_data[claim]
                if remote in REPAN_JWT_USER_MAPPING:
                    superset_user_name = REPAN_JWT_USER_MAPPING[remote]
                    break
            if superset_user_name is None:
                superset_user_name = jwt_data["preferred_username"]
            user = self.find_user(username=superset_user_name)
            if user:
                g.user = user
                logger.info(f"Successfully loaded user from JWT: {vars(user)}")
                return user
            else:
                userinfo = {
                    "username": jwt_data["preferred_username"],
                    "first_name": jwt_data.get("given_name", ""),
                    "last_name": jwt_data.get("family_name", ""),
                    "email": jwt_data.get("email", ""),
                    "role_keys": jwt_data["resource_access"][SUPERSET_KEYCLOAK_CLIENT_ID]["roles"]
                }
                logger.info(f"Creating new user from JWT data: {userinfo}")
                created_user = self.auth_user_oauth(userinfo)
                if created_user:
                    logger.info(f"User created successfully: {vars(created_user)}")
                    g.user = created_user
                    return created_user
                else:
                    logger.error(f"User creation failed: {userinfo}")
                    return None
        except Exception as e:
            logger.error(f"Error loading user from JWT: {str(e)}")
            return None


# Enable MapBox maps
MAPBOX_API_KEY = os.getenv('MAPBOX_API_KEY', 'pk.eyJ1IjoiemJpZGktY29uc3VsdGluZyIsImEiOiJBakJHTE5vIn0.nDvakLI1qEhqCfRjhPWDdw')


GUEST_ROLE_NAME = "Alpha"
CUSTOM_SECURITY_MANAGER = CustomSupersetSecurityManager
ENABLE_PROXY_FIX = True
WTF_CSRF_ENABLED = False
SQLALCHEMY_DATABASE_URI = SUPERSET_DATABASE_URI

FEATURE_FLAGS = {
    "THUMBNAILS": True,
    "LISTVIEWS_DEFAULT_CARD_VIEW": True,
    "THUMBNAILS_SQLA_LISTENERS": True
}

REDIS_HOST = "superset_cache"
REDIS_PORT = "6379"

GLOBAL_ASYNC_QUERIES_TRANSPORT = "polling"
GLOBAL_ASYNC_QUERIES_REDIS_CONFIG = {
    "port": REDIS_PORT,
    "host": REDIS_HOST,
    "password": "",
    "db": 0,
    "ssl": False
}

FILTER_STATE_CACHE_CONFIG: CacheConfig = {
    "CACHE_TYPE": "RedisCache",
    'CACHE_DEFAULT_TIMEOUT': 86400,
    'CACHE_KEY_PREFIX': 'filter_',
    'CACHE_REDIS_URL': 'redis://%s:%s/0' % (REDIS_HOST, REDIS_PORT)
}

# # Cache for chart form data
EXPLORE_FORM_DATA_CACHE_CONFIG: CacheConfig = {
    "CACHE_TYPE": "RedisCache",
    'CACHE_DEFAULT_TIMEOUT': 86400,
    'CACHE_KEY_PREFIX': 'Chart_',
    'CACHE_REDIS_URL': 'redis://%s:%s/1' % (REDIS_HOST, REDIS_PORT)
}

# #Caching the Data from the Database shown in the Dashboards
DATA_CACHE_CONFIG: CacheConfig = {
    "CACHE_TYPE": "RedisCache",
    'CACHE_DEFAULT_TIMEOUT': 86400,
    'CACHE_KEY_PREFIX': 'data_',
    'CACHE_REDIS_URL': 'redis://%s:%s/2' % (REDIS_HOST, REDIS_PORT)
}

THUMBNAIL_CACHE_CONFIG: CacheConfig = {
    'CACHE_TYPE': 'RedisCache',
    'CACHE_DEFAULT_TIMEOUT': 86400,
    'CACHE_KEY_PREFIX': 'thumbnail_',
    'CACHE_REDIS_URL': 'redis://%s:%s/0' % (REDIS_HOST, REDIS_PORT)
}

class CeleryConfig:
    broker_url = 'redis://%s:%s/0' % (REDIS_HOST, REDIS_PORT)
    imports = ('superset.sql_lab', 'superset.tasks', 'superset.tasks.thumbnails')
    result_backend = 'redis://%s:%s/0' % (REDIS_HOST, REDIS_PORT)
    worker_prefetch_multiplier = 10
    task_acks_late = True

CELERY_CONFIG = CeleryConfig

RESULTS_BACKEND = RedisCache(host=REDIS_HOST, port=REDIS_PORT, key_prefix='superset_results')

SCREENSHOT_LOCATE_WAIT = 100
SCREENSHOT_LOAD_WAIT = 600
# Needed to enable additionnal security apis
FAB_ADD_SECURITY_API = True

WEBDRIVER_TYPE= "chrome"

WEBDRIVER_BASEURL = "http://superset:8088"

WEBDRIVER_OPTION_ARGS = [
    "--force-device-scale-factor=2.0",
    "--high-dpi-support=2.0",
    "--headless",
    "--disable-gpu"
    "--disable-dev-shm-usage",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-extensions",
    "--whitelisted-ips="
]
