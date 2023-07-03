import os
import jwt
import requests
from rest_framework.response import Response
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

    response = requests.post(f"{KEYCLOAK_ADMIN_AUTH_URL}", data=form_data, headers=headers)

    serverResponse = {
        "data": response.json(),
        "status": response.status_code
    }

    return serverResponse

pub_key = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5MnLb2R/mU/QWcy2hYxVRZ082obB0tMLObTSaIkETwlo9wuO4Icie53IVZzltnH1Monu11H2dH9+Fdzt/T6BP6mTtynZ6a3+busBhbrUCx9lQDKEpjAyOo3YzJ/AieJyfR6HPlLapYJ5u0cKUqo+QYCLx1n052aGvu+RZwLbmSqiiZF/BdQ2n+UEkfr32CetjxhGNPJjVNMB2jaCh5pFaYRfDI0VYxcz++vZge+6qVXzadgftfF5353B4Zt/CzPe04lGCwkNFhvCtwE95cvcbgObKsyIiFedgAuQTGH3BDoVPsU1G8FguyKyxOHINQiO+dzyiT7jJqnSuFEnvjozTwIDAQAB\n-----END PUBLIC KEY-----"

def decode_auth_token (token: str):
    try:
        if not token:
            return{'message': 'empty', 'payload': None, 'status': 400}
        
        token = token.replace("Bearer ", "")
        
        payload = jwt.decode(token, APP_CLIENT_SECRET)
        
        return {'message': 'success', 'payload': payload, 'status': 200}
    except jwt.ExpiredSignatureError:
        return {'message': 'expired', 'payload': None, 'status': 401}
    except jwt.InvalidTokenError:
        return {'message': 'invalid', 'payload': None, 'status': 498}

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

def role_assign (userId: str, role_object: dict[str, str], headers: dict[str, str]):
    form_data = [role_object]
    requests.post(url=f"{APP_USER_BASE_URL}/{userId}/role-mappings/realm", json=form_data, headers=headers)
    return True
