import os
import requests
import jwt
from rest_framework import status

from utils.env_configs import (
    KEYCLOAK_ADMIN_AUTH_URL,
    KEYCLOAK_ADMIN_CLIENT_ID,
    KEYCLOAK_ADMIN_CLIENT_SECRET,
    KEYCLOAK_ADMIN_USERNAME,
    KEYCLOAK_ADMIN_PASSWORD,
    APP_USER_BASE_URL,
    APP_CLIENT_SECRET,
    APP_REALM,
    BASE_URL,
    APP_CLIENT_ID
)


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

def current_user (request):
    token: str = request.META.get('HTTP_AUTHORIZATION')
    if token is None:
        return {'is_authenticated': False, 'message': 'auth header is required', 'payload': None, 'status': status.HTTP_400_BAD_REQUEST}
    
    serialToken = token.replace("Bearer ", "")
    form_data = {
        "client_id": APP_CLIENT_ID,
        "client_secret": APP_CLIENT_SECRET,
        "token": serialToken
    }
    
    response = requests.post(f"{BASE_URL}/realms/{APP_REALM}/protocol/openid-connect/token/introspect",
                            data=form_data)
        
    data = response.json()
    if data['active'] == False:
        return {'is_authenticated': False, 'message': 'Unauthorized', 'payload': None, 'status': status.HTTP_401_UNAUTHORIZED}
    
    return {'is_authenticated': True, 'message': 'Success', 'payload': response.json(), 'status': status.HTTP_200_OK}

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


def me(request):
    try:
        token: str = request.headers['AUTHORIZATION']

        if token is None:
            return {'is_authenticated': False, 'message': 'auth header is required', 'payload': None, 'status': status.HTTP_400_BAD_REQUEST}

        serialToken = token.replace("Bearer ", "")

        form_data = {
            "client_id": os.getenv("CLIENT_ID"),
            "client_secret": os.getenv("CLIENT_SECRET"),
            "token": serialToken
        }

        response = requests.post(f"{BASE_URL}/realms/{APP_REALM}/protocol/openid-connect/token/introspect",
                                 data=form_data)

        data = response.json()

        if data['active'] == False:
            return {'is_authenticated': False, 'message': 'Unauthorized', 'payload': None, 'status': status.HTTP_401_UNAUTHORIZED}

        return {'is_authenticated': True, 'message': 'Success', 'payload': response.json(), 'status': status.HTTP_200_OK}
    except:
        return {'is_authenticated': False, 'message': 'Unauthorized', 'payload': None, 'status': status.HTTP_401_UNAUTHORIZED}


def role_assign(userId: str, role_object: dict[str, str], headers: dict[str, str]):
    form_data = [role_object]
    requests.post(url=f"{APP_USER_BASE_URL}/{userId}/role-mappings/realm",
                  json=form_data, headers=headers)
    return True

def unassign_role(userId: str, role_object: dict[str, str], headers: dict[str, str]):
    form_data = [role_object]
    requests.delete(url=f"{APP_USER_BASE_URL}/{userId}/role-mappings/realm", json=form_data, headers=headers)
    return True