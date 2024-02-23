from core.user_id import get_current_user_name
import logging
import os
from utils.keycloak_auth import get_keycloak_openid
try:
    from threading import local
except:
    from django.utils._threading_local import local

_log = logging.getLogger('KeycloakImpersonationMiddleware')
_thread_locals = local()

class KeycloakImpersonationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        self.log_out_impersonated_sessions()
        return response

    def log_out_impersonated_sessions():
        sessions = getattr(_thread_locals, 'keycloak_sessions', None)
        if sessions is None or len(sessions) == 0:
            return
        _log.debug("Logging out of %d impersonation sessions after request")
        oid = get_keycloak_openid()
        for session in sessions:
            oid.logout(session)

def get_auth_token ():
    keycloak = get_keycloak_openid()
    tokens = keycloak.token(
        grant_type=["urn:ietf:params:oauth:grant-type:token-exchange"],
        client_id=os.getenv("APP_CLIENT_ID"),
        client_secret=os.getenv("APP_SECRET_KEY"),
        requested_subject=get_current_user_name(),
        requested_token_type="urn:ietf:params:oauth:token-type:refresh_token"
    )
    sessions = getattr(_thread_locals, "keycloak_sessions", [])
    sessions.append(tokens["refresh_token"])
    _thread_locals.sessions = sessions
    return tokens
