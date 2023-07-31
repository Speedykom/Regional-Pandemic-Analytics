import requests
import os
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from utils.filename import gen_filename
from utils.env_configs import APP_USER_BASE_URL

from utils.minio import upload_file_to_minio, download_file
from django.utils.datastructures import MultiValueDictKeyError

from .serializers import *
from .models import *

from utils.generators import get_random_secret
from utils.keycloak_auth import keycloak_admin_login, role_assign, get_keycloak_admin
from django.conf import settings


def homepage():
    return HttpResponse('<h2 style="text-align:center">Welcome to IGAD API Page</h2>')


class UserListView(APIView):
    """
    View class for listing all, and creating a new user
    """
    keycloak_scopes = {
        'GET': 'user:read',
        'POST': 'user:add'
    }

    def get(self, request, *args, **kwargs):
        try:
            keycloak_admin = get_keycloak_admin()
            users = keycloak_admin.get_users({})
            return Response(users, status=status.HTTP_200_OK)
        except:
            return Response({'errorMessage': 'Unable to retrieve users.'}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'firstName': openapi.Schema(type=openapi.TYPE_STRING),
            'lastName': openapi.Schema(type=openapi.TYPE_STRING),
            'username': openapi.Schema(type=openapi.TYPE_STRING),
            'email': openapi.Schema(type=openapi.TYPE_STRING),
            'enabled': openapi.Schema(type=openapi.TYPE_BOOLEAN),
            'code': openapi.Schema(type=openapi.TYPE_STRING),
            "phone": openapi.Schema(type=openapi.TYPE_STRING),
            "gender": openapi.Schema(type=openapi.TYPE_STRING),
            "country": openapi.Schema(type=openapi.TYPE_STRING)
        }
    ))
    def post(self, request, *args, **kwargs):
        generate_password = get_random_secret(10)
        form_data = {
            "firstName": request.data.get("firstName", None),
            "lastName": request.data.get("lastName", None),
            "username": request.data.get("username", None),
            "email": request.data.get("email", None),
            "enabled": request.data.get("enabled", None),
            "emailVerified": request.data.get("emailVerified", None),
            "attributes": {
                "code": request.data.get("code", None),
                "phone": request.data.get("phone", None),
                "gender": request.data.get("gender", None),
                "country": request.data.get("country", None),
            },
            "credentials": [
                {
                    "type": "password",
                    "value": generate_password,
                    "temporary": False
                }
            ]
        }

        try:
            keycloak_admin = get_keycloak_admin()

            # Create user
            keycloak_admin.create_user(form_data)

            # Assign role to user
            user_id = keycloak_admin.get_user_id(form_data["username"])
            role = request.data.get("role", {})
            client_id = keycloak_admin.get_client_id(settings.KEYCLOAK_CONFIG.config['KEYCLOAK_CLIENT_ID'])
            keycloak_admin.assign_client_role(client_id=client_id, user_id=user_id, roles=[role])

            user = {
                "id": user_id,
                "firstName": form_data["firstName"],
                "lastName": form_data["lastName"],
                "username": form_data["username"],
                "email": form_data["email"],
                "enabled": form_data["enabled"],
                "emailVerified": form_data["emailVerified"],
                "role": role,
                "password": form_data['credentials'][0]['value']
            }

            return Response({'message': 'User created successfully', 'user': user}, status=status.HTTP_201_CREATED)
        except Exception as err:
            print(err)
            return Response({'errorMessage': 'Unable to create a new user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDetailView(APIView):
    """
    View class for listing, updating and deleting a single post
    """
    keycloak_scopes = {
        'GET': 'user:read',
        'PUT': 'user:update',
        'DELETE': 'user:delete'
    }

    def get(self, request, **kwargs):
        # Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': "application/json"
        }

        response = requests.get(
            url=f"{APP_USER_BASE_URL}/{kwargs['id']}", headers=headers)

        if not response.ok:
            return Response(response.reason, status=response.status_code)

        userRoles = requests.get(
            url=f"{APP_USER_BASE_URL}/{kwargs['id']}/role-mappings", headers=headers)

        print(userRoles)
        user = response.json()

        if 'clientMappings' not in userRoles.json():
            user['roles'] = []
        else:
            clientRoles = userRoles.json(
            )['clientMappings'][os.getenv('CLIENT_ID')]['mappings']
            user['roles'] = clientRoles

        return Response(user, status=status.HTTP_200_OK)

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'firstName': openapi.Schema(type=openapi.TYPE_STRING),
            'lastName': openapi.Schema(type=openapi.TYPE_STRING),
            'email': openapi.Schema(type=openapi.TYPE_STRING),
            'enabled': openapi.Schema(type=openapi.TYPE_BOOLEAN),
            'code': openapi.Schema(type=openapi.TYPE_STRING),
            "phone": openapi.Schema(type=openapi.TYPE_STRING),
            "gender": openapi.Schema(type=openapi.TYPE_STRING),
            "country": openapi.Schema(type=openapi.TYPE_STRING)
        }
    ))
    def put(self, request, *args, **kwargs):
        form_data = {
            "firstName": request.data.get("firstName", None),
            "lastName": request.data.get("lastName", None),
            "email": request.data.get("email", None),
            "enabled": request.data.get("enabled", None),
            "attributes": {
                "code": request.data.get("code", None),
                "phone": request.data.get("phone", None),
                "gender": request.data.get("gender", None),
                "country": request.data.get("country", None),
            }
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

        checkUser = requests.get(
            url=f"{APP_USER_BASE_URL}/{kwargs['id']}", headers=headers)

        if not checkUser.ok:
            return Response({'errorMessage': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        user = checkUser.json()

        if 'attributes' not in user:
            user['attributes'] = {}

        if "avatar" in user["attributes"]:
            form_data["attributes"]["avatar"] = user["attributes"]["avatar"]

        if "status" in user["attributes"]:
            form_data["attributes"]["status"] = user["attributes"]["status"]

        res = requests.put(
            f"{APP_USER_BASE_URL}/{kwargs['id']}", json=form_data, headers=headers)

        if not res.ok:
            return Response(res.reason, status=res.status_code)

        _ = role_assign(kwargs['id'], request.data.get(
            "role", dict[str, str]), headers)

        return Response({'message': 'Account details updated successfully'}, status=status.HTTP_200_OK)

    def delete(self, request, **kwargs):
        # Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': "application/json"
        }

        checkUser = requests.get(
            url=f"{APP_USER_BASE_URL}/{kwargs['id']}", headers=headers)
        if checkUser.status_code != 200:
            return Response({'errorMessage': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        user: dict = checkUser.json()

        if 'attributes' not in user:
            user['attributes'] = {}
            user['attributes']['status'] = "Archived"

        else:
            user['attributes']['status'] = "Archived"

        user['enabled'] = False
        # user_data = {

        #     'attributes': user['attributes']
        # }

        response = requests.put(
            url=f"{APP_USER_BASE_URL}/{kwargs['id']}", json=user, headers=headers)

        if not response.ok:
            return Response(response.reason, status=response.status_code)

        return Response({'message': 'User archived successfully'}, status=status.HTTP_200_OK)


class UserRolesView(APIView):
    """
    API view to assign roles to users
    """
    keycloak_scopes = {
        'GET': 'user:read',
        'PUT': 'user:update'
    }

    roleObject = {
        'id': str,
        'name': str
    }

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'roles': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(openapi.TYPE_OBJECT))
        }
    ))
    def put(self, request, **kwargs):
        form_data = {
            'roles': request.data.get("roles", [self.roleObject])
        }
        # Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': "application/json"
        }

        response = requests.post(
            url=f"{APP_USER_BASE_URL}/{kwargs['id']}/role-mappings/realm", json=form_data, headers=headers)

        if not response.ok:
            return Response(response.reason, status=response.status_code)

        return Response({'message': 'Roles has been assigned successfully'}, status=status.HTTP_200_OK)

    def get(self, request, **kwargs):
        # Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': "application/json"
        }

        response = requests.get(
            url=f"{APP_USER_BASE_URL}/{kwargs['id']}/role-mappings", headers=headers)

        if not response.ok:
            return Response(response.reason, status=response.status_code)

        return Response(response.json(), status=status.HTTP_200_OK)


class UserAvatarView(APIView):
    """
    API view to read/upload Keycloak user avatar to minio
    """
    keycloak_scopes = {
        'GET': 'user:read',
        'POST': 'user:add'
    }
    parser_classes = (MultiPartParser,)

    def get(self, request, **kwargs):
        filename = request.query_params['filename']
        url = download_file('avatars', filename)
        headers = {
            'transfer-encoding': 'chunked'
        }
        return Response(url.read(), content_type='binary/octet-stream')

    def post(self, request, **kwargs):
        """Receives a request to upload a file and sends it to filesystem for now. Later the file will be uploaded to minio server."""
        try:
            file_obj = request.data['file']

            name_generator = gen_filename(file_obj.name)
            file_obj.name = name_generator['newName']

            # check that a filename is passed
            upload_file_to_minio("avatars", file_obj)

            admin_login = keycloak_admin_login()

            if admin_login["status"] != 200:
                return Response(admin_login["data"], status=admin_login["status"])

            headers = {
                'Authorization': f"{admin_login['data']['token_type']} {admin_login['data']['access_token']}",
                'Content-Type': "application/json",
                'cache-control': "no-cache"
            }

            response = requests.get(
                url=f"{APP_USER_BASE_URL}/{kwargs['id']}", headers=headers)

            if not response.ok:
                return Response(response.reason, status=response.status_code)

            user: dict = response.json()

            # date = datetime.now().strftime("%Y-%-m-%-d")

            if 'attributes' not in user:
                user['attributes'] = {}
                user['attributes']['avatar'] = f'{os.getenv("AVATAR_BASE_URL")}{file_obj.name}'

            else:
                user['attributes']['avatar'] = f'{os.getenv("AVATAR_BASE_URL")}{file_obj.name}'

            user_data = {
                'attributes': user['attributes']
            }

            res = requests.put(
                f"{APP_USER_BASE_URL}/{kwargs['id']}", json=user_data, headers=headers)

            if not res.ok:
                return Response({'reason': res.reason, 'message': res.text, 'user': user_data}, status=res.status_code)

            return Response({'status': 'success', "message": "Avatar uploaded successfully"}, status=200)

        except MultiValueDictKeyError:
            return Response({'status': 'error', "message": "Please provide a file to upload"}, status=500)
