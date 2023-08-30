import requests
import os
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from logs.user_log import Logger
from . import auths

class ListDashboardsAPI(APIView):
    """
    API view to superset dashboards
    """
    keycloak_scopes = {
        'GET': 'dashboard:read',
    }
    
    def get(self, request):
        logger = Logger(request)

        try:
            url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/"
            headers = {
                'Content-Type': "application/json",
                'X-KeycloakToken': request.META['HTTP_AUTHORIZATION'].replace('Bearer ', '')
            }
            response = requests.get(url=url, headers=headers)
            if response.status_code != 200:
                return Response({'errorMessage': response.json()}, status=response.status_code)
            
            return Response(response.json(), status=status.HTTP_200_OK)
        except Exception as err:
            logger.error(err)
            return Response({'status': 'fail', "message": "fail to get superset dashboards"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ListChartsAPI(APIView):
    """
    API view to superset charts
    """
    keycloak_scopes = {
        'GET': 'chart:read',
    }
    
    def get(self, request):
        logger = Logger(request)

        try:
            url = f"{os.getenv('SUPERSET_BASE_URL')}/chart/"
            headers = {
                'Content-Type': "application/json",
                'X-KeycloakToken': request.META['HTTP_AUTHORIZATION'].replace('Bearer ', '')
            }
            
            response = requests.get(url=url, headers=headers)
            if response.status_code != 200:
                return Response({'errorMessage': response.json()}, status=response.status_code)
            
            return Response(response.json(), status=status.HTTP_200_OK)
        except Exception as err:
            logger.error(err)
            return Response({'status': 'fail', "message": "fail to get superset charts"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
class EnableEmbed(APIView):
    """
    API view to enable superset dashboard embed
    """
    keycloak_scopes = {
        'POST': 'dashboard:read',
    }
    def post(self, request):
        try:
            uid = request.data.get('uid', None)
        
            url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/{uid}/embedded"
            
            headers = {
                'Content-Type': "application/json",
                'X-KeycloakToken': request.META['HTTP_AUTHORIZATION'].replace('Bearer ', '')
            }
            
            response = requests.post(url, json={"allowed_domains": [os.getenv("SUPERSET_ALLOWED_DOMAINS")]}, headers=headers)
            
            if response.status_code != 200:
                return Response({'errorMessage': response.json()}, status=response.status_code)
            
            return Response(response.json(), status=status.HTTP_200_OK)    #result.uuid
        except Exception as err:
            logger.error(err)
            return Response({'status': 'fail', "message": "fail to enable superset dashboard embed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    
class GetEmbeddable(APIView):
    """
    API view to get embedable superset dashboard
    """
    keycloak_scopes = {
        'GET': 'dashboard:read',
    }
    def get(self, request, *args, **kwargs):
        try:
            url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/{kwargs['id']}/embedded"
        
            headers = {
                'Content-Type': "application/json",
                'X-KeycloakToken': request.META['HTTP_AUTHORIZATION'].replace('Bearer ', '')
            }
            
            response = requests.get(url, headers=headers)

            return Response(response.json(), status=response.status_code)    #result.uuid 
        except Exception as err:
            logger.error(err)
            return Response({'status': 'fail', "message": "fail to get embedable superset dashboard"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
        
class GuestTokenApi(APIView):
    """
    API view to get superset guest token
    """
    keycloak_scopes = {
        'POST': 'dashboard:read',
    }
    def post(self, request):
        logger = Logger(request)

        try:
            url = f"{os.getenv('SUPERSET_BASE_URL')}/security/guest_token/"
            headers = {
                'Content-Type': "application/json",
                'X-KeycloakToken': request.META['HTTP_AUTHORIZATION'].replace('Bearer ', ''),
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
            
            response = requests.post(url, json=payload, headers=headers)
            
            if response.status_code != 200:
                return Response({'errorMessage': response.json()}, status=response.status_code)
            
            return Response(response.json(), status=status.HTTP_200_OK)
        except Exception as err:
            logger.error(err)
            return Response({'status': 'fail', "message": "fail to get superset guest token"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 

    

class CsrfTokenApi(APIView):
    """
    API view to get superset csrf token
    """
    permission_classes = [AllowAny,]
    
    def get(self, request):
        try:
            url = f"{os.getenv('SUPERSET_BASE_URL')}/security/csrf_token/"
    
            auth_response = auths.get_auth_token()
            
            if auth_response['status'] != 200:
                return {'status': auth_response['status'], 'message': auth_response['message']}
            
            headers = {
                'Authorization': f"Bearer {auth_response['token']['access_token']}",
            }
            
            response = requests.get(url=url, headers=headers)
            
            if response.status_code != 200:
                return Response({'errorMessage': response.json()}, status=response.status_code)
            
            return Response({'data': response.json()}, status=status.HTTP_200_OK)
        except Exception as err:
            logger.error(err)
            return Response({'status': 'fail', "message": "fail to get superset csrf token"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 