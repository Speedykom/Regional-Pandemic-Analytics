import requests
import os
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from . import auths

class ListDashboardsAPI(APIView):
    """
    API view to superset dashboards
    """
    permission_classes = [AllowAny,]
    
    def get(self, request):
        #Login to superset
        auth_response = auths.get_auth_token()
        
        if auth_response['status'] != 200:
            return Response({'errorMessage': auth_response['message']}, status=auth_response['status'])
        
        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/"
        
        headers = {
            'Authorization': f"Bearer {auth_response['token']['access_token']}"
        }
        
        response = requests.get(url=url, headers=headers)
        
        if response.status_code != 200:
            return Response({'errorMessage': response.json()}, status=response.status_code)
        
        return Response(response.json(), status=status.HTTP_200_OK)
    
    
class EnableEmbed(APIView):
    """
    API view to enable superset dashboard embed
    """
    permission_classes = [AllowAny,]
    
    def post(self, request):
        #Login to superset
        auth_response = auths.get_auth_token()
        
        if auth_response['status'] != 200:
            return Response({'errorMessage': auth_response['message']}, status=auth_response['status'])
        
        uid = request.data.get('uid', None)
        
        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/{uid}/embedded"
        
        headers = {
            'Content-Type': "application/json",
            'Authorization': f"Bearer {auth_response['token']['access_token']}"
        }
        
        response = requests.post(url, json={"allowed_domains": []}, headers=headers)
        
        if response.status_code != 200:
            return Response({'errorMessage': response.json()}, status=response.status_code)
        
        return Response(response.json(), status=status.HTTP_200_OK)    #result.uuid
    
    
class GetEmbeddable(APIView):
    """
    API view to get embedable superset dashboard
    """
    permission_classes = [AllowAny,]
    
    def get(self, request, *args, **kwargs):
        #Login to superset
        auth_response = auths.get_auth_token()
        
        if auth_response['status'] != 200:
            return Response({'errorMessage': auth_response['message']}, status=auth_response['status'])
        
        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/{kwargs['id']}/embedded"
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth_response["token"]["access_token"]}'
        }
        
        response = requests.get(url, headers=headers)

        return Response(response.json(), status=response.status_code)    #result.uuid    
        
class GuestTokenApi(APIView):
    """
    API view to get superset guest token
    """
    permission_classes = [AllowAny,]
    
    def post(self, request):
        url = f"{os.getenv('SUPERSET_BASE_URL')}/security/guest_token/"
        csrf_url = f"{os.getenv('SUPERSET_BASE_URL')}/security/csrf_token/"
        CA_BUNDLE = False
        
        auth_response = auths.get_auth_token()
        
        if auth_response['status'] != 200:
            return Response({'errorMessage': auth_response['message']}, status=auth_response['status'])
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth_response["token"]["access_token"]}'
        }
        
        payload = {
            "user": {
                "username": os.getenv("SUPERSET_GUEST_USERNAME"),
                "first_name": os.getenv("SUPERSET_GUEST_FIRSTNAME"),
                "last_name": os.getenv("SUPERSET_GUEST_LASTNAME")
            },
            "resources": [{
                "type": "dashboard",
                "id": request.data.get('id', str)
            }],
            "rls": []
        }
        
        session = requests.Session()
        session.headers['Authorization'] = f'Bearer {auth_response["token"]["access_token"]}'
        session.headers['Content-Type'] = 'application/json'
        csrf_res = session.get(csrf_url, verify=CA_BUNDLE)
        session.headers['Referer']= csrf_url
        session.headers['X-CSRFToken'] = csrf_res.json()['result']
        
        response = session.post(url=url, json=payload, verify=CA_BUNDLE)
        
        if response.status_code != 200:
            return Response({'errorMessage': response.json()}, status=response.status_code)
        
        return Response(response.json(), status=status.HTTP_200_OK)
    

class CsrfTokenApi(APIView):
    """
    API view to get superset csrf token
    """
    permission_classes = [AllowAny,]
    
    def get(self, request):
        url = f"{os.getenv('SUPERSET_BASE_URL')}/security/csrf_token/"
    
        auth_response = auths.get_auth_token()
        
        if auth_response['status'] != 200:
            return Response({'message': auth_response['message']}, status=auth_response['status'])
        
        headers = {
            'Authorization': f"Bearer {auth_response['token']['access_token']}",
        }
        
        response = requests.get(url=url, headers=headers)
        
        if response.status_code != 200:
            return Response({'errorMessage': response.json()}, status=response.status_code)
        
        return Response({'data': response.json()}, status=status.HTTP_200_OK)    
    

class AuthTokenApi(APIView):
    """
    API view to get superset csrf token
    """
    permission_classes = [AllowAny,]
    
    def get(self, request, *args, **kwargs):
        auth_response = auths.get_auth_token()
        
        if auth_response['status'] != 200:
            return Response({'message': auth_response['message']}, status=auth_response['status'])
        
        payload = {
            "user": {
                "username": os.getenv("SUPERSET_GUEST_USERNAME"),
                "first_name": os.getenv("SUPERSET_GUEST_FIRSTNAME"),
                "last_name": os.getenv("SUPERSET_GUEST_LASTNAME")
            },
            "resources": [{
                "type": "dashboard",
                "id": kwargs['id']
            }],
            "rls": []
        }
        
        return Response({'tokens': auth_response['token'], 'payload': payload}, status=status.HTTP_200_OK)        