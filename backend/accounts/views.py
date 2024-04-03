
import os
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from datetime import datetime
from utils.filename import gen_filename
from utils.minio import client
from utils.keycloak_auth import get_current_user_id
from rest_framework.parsers import MultiPartParser


from django.utils.datastructures import MultiValueDictKeyError

from .serializers import *
from .models import *

from utils.generators import get_random_secret
from utils.keycloak_auth import get_keycloak_admin
from django.conf import settings
from django.http import HttpResponseBadRequest, HttpResponseServerError, HttpResponseNotFound


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
            client_id = keycloak_admin.get_client_id(settings.KEYCLOAK_CONFIG['KEYCLOAK_CLIENT_ID'])
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
        try:
            keycloak_admin = get_keycloak_admin()
            user = keycloak_admin.get_user(kwargs['id'])
            client_id = keycloak_admin.get_client_id(settings.KEYCLOAK_CONFIG['KEYCLOAK_CLIENT_ID'])
            roles = keycloak_admin.get_client_roles_of_user(user_id=kwargs['id'], client_id=client_id)
            user["roles"] = roles
            return Response(user, status=status.HTTP_200_OK)
        except Exception as err:
            return Response({'errorMessage': 'Unable to retrieve the user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

        try:
            keycloak_admin = get_keycloak_admin()
            keycloak_admin.update_user(kwargs['id'], form_data)
            role = request.data.get("role", {})
            client_id = keycloak_admin.get_client_id(settings.KEYCLOAK_CONFIG['KEYCLOAK_CLIENT_ID'])
            keycloak_admin.assign_client_role(client_id=client_id, user_id=kwargs['id'], roles=[role])
            return Response({'message': 'Account details updated successfully'}, status=status.HTTP_200_OK)
        except Exception as err:
            return Response({'errorMessage': 'Unable to update the user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, **kwargs):
        try:
            keycloak_admin = get_keycloak_admin()
            user_data = {
                'attributes': {
                    'status': "Archived"
                },
                'enabled': False
            }
            keycloak_admin.update_user(kwargs['id'], user_data)
            return Response({'message': 'User archived successfully'}, status=status.HTTP_200_OK)
        except Exception as err:
            return Response({'errorMessage': 'Unable to archive the user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        try:
            keycloak_admin = get_keycloak_admin()
            roles = request.data.get("roles", [self.roleObject])
            client_id = keycloak_admin.get_client_id(settings.KEYCLOAK_CONFIG['KEYCLOAK_CLIENT_ID'])
            keycloak_admin.assign_client_role(client_id=client_id, user_id=kwargs['id'], roles=roles)
            return Response({'message': 'Roles has been assigned successfully'}, status=status.HTTP_200_OK)
        except Exception as err:
            return Response({'errorMessage': 'Unable to assign roles to the user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, **kwargs):
        try:
            keycloak_admin = get_keycloak_admin()
            client_id = keycloak_admin.get_client_id(settings.KEYCLOAK_CONFIG['KEYCLOAK_CLIENT_ID'])
            roles = keycloak_admin.get_client_roles_of_user(user_id=kwargs['id'], client_id=client_id)
            return Response(roles, status=status.HTTP_200_OK)
        except Exception as err:
            return Response({'errorMessage': 'Unable to retrieve the user roles'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        try:
            user_id = kwargs.get('id')
            if not user_id:
                return HttpResponseBadRequest("Bad request: User ID parameter is missing.")

            bucket_name = 'avatars'
            prefix = f'avatars/{user_id}/'  # Objects are stored under 'avatars/user_id/'

            # Fetching objects with the given prefix
            objects = client.list_objects(bucket_name, prefix=prefix)

            if not objects:
                return HttpResponseNotFound("Avatar file not found for the specified user.")
            
            # Find the first object that has the 'object_name' attribute
            avatar_file = next((obj for obj in objects if hasattr(obj, 'object_name')), None)

            if avatar_file is None:
                return HttpResponseNotFound("Avatar file not found for the specified user.")
            base_url = os.getenv("BACKEND_AVATAR_BASE_URL")
            # Construct the path with an additional 'avatars/' as it's required by the object's structure
            avatar_path = f'{getattr(avatar_file, "object_name")}'
            # Combine the base URL with the avatar path
            avatar_url = f'{base_url}/{avatar_path}'

            return JsonResponse({"avatar_url": avatar_url})

        except Exception as err:
            return HttpResponseServerError(f"Error retrieving avatar: {str(err)}")
            
    def post(self, request, **kwargs):
        """Receives a request to upload a file and sends it to filesystem for now. Later the file will be uploaded to minio server."""
        user_id = get_current_user_id(request)
        uploaded_file = request.FILES.get("uploadedFile")
        if (uploaded_file) :
            try:
                client.put_object(
                    bucket_name='avatars',
                    object_name=f'avatars/{user_id}/{uploaded_file.name}',
                    data=uploaded_file,
                    length=uploaded_file.size,
                    metadata={
                    "uploaded": f"{datetime.utcnow()}",
                },
                )

                #keycloak_admin = get_keycloak_admin()
                #user_data = {
                #    'attributes': {
                #        'avatar': f'{os.getenv("BACKEND_AVATAR_BASE_URL")}{user_id}/{uploaded_file.name}'
                #    }
                #}
                #keycloak_admin.update_user(user_id, user_data)
                return Response({'message': 'Avatar uploaded successfully'}, status=status.HTTP_200_OK)
            except Exception as err:
                return Response({'errorMessage': 'Unable to update the user avatar'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        elif MultiValueDictKeyError:
            return Response({'status': 'error', "message": "Please provide a file to upload"}, status=500)
