import requests
import os

from utils.env_configs import (
    KEYCLOAK_ADMIN_AUTH_URL, 
    KEYCLOAK_ADMIN_CLIENT_ID, 
    KEYCLOAK_ADMIN_CLIENT_SECRET, 
    KEYCLOAK_ADMIN_USERNAME, 
    KEYCLOAK_ADMIN_PASSWORD
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
