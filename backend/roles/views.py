import os
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from utils.keycloak_auth import get_keycloak_admin
from django.conf import settings

#Api to create and list all roles
class RoleApiView(APIView):
    permission_classes = [AllowAny, ]

    """_api view to get client roles_
    """
    def get(self, request, *args, **kwargs):
        """
        Endpoint for listing keycloak client roles, excluding default roles.
        """
        try:
            keycloak_admin = get_keycloak_admin()
            realm_roles = keycloak_admin.get_realm_roles()

            # Exclude default roles
            excluded_roles = {"default-roles-stack", "offline_access", "uma_authorization"}
            filtered_roles = [role for role in realm_roles if role.get('name') not in excluded_roles]

            return Response(filtered_roles, status=status.HTTP_200_OK)
        except Exception as err:
            return Response({'errorMessage': 'Unable to retrieve the roles'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    """
    API view to update Keycloak client role
    """
    def put(self, request, *args, **kwargs):
        """
        Endpoint for updating keycloak client role
        """
        form_data = {
            "name": request.data.get("name", None),
            "description": request.data.get("description", None),
        }

        try:
            keycloak_admin = get_keycloak_admin()
            client_id = keycloak_admin.get_client_id(settings.KEYCLOAK_CONFIG['KEYCLOAK_CLIENT_ID'])
            keycloak_admin.update_client_role(client_role_id=client_id, role_name=kwargs['name'], payload=form_data)
            return Response({'message': 'Role update was successful'}, status=status.HTTP_200_OK)
        except Exception as err:
            print(err)
            return Response({'errorMessage': 'Unable to update the role'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

