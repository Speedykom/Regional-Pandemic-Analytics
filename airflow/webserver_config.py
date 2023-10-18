import os
import re
from flask_appbuilder.security.manager import AUTH_OAUTH
from airflow.www.security import AirflowSecurityManager
from flask_appbuilder.views import expose
from werkzeug.wrappers import Response as WerkzeugResponse
from flask import flash, redirect, request, session, g
from flask_appbuilder._compat import as_unicode
from flask_login import login_user, logout_user, current_user
from flask_appbuilder.utils.base import get_safe_redirect
from flask_appbuilder.security.views import AuthOAuthView
import time
import jwt
import logging
from keycloak import KeycloakOpenID, KeycloakAdmin
import jose

basedir = os.path.abspath(os.path.dirname(__file__))
log = logging.getLogger(__name__)

PROVIDER_NAME = os.getenv("PROVIDER_NAME")

AIRFLOW_KEYCLOAK_APP_REALM = os.getenv(
    "AIRFLOW_KEYCLOAK_APP_REALM", "regional-pandemic-analytics"
)
AIRFLOW_KEYCLOAK_CLIENT_ID = os.getenv("AIRFLOW_KEYCLOAK_CLIENT_ID")
AIRFLOW_KEYCLOAK_CLIENT_SECRET = os.getenv("AIRFLOW_KEYCLOAK_CLIENT_SECRET")
AIRFLOW_KEYCLOAK_EXTERNAL_URL = os.getenv("AIRFLOW_KEYCLOAK_EXTERNAL_URL")
AIRFLOW_KEYCLOAK_INTERNAL_URL = os.getenv("AIRFLOW_KEYCLOAK_INTERNAL_URL")
AIRFLOW_KEYCLOAK_ADMIN_USERNAME = os.getenv("AIRFLOW_KEYCLOAK_ADMIN_USERNAME")
AIRFLOW_KEYCLOAK_ADMIN_PASSWORD = os.getenv("AIRFLOW_KEYCLOAK_ADMIN_PASSWORD")

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
        "name": "keycloak",
        "icon": "fa-key",
        "token_key": "access_token",
        "remote_app": {
            "client_id": AIRFLOW_KEYCLOAK_CLIENT_ID,
            "client_secret": AIRFLOW_KEYCLOAK_CLIENT_SECRET,
            "api_base_url": f"{AIRFLOW_KEYCLOAK_INTERNAL_URL}/realms/{AIRFLOW_KEYCLOAK_APP_REALM}/protocol/openid-connect",
            "client_kwargs": {"scope": "openid email profile offline_access roles"},
            "access_token_url": f"{AIRFLOW_KEYCLOAK_INTERNAL_URL}/realms/{AIRFLOW_KEYCLOAK_APP_REALM}/protocol/openid-connect/token",
            "authorize_url": f"{AIRFLOW_KEYCLOAK_EXTERNAL_URL}/realms/{AIRFLOW_KEYCLOAK_APP_REALM}/protocol/openid-connect/auth",
            "server_metadata_url": f"{AIRFLOW_KEYCLOAK_INTERNAL_URL}/realms/{AIRFLOW_KEYCLOAK_APP_REALM}/.well-known/openid-configuration",
        },
    }
]


class CustomAuthRemoteUserView(AuthOAuthView):
    @expose("/oauth-authorized/<provider>")
    def oauth_authorized(self, provider: str) -> WerkzeugResponse:
        log.debug("Authorized init")
        if provider not in self.appbuilder.sm.oauth_remotes:
            flash("Provider not supported.", "warning")
            log.warning("OAuth authorized got an unknown provider %s", provider)
            return redirect(self.appbuilder.get_url_for_login)
        try:
            resp = self.appbuilder.sm.oauth_remotes[provider].authorize_access_token(
                claims_options={
                    "iss": {
                        "essential": True,
                        "values": [
                            f"{AIRFLOW_KEYCLOAK_INTERNAL_URL}/realms/{AIRFLOW_KEYCLOAK_APP_REALM}",
                            f"{AIRFLOW_KEYCLOAK_EXTERNAL_URL}/realms/{AIRFLOW_KEYCLOAK_APP_REALM}",
                        ],
                    }
                }
            )
        except Exception as e:
            log.error("Error authorizing OAuth access token: {0}".format(e))
            flash("The request to sign in was denied.", "error")
            return redirect(self.appbuilder.get_url_for_login)
        if resp is None:
            flash("You denied the request to sign in.", "warning")
            return redirect(self.appbuilder.get_url_for_login)
        log.debug("OAUTH Authorized resp: {0}".format(resp))
        # Retrieves specific user info from the provider
        try:
            self.appbuilder.sm.set_oauth_session(provider, resp)
            userinfo = self.appbuilder.sm.oauth_user_info(provider, resp)
        except Exception as e:
            log.error("Error returning OAuth user info: {0}".format(e))
            user = None
        else:
            log.debug("User info retrieved from {0}: {1}".format(provider, userinfo))
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
                    request.args["state"], session["oauth_state"], algorithms=["HS256"]
                )
            except (jwt.InvalidTokenError, KeyError):
                flash(as_unicode("Invalid state signature"), "warning")
                return redirect(self.appbuilder.get_url_for_login)

            if user.email != userinfo["email"]:
                user.email = userinfo["email"]
                self.appbuilder.sm.update_user(user)

            login_user(user)
            next_url = self.appbuilder.get_url_for_index
            # Check if there is a next url on state
            if "next" in state and len(state["next"]) > 0:
                next_url = get_safe_redirect(state["next"][0])
            return redirect(next_url)


class CustomSecurityManager(AirflowSecurityManager):
    authoauthview = CustomAuthRemoteUserView

    def get_oauth_user_info(self, provider, resp):
        """
        Since there are different OAuth API's with different ways to
        retrieve user info
        """
        # for Keycloak
        if provider in ["keycloak", "keycloak_before_17"]:
            me = self.appbuilder.sm.oauth_remotes[provider].get(
                f"{AIRFLOW_KEYCLOAK_EXTERNAL_URL}/realms/{AIRFLOW_KEYCLOAK_APP_REALM}/protocol/openid-connect/userinfo",
                verify=False,
            )
            me.raise_for_status()
            data = me.json()

            # Configure client
            keycloak_openid = KeycloakOpenID(
                server_url=AIRFLOW_KEYCLOAK_INTERNAL_URL,
                client_id=AIRFLOW_KEYCLOAK_CLIENT_ID,
                realm_name=AIRFLOW_KEYCLOAK_APP_REALM,
                client_secret_key=AIRFLOW_KEYCLOAK_CLIENT_SECRET,
            )
            # Decode token to get the roles
            KEYCLOAK_PUBLIC_KEY = (
                "-----BEGIN PUBLIC KEY-----\n"
                + keycloak_openid.public_key()
                + "\n-----END PUBLIC KEY-----"
            )
            options = {
                "verify_signature": True,
                "verify_aud": False,
                "verify_exp": True,
            }
            full_data = keycloak_openid.decode_token(
                resp["access_token"], key=KEYCLOAK_PUBLIC_KEY, options=options
            )
            # logger.debug("Full User info from Keycloak: %s", full_data)

            return {
                "username": data.get("preferred_username", ""),
                "first_name": data.get("given_name", ""),
                "last_name": data.get("family_name", ""),
                "email": data.get("email", ""),
                "role_keys": full_data["resource_access"][AIRFLOW_KEYCLOAK_CLIENT_ID][
                    "roles"
                ],
            }
        else:
            return {}

    @staticmethod
    def before_request():
        g.user = current_user
        if current_user.is_authenticated and session.get("oauth", ""):
            access_token, _ = session.get("oauth", "")
            ts = time.time()
            last_check = session.get("last_sso_check", None)
            # Check if user has active session every 10 sec, else logout
            if access_token and (last_check is None or (ts - last_check) > 10):
                keycloak_openid = KeycloakOpenID(
                    server_url=AIRFLOW_KEYCLOAK_EXTERNAL_URL,
                    client_id=AIRFLOW_KEYCLOAK_CLIENT_ID,
                    realm_name=AIRFLOW_KEYCLOAK_APP_REALM,
                    client_secret_key=AIRFLOW_KEYCLOAK_CLIENT_SECRET,
                    verify=False,
                )  # @todo : add env var for local dev
                KEYCLOAK_PUBLIC_KEY = (
                    "-----BEGIN PUBLIC KEY-----\n"
                    + keycloak_openid.public_key()
                    + "\n-----END PUBLIC KEY-----"
                )
                options = {
                    "verify_signature": True,
                    "verify_aud": False,
                    "verify_exp": True,
                }
                try:
                    full_data = keycloak_openid.decode_token(
                        access_token, key=KEYCLOAK_PUBLIC_KEY, options=options
                    )
                    keycloak_admin = KeycloakAdmin(
                        server_url=AIRFLOW_KEYCLOAK_EXTERNAL_URL + "/auth",
                        username=AIRFLOW_KEYCLOAK_ADMIN_USERNAME,
                        password=AIRFLOW_KEYCLOAK_ADMIN_PASSWORD,
                        realm_name=AIRFLOW_KEYCLOAK_APP_REALM,
                        user_realm_name="master",
                        verify=False,
                    )
                    sessions = keycloak_admin.get_sessions(user_id=full_data["sub"])

                    if len(sessions) > 0:
                        session["last_sso_check"] = ts
                    else:
                        logout_user()
                        redirect("/")
                except jose.exceptions.ExpiredSignatureError:
                    session.clear()
                    redirect("/")


SECURITY_MANAGER_CLASS = CustomSecurityManager
