
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
from django.core.cache import cache
from datetime import datetime, timezone
import logging
import requests
from core.keycloak_impersonation import get_auth_token
from django.http import StreamingHttpResponse, HttpResponseBadRequest, HttpResponseNotFound, HttpResponseServerError
import pyclamd
import smtplib
from email.mime.text import MIMEText
from jinja2 import Template


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
        """
        Endpoint for listing all users 
        """
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
        """
        Endpoint for creating a new user 
        """
        generate_password = get_random_secret(10)
        current_language = request.data.get("currentLanguage", None)

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
                    "temporary": True
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
            #send an email to the user to ask him to change the password
            if current_language.upper() == 'EN':
                subject = "Action Required - New account in RePan"
            elif current_language.upper() == 'FR':
                subject = "Action requise - Nouveau compte dans RePan"
             
            template_file_name = f"new_account_{current_language.upper()}.jinja.html"    
            frontend_url = os.getenv("KEYCLOAK_REDIRECT_URI")
            with open("email_templates/" + template_file_name) as f:
                body = Template(f.read()).render(name=user["firstName"], username=user["username"], password=user["password"], frontend_url=frontend_url)
            
            sender = os.getenv("MAIL_USER")
            recipients = [f"{user['email']}"]
            password = os.getenv("MAIL_PASSWORD")

            msg = MIMEText(body, 'html')
            msg['Subject'] = subject
            msg['From'] = sender
            msg['To'] = ', '.join(recipients)
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
                smtp_server.login(sender, password)
                smtp_server.sendmail(sender, recipients, msg.as_string())
            return Response({'message': 'User created successfully', 'user': user}, status=status.HTTP_201_CREATED)
        except Exception as err:
            return Response({'errorMessage': 'Unable to create a new user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDetailView(APIView):
    """
    View class for listing, updating and deleting a single user
    """
    keycloak_scopes = {
        'GET': 'user:read',
        'PUT': 'user:update',
        'DELETE': 'user:delete'
    }

    def get(self, request, **kwargs):
        """
        Endpoint for getting information about a user 
        """
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
        """
        Endpoint for updating a user 
        """
        user_data = request.data  

        try:
            keycloak_admin = get_keycloak_admin()
            user_id = kwargs['id']

            # Check if 'enabled' is in request data to determine enabling user
            if 'enabled' in user_data:
                user = keycloak_admin.get_user(user_id)
                user['enabled'] = user_data['enabled']
                keycloak_admin.update_user(user_id, user)
                return Response({'message': 'User enabled successfully'}, status=status.HTTP_200_OK)

            # Otherwise, update user details
            keycloak_admin.update_user(user_id, user_data)
            return Response({'message': 'User updated successfully'}, status=status.HTTP_200_OK)
        except Exception as err:
            return Response({'errorMessage': 'Unable to update the user. Error: {}'.format(str(err))}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def delete(self, request, **kwargs):
        """
        Endpoint for deleting a user 
        """
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
    def patch(self, request, **kwargs):
        try:
            keycloak_admin = get_keycloak_admin()
            user_data = {
                'enabled': True
            }
            keycloak_admin.update_user(kwargs['id'], user_data)
            return Response({'message': 'User enabled successfully'}, status=status.HTTP_200_OK)
        except Exception as err:
            return Response({'errorMessage': 'Unable to enable the user. Error: {}'.format(str(err))}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
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
        """
        Endpoint for updating the role of a user
        """
        try:
            keycloak_admin = get_keycloak_admin()
            roles = request.data.get("roles", [self.roleObject])
            client_id = keycloak_admin.get_client_id(settings.KEYCLOAK_CONFIG['KEYCLOAK_CLIENT_ID'])
            keycloak_admin.assign_client_role(client_id=client_id, user_id=kwargs['id'], roles=roles)
            return Response({'message': 'Roles has been assigned successfully'}, status=status.HTTP_200_OK)
        except Exception as err:
            return Response({'errorMessage': 'Unable to assign roles to the user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, **kwargs):
        """
        Endpoint for listing the roles of a user 
        """
        try:
            keycloak_admin = get_keycloak_admin()
            client_id = keycloak_admin.get_client_id(settings.KEYCLOAK_CONFIG['KEYCLOAK_CLIENT_ID'])
            roles = keycloak_admin.get_client_roles_of_user(user_id=kwargs['id'], client_id=client_id)
            return Response(roles, status=status.HTTP_200_OK)
        except Exception as err:
            return Response({'errorMessage': 'Unable to retrieve the user roles'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)








class UserAvatarView(APIView):
    """
    API view to read/upload Keycloak user avatar to the backend.
    """
    keycloak_scopes = {
        'GET': 'user:read',
        'POST': 'user:add'
    }
    parser_classes = (MultiPartParser,)

    def get(self, request, *args, **kwargs):
        """
        Endpoint for getting user avatar 
        """
        try:
            user_id = kwargs['id']
            if not user_id:
                return HttpResponseBadRequest("User ID is missing.")

            bucket_name = 'avatars'
            prefix = f'{user_id}/'
            objects = client.list_objects(bucket_name, prefix=prefix)

            first_object = next(objects, None)
            if not first_object:
                return HttpResponseNotFound("Avatar not found.")

            object_name = first_object.object_name
            file_data = client.get_object(bucket_name, object_name)

            # Set correct content type
            if first_object.content_type:
                content_type = first_object.content_type
            else:
                # Default to a common type if undefined
                content_type = "image/jpeg"

            response = StreamingHttpResponse(file_data, content_type=content_type)
            response["Content-Disposition"] = f'inline; filename="{object_name}"'
            return response
        except Exception as err:
            logging.error(f"Error retrieving avatar: {err}")
            return HttpResponseServerError(f"Error: {err}")



    def post(self, request, **kwargs):
        """
        Endpoint for uploading a user avatar
        """
        user_id = kwargs['id']
        if not user_id:
            return HttpResponseBadRequest("Bad request: User ID parameter is missing.")

        uploaded_file = request.FILES.get("uploadedFile")

        cd = pyclamd.ClamdNetworkSocket(host="clamav", port=3310)
        scan_result = cd.scan_stream(uploaded_file.read())
        if scan_result is not None:
            logging.error(f"Malicious File Upload in Avatar : {scan_result}")
            return Response({'errorMessage': f'Malicious File Upload: {scan_result}'}, status=status.HTTP_400_BAD_REQUEST)
        # seeking to 0 in the uploaded_file because scan_stream does not release the pointer 
        uploaded_file.seek(0)

        if not uploaded_file:
            return HttpResponseBadRequest("No file uploaded.")
        try:
            keycloak_admin = get_keycloak_admin()
            # Fetch the current user data to preserve existing attributes
            current_user_data = keycloak_admin.get_user(user_id)
            current_attributes = current_user_data.get('attributes', {})

            bucket_name = 'avatars'
            prefix = f'{user_id}/'
            object_name = f'{prefix}avatar'  # Always use the same object name

            # Delete the old avatar if it exists

            client.remove_object(bucket_name, object_name)

            # Upload new avatar

            client.put_object(
                bucket_name=bucket_name,
                object_name=object_name,
                data=uploaded_file,
                length=uploaded_file.size,
                content_type=uploaded_file.content_type,
                metadata={"uploaded": f"{datetime.now(timezone.utc)}"}
            )

            # Update the avatar URL in the current attributes

            # Update the user's data in Keycloak with all preserved attributes
            cache_key = f'user_avatar_{user_id}'
            cache.delete(cache_key)

            return Response({'message': 'Avatar uploaded successfully'}, status=status.HTTP_200_OK)
        except Exception as err:
            logging.error(f"Unable to update the user avatar: {str(err)}")
            return Response({'errorMessage': f'Unable to update the user avatar: {str(err)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
