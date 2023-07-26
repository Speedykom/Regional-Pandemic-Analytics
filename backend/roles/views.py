import os
from keycloak import KeycloakAdmin
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from utils.keycloak_auth import keycloak_admin_login
from utils.env_configs import (
    APP_REALM, APP_USER_ROLES, BASE_URL, APP_CLIENT_UUID)

#Api to create and list all roles
class RoleApiView(APIView):
    permission_classes = [AllowAny, ]
    
    """_api view to get client roles_
    """
    def get(self, request, *args, **kwargs):
        # Login to admin
        admin_login = keycloak_admin_login()
        
        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': "application/json",
            'cache-control': "no-cache"
        }
        
        id_response = requests.get(f"{BASE_URL}/admin/realms/{APP_REALM}/clients?clientId={os.getenv('CLIENT_ID')}", headers=headers)
        
        if not id_response.ok:
            return Response(response.reason, status=response.status_code)
        
        client_uuid = id_response.json()[0]['id']

        response = requests.get(f"{BASE_URL}/admin/realms/{APP_REALM}/clients/{client_uuid}/roles", headers=headers)

        if not response.ok:
            return Response(response.reason, status=response.status_code)

        role_data = response.json()
        return Response(role_data, status=status.HTTP_200_OK)
    
    """
    API view to update Keycloak client role
    """
    def put(self, request, *args, **kwargs):
        form_data = {
            "name": request.data.get("name", None),
            "description": request.data.get("description", None),
        } 

        # Login to admin
        admin_login = keycloak_admin_login()
        
        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"{admin_login['data']['token_type']} {admin_login['data']['access_token']}",
            'Content-Type': "application/json",
            'cache-control': "no-cache"
        }

        res = requests.put(
            f"{BASE_URL}/admin/realms/{APP_REALM}/clients/{APP_CLIENT_UUID}/roles/{kwargs['id']}", json=form_data, headers=headers)

        if not res.ok:
            return Response(res.reason, status=res.status_code)

        return Response({'message': 'Role update was successful'}, status=status.HTTP_200_OK)    

class GetEditRole(APIView):
    permission_classes = [AllowAny, ]
    
    def get(self, request, *args, **kwargs):
        # Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': "application/json",
            'cache-control': "no-cache"
        }
        
        response: any

        type = request.query_params['type']

        if type == None:
            return Response({'errorMessage': 'Query parameter `type` is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        elif type == 'id':
            response = requests.get(
                f"{BASE_URL}/admin/realms/{APP_REALM}/roles-by-id/{kwargs['id']}", headers=headers)

        elif type == 'name':
            response = requests.get(f"{APP_USER_ROLES}/{kwargs['id']}", headers=headers)
        
        elif type != 'name' or type != 'id':
            return Response({'errorMessage': 'query param type must either be `name` or `id`'}, status=status.HTTP_400_BAD_REQUEST)
        
        if response.status_code != 200:
            return Response(response.reason, status=response.status_code)
        
        role = response.json()
        return Response({'status': 'success', 'role': role}, status=status.HTTP_200_OK)
      
