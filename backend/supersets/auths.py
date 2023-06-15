import os
import requests


def get_auth_token ():
    request_body = {
        'username': os.getenv('SUPERSET_USER'),
        'password': os.getenv('SUPERSET_PASS'),
        'provider':os.getenv('SUPERSET_PROVIDER'),
        'refresh': True,
    }
    
    url = os.getenv('SUPERSET_LOGIN')
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.post(f"{url}", json=request_body, headers=headers)
    
    if response.status_code != 200:
        return {'status': response.status_code, 'message': response.json()['message']}
    return {'status': response.status_code, 'message': 'Access granted', 'token': response.json()}

def get_csrf_token ():
    
    url = f"{os.getenv('SUPERSET_BASE_URL')}/security/csrf_token/"
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.get(f"{url}", headers=headers)
    
    if response.status_code != 200:
        return {'status': response.status_code, 'message': response.reason}
    return {'status': response.status_code, 'message': 'Access granted', 'token': response.json()['result']}