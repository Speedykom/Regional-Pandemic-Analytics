import requests
import os

from utils.env_configs import (
    KEYCLOAK_ADMIN_AUTH_URL, 
    KEYCLOAK_ADMIN_CLIENT_ID, 
    KEYCLOAK_ADMIN_CLIENT_SECRET, 
    KEYCLOAK_ADMIN_USERNAME, 
    KEYCLOAK_ADMIN_PASSWORD,
    APP_USER_BASE_URL
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

    response = requests.post(f"{KEYCLOAK_ADMIN_AUTH_URL}", data=form_data, headers=headers)

    serverResponse = {
        "data": response.json(),
        "status": response.status_code
    }

    return serverResponse


def create_keycloak_user ():
    form_data = {
        "firstName": "Djangoess",
        "lastName": "Testerers",
        "username": "tester-maniuois",
        "email": "mohamedjramsey@gmail.coikkks",
        "enabled": True,
        "emailVerified": True
    }

    auth_form_data = {
        "username": KEYCLOAK_ADMIN_USERNAME,
        "password": KEYCLOAK_ADMIN_PASSWORD,
        "grant_type": "password",
        "client_id": KEYCLOAK_ADMIN_CLIENT_ID,
        "client_secret": KEYCLOAK_ADMIN_CLIENT_SECRET
    }

    login_headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(f"{KEYCLOAK_ADMIN_AUTH_URL}", data=auth_form_data, headers=login_headers)

    serverResponse = {
        "data": response.json(),
        "status": response.status_code
    }

    if (response.status_code != 200):
        return serverResponse

    create_headers = {
        'Content-Type': 'application/json',
        'Authorization': f"Bearer {serverResponse['data']['access_token']}",
    }

    res = requests.post(f"{APP_USER_BASE_URL}", data=form_data, headers=create_headers)

    serverRes= {
        "data": res.json(),
        "status": res.status_code
    }

    return serverRes

def me(request):
    try:
        token: str = request.headers['AUTHORIZATION']

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
    except:
        return {'is_authenticated': False, 'message': 'Unauthorized', 'payload': None, 'status': status.HTTP_401_UNAUTHORIZED}

def role_assign (userId: str, role_object: dict[str, str], headers: dict[str, str]):
    form_data = [role_object]
    requests.post(url=f"{APP_USER_BASE_URL}/{userId}/role-mappings/realm", json=form_data, headers=headers)
    return True
