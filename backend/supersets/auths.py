import os
import requests


def get_auth_token ():
    request_body = {
        'username': os.getenv('SUPERSET_USER'),
        'password': os.getenv('SUPERSET_PASS'),
        'provider':os.getenv('SUPERSET_PROVIDER'),
        'refresh': False,
    }
    
    url = os.getenv('SUPERSET_LOGIN')
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.post(f"{url}", json=request_body, headers=headers)
    
    if response.status_code != 200:
        return {'status': response.status_code, 'message': response.json()['message']}
    return {'status': response.status_code, 'message': 'Access granted', 'token': response.json()}

def get_local_auth_token ():
    request_body = {
        'username': 'admin',
        'password': 'admin',
        'provider': 'db',
        'refresh': False,
    }
    
    # url = os.getenv('SUPERSET_LOGIN')
    url = 'http://localhost:8088/api/v1/security/login'
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.post(f"{url}", json=request_body, headers=headers)
    
    if response.status_code != 200:
        return {'status': response.status_code, 'message': response.reason}
    return {'status': response.status_code, 'message': 'Access granted', 'token': response.json()}

def get_csrf_token ():
    
    # url = f"{os.getenv('SUPERSET_BASE_URL')}/security/csrf_token/"
    url = 'http://localhost:8088/api/v1/security/csrf_token/'
    
    auth_response = get_local_auth_token()
    
    if auth_response['status'] != 200:
        return {'status': auth_response['status'], 'message': auth_response['message']}
    
    headers = {
        'Authorization': f"Bearer ${auth_response['token']['access_token']}",
    }
    
    response = requests.get(url=url, headers=headers)
    
    # print(response)
    
    if response.status_code != 200:
        return {'status': response.status_code, 'message': response.reason}
    
    token = {
        'access_token': auth_response['token']['access_token'],
        'csrf_token': response.json()['result']
    }
    return {'status': response.status_code, 'message': 'Access granted', 'token': token}