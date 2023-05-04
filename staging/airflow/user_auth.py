from __future__ import annotations
from functools import wraps
from typing import Any, Callable, TypeVar, cast
from flask import Response, request
from flask_appbuilder.const import AUTH_OAUTH, AUTH_LDAP, AUTH_DB
from flask_login import login_user
from airflow.utils.airflow_flask_app import get_airflow_app
from airflow.www.fab_security.sqla.models import User
import logging
import jwt
import requests
from base64 import b64decode
from cryptography.hazmat.primitives import serialization

CLIENT_AUTH: tuple[str, str] | Any | None = None
log = logging.getLogger(__name__)

CLIENT_ID = 'airflow'
OIDC_ISSUER = 'http://auth2.igad-health.eu/realms/stack'

req = requests.get(OIDC_ISSUER)
key_der_base64 = req.json()["public_key"]
key_der = b64decode(key_der_base64.encode())
public_key = serialization.load_der_public_key(key_der)

def init_app(_):
    """Initializes authentication backend"""

T = TypeVar("T", bound=Callable)

def auth_current_user() -> User | None:
    """Authenticate and set current user if Authorization header exists"""
    
    ab_security_manager = get_airflow_app().appbuilder.sm
    user = None

    if ab_security_manager.auth_type == AUTH_OAUTH:
        if not request.headers['Authorization']:
            return None
        
        token = str.replace(str(request.headers['Authorization']), 'Bearer ', '')
        me = jwt.decode(token, public_key, algorithms=['HS256', 'RS256'], audience=CLIENT_ID)
        groups = me["resource_access"]["airflow"]["roles"] # unsafe

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
        
        user = ab_security_manager.auth_user_oauth(userinfo)
    else:
        auth = request.authorization
        if auth is None or not auth.username or not auth.password:
            return None
        if ab_security_manager.auth_type == AUTH_LDAP:
            user = ab_security_manager.auth_user_ldap(auth.username, auth.password)
        if ab_security_manager.auth_type == AUTH_DB:
            user = ab_security_manager.auth_user_db(auth.username, auth.password)
            log.info("user: {0}".format(user))
        if user is not None:
            login_user(user, remember=False)
        return user

def requires_authentication(function: T):
# def requires_authentication():
    """Decorator for functions that require authentication"""
    @wraps(function)
    def decorated(*args, **kwargs):
        if auth_current_user() is not None:
            return function(*args, **kwargs)
        else:
            return Response("Unauthorized", 401, {"WWW-Authenticate": "Basic"})
        
    return cast(T, decorated)