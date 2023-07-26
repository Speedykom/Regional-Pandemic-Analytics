import jwt
import requests
from keycloak import KeycloakAdmin
from keycloak import KeycloakOpenIDConnection

from utils.env_configs import (
    KEYCLOAK_ADMIN_AUTH_URL,
    KEYCLOAK_ADMIN_CLIENT_ID,
    KEYCLOAK_ADMIN_CLIENT_SECRET,
    KEYCLOAK_ADMIN_USERNAME,
    KEYCLOAK_ADMIN_PASSWORD,
    APP_USER_BASE_URL,
    APP_CLIENT_SECRET,
    BASE_URL,
    APP_CLIENT_ID
)

# @todo : use python-keycloak instead (see core/middleware.py)
def keycloak_admin_login():
    form_data = {
        "username": KEYCLOAK_ADMIN_USERNAME,
        "password": KEYCLOAK_ADMIN_PASSWORD,
        "grant_type": "password",
        "client_id": KEYCLOAK_ADMIN_CLIENT_ID,
        "client_secret": KEYCLOAK_ADMIN_CLIENT_SECRET
    }

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(
        f"{KEYCLOAK_ADMIN_AUTH_URL}", data=form_data, headers=headers)

    serverResponse = {
        "data": response.json(),
        "status": response.status_code
    }

    return serverResponse

def decode_auth_token(token: str):
    try:
        if not token:
            return {'message': 'empty', 'payload': None, 'status': 400}

        token = token.replace("Bearer ", "")

        payload = jwt.decode(token, APP_CLIENT_SECRET)

        return {'message': 'success', 'payload': payload, 'status': 200}
    except jwt.ExpiredSignatureError:
        return {'message': 'expired', 'payload': None, 'status': 401}
    except jwt.InvalidTokenError:
        return {'message': 'invalid', 'payload': None, 'status': 498}

def role_assign(userId: str, role_object: dict[str, str], headers: dict[str, str]):
    form_data = [role_object]
    requests.post(url=f"{APP_USER_BASE_URL}/{userId}/role-mappings/realm",
                  json=form_data, headers=headers)
    return True
