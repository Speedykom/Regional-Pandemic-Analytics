import requests
import json
import os
import jwt
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from roles.utils import (
    User_pers, FALSE_User_pers, Role_pers, FALSE_Role_pers, Dashboard_pers, FALSE_dashboard_pers, Chart_pers, FALSE_chart_pers,
    Data_pers, FALSE_data_pers, Process_chain_pers, FALSE_process_chain_pers
)
from utils.keycloak_auth import keycloak_admin_login
from utils.env_configs import (
    APP_REALM, APP_USER_ROLES, BASE_URL)

#Api to create and list all roles
class CreateViewRoles(APIView):
    permission_classes = [AllowAny, ]

    # Login to admin
    admin_login = keycloak_admin_login()
    
    """_api view to get realm roles_
    """
    def get(self, request, *args, **kwargs):
        if self.admin_login["status"] != 200:
            return Response(self.admin_login["data"], status=self.admin_login["status"])

        headers = {
            'Authorization': f"Bearer {self.admin_login['data']['access_token']}",
            'Content-Type': "application/json",
            'cache-control': "no-cache"
        }

        response = requests.get(f"{APP_USER_ROLES}/", headers=headers)

        if response.status_code != 200:
            return Response(response.reason, status=response.status_code)

        role_data = response.json()
        return Response(role_data, status=status.HTTP_200_OK)

    """_api view to create realm roles_
    """
    def post(self, request):
        form_data = {
            "name": request.data.get("name", None),
            "description": request.data.get("description", None),
        }

        if self.admin_login["status"] != 200:
            return Response(self.admin_login["data"], status=self.admin_login["status"])

        headers = {
            'Authorization': f"{self.admin_login['data']['token_type']} {self.admin_login['data']['access_token']}",
            'Content-Type': "application/json",
            'cache-control': "no-cache"
        }

        res = requests.post(f"{APP_USER_ROLES}",
                            json=form_data, headers=headers)

        if res.status_code != 201:
            return Response(res.reason, status=res.status_code)

        return Response({'message': f'{form_data["name"]} role created successfully'}, status=status.HTTP_200_OK)
    

class GetEditRole(APIView):
    permission_classes = [AllowAny, ]
    
    # Login to admin
    admin_login = keycloak_admin_login()
    
    """_api view to delete realm roles_
    """
    def delete(self, request, *args, **kwargs):
        if self.admin_login["status"] != 200:
            return Response(self.admin_login["data"], status=self.admin_login["status"])

        headers = {
            'Authorization': f"{self.admin_login['data']['token_type']} {self.admin_login['data']['access_token']}",
            'Content-Type': "application/json",
            'cache-control': "no-cache"
        }

        res = requests.delete(
            f"{BASE_URL}/admin/realms/{APP_REALM}/roles-by-id/{kwargs['id']}", headers=headers)

        if res.status_code != 204:
            return Response(res.reason, status=res.status_code)

        return Response({'message': 'Role deletion was successful'}, status=status.HTTP_200_OK)
    
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
        print(f"type {type}")

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
    
    """
    API view to update Keycloak roles
    """
    def put(self, request, *args, **kwargs):
        form_data = {
            "name": request.data.get("name", None),
            "description": request.data.get("description", None),
            "attributes": {}
        }
        
        if kwargs['id'] == '37a81fed-6f5a-4e7b-b539-adff6db8d0b0':                  #admin
            form_data['attributes']['User'] = [json.dumps(User_pers)]
            form_data['attributes']['Role'] = [json.dumps(Role_pers)]
            form_data['attributes']['Dashboard'] = [json.dumps(FALSE_dashboard_pers)]
            form_data['attributes']['Chart'] = [json.dumps(FALSE_chart_pers)]
            form_data['attributes']['Data'] = [json.dumps(FALSE_data_pers)]
            form_data['attributes']['ProcessChain'] = [json.dumps(FALSE_process_chain_pers)]
            
        if  kwargs['id'] == 'c3aed598-9ad0-45ed-8e56-1cc32bb8aa9a':                 #m&e
            form_data['attributes']['User'] = [json.dumps(FALSE_User_pers)]
            form_data['attributes']['Role'] = [json.dumps(FALSE_Role_pers)]
            form_data['attributes']['Dashboard'] = [json.dumps(Dashboard_pers)]
            form_data['attributes']['Chart'] = [json.dumps(Chart_pers)]
            form_data['attributes']['Data'] = [json.dumps(FALSE_data_pers)]
            form_data['attributes']['ProcessChain'] = [json.dumps(FALSE_process_chain_pers)]    
            
        if  kwargs['id'] == '3de87a0f-965f-4dc9-8065-51df66cfb01f':                 #dho
            form_data['attributes']['User'] = [json.dumps(FALSE_User_pers)]
            form_data['attributes']['Role'] = [json.dumps(FALSE_Role_pers)]
            form_data['attributes']['Dashboard'] = [json.dumps(Dashboard_pers)]
            form_data['attributes']['Chart'] = [json.dumps(Chart_pers)]
            form_data['attributes']['Data'] = [json.dumps(Data_pers)]
            form_data['attributes']['ProcessChain'] = [json.dumps(Process_chain_pers)]      

        if self.admin_login["status"] != 200:
            return Response(self.admin_login["data"], status=self.admin_login["status"])

        headers = {
            'Authorization': f"{self.admin_login['data']['token_type']} {self.admin_login['data']['access_token']}",
            'Content-Type': "application/json",
            'cache-control': "no-cache"
        }

        res = requests.put(
            f"{BASE_URL}/admin/realms/{APP_REALM}/roles-by-id/{kwargs['id']}", json=form_data, headers=headers)

        if res.status_code != 204:
            return Response(res.reason, status=res.status_code)

        return Response({'message': 'Role update was successful'}, status=status.HTTP_200_OK)    