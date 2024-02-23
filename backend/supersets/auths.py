import os
import requests
from utils.keycloak_auth import get_keycloak_openid
from core.user_id import get_current_user_name
from core.keycloak_impersonation import get_auth_token
from keycloak import KeycloakPostError

def get_csrf_token ():
    url = f"{os.getenv('SUPERSET_BASE_URL')}/security/csrf_token/"

    try:
        auth_token = get_auth_token()
    except KeycloakPostError as err:
        return {'status': err.response_code, 'message': err.error_message}

    headers = {
        'Authorization': f"Bearer ${auth_token['access_token']}",
    }

    response = requests.get(url=url, headers=headers)

    if response.status_code != 200:
        return {'status': response.status_code, 'message': response.reason}

    token = {
        'access_token': auth_token['access_token'],
        'csrf_token': response.json()['result']
    }
    return {'status': response.status_code, 'message': 'Access granted', 'token': token}
