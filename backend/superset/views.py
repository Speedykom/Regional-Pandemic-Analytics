import requests
import os
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from superset.auths import get_auth_token

class ListDashboardsAPI(APIView):
    """
    API view to create Keycloak user
    """
    permission_classes = [AllowAny,]
    
    #Login to superset
    auth_response = get_auth_token()
    
    def get(self, request):
        if self.auth_response['status'] != 200:
            return Response({'errorMessage': self.auth_response['message']}, status=self.auth_response['status'])
        
        url = f"{os.getenv('BACKEND_SUPERSET_BASE_URL')}/api/v1/dashboard/"
        
        headers = {
            'Content-Type': "application/json",
            'Authorization': f"Bearer ${self.auth_response['token']['access_token']}"
        }
        
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            return Response({'errorMessage': response.json()['message']}, status=response.status_code)
        
        return Response({'data': response.json()}, status=status.HTTP_200_OK)
        
        