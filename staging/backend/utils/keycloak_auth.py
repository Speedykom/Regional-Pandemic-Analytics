import requests
import os

from staging.backend.utils.env_configs import KEYCLOAK_ADMIN_BASE_URL

def keycloak_admin_login():
    form_data = {
        "client_id": os.getenv("KEYCLOAK_ADMIN_CLIENT_ID"),
        "client_secret": os.getenv("KEYCLOAK_ADMIN_CLIENT_SECRET"),
        "grant_type": "client_credentials"
    }

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(KEYCLOAK_ADMIN_BASE_URL, data=form_data, headers=headers)

    serverResponse = {
        "data": response.json(),
        "status": response.status_code
    }
    
    return serverResponse