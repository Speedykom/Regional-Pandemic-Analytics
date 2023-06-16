import requests
import os
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from . import auths
import uuid

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
            'Content-Type': "application/json",
            'Authorization': f"Bearer ${auth_response['token']['access_token']}"
        }
        
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            return Response({'errorMessage': response.json()['message']}, status=response.status_code)
        
        return Response({'data': response.json()}, status=status.HTTP_200_OK)
        

class GuestTokenApi(APIView):
    """
    API view to get superset guest token
    """
    permission_classes = [AllowAny,]
    
    def post(self, request):
        url = f"{os.getenv('SUPERSET_BASE_URL')}/security/guest_token/"
        
        guest_token = auths.get_csrf_token()
        
        if guest_token['status'] != 200:
            return Response({'errorMessage': guest_token['message']}, status=guest_token['status'])
        
        headers = {
            'Content-Type': "application/json",
            'Authorization': f"Bearer ${guest_token['token']['access_token']}",
            'X-CSRF-TOKEN': f"{guest_token['token']['csrf_token']}"
        }
        
        print (guest_token)
        
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
            "rls": [
                { "clause": "publisher = 'Speedykom'" }
            ]
        }
        
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code != 200:
            return Response({'errorMessage': response.json()}, status=response.status_code)
        
        return Response({'data': response.json()}, status=status.HTTP_200_OK)