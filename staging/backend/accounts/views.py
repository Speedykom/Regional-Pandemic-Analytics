from datetime import datetime, timedelta
import requests
import json
import os
import jwt
from django.http import HttpResponse
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import AllowAny
from mailer.sender import SendMail
from utils.env_configs import (APP_USER_BASE_URL, APP_SECRET_KEY, APP_REALM, APP_USER_ROLES, REST_REDIRECT_URI)

from utils.generators import get_random_secret
from utils.keycloak_auth import keycloak_admin_login, create_keycloak_user

BASE_URL = os.getenv("BASE_URL")

def homepage(request):
    print(os.getenv('CLIENT_ID'))
    return HttpResponse('<h2 style="text-align:center">Welcome to IGAD API Page</h2>')


class LoginAPI(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })


class KeyCloakLoginAPI(APIView):
    """
    API for authenticating with Keycloak
    """
    permission_classes = [AllowAny]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING),
            'password': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def post(self, request, *args, **kwargs):
        form_data = {
            "username": request.data.get("username", None),
            "password": request.data.get("password", None),
            "grant_type": "password",
            "client_id": os.getenv("CLIENT_ID"),
            "client_secret": os.getenv("CLIENT_SECRET")
        }

        res = requests.post(f"{BASE_URL}/realms/regional-pandemic-analytics/protocol/openid-connect/token",
                            data=form_data)

        if res.status_code == 200:
            data = res.json()
            return Response(data, status=status.HTTP_200_OK)

        return Response({"result": "Login Failed"}, status=status.HTTP_400_BAD_REQUEST)


class KeycloakRefreshTokenAPI(APIView):
    """API for getting new access token using refresh token"""

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'refresh_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh_token", None)
        form_data = {
            "client_id": os.getenv("CLIENT_ID"),
            "client_secret": os.getenv("CLIENT_SECRET"),
            "grant_type": "refresh_token",
            "refresh_token": refresh_token
        }

        res = requests.post(f"{BASE_URL}/realms/regional-pandemic-analytics/protocol/openid-connect/token",
                            data=form_data)

        if res.status_code == 200:
            data = res.json()
            return Response(data, status=status.HTTP_200_OK)

        return Response({"result": "Failed to get access token."}, status=status.HTTP_400_BAD_REQUEST)


class CreateUserAPI(APIView):
    """
    API view to create Keycloak user
    """
    permission_classes = [AllowAny,]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'firstName': openapi.Schema(type=openapi.TYPE_STRING),
            'lastName': openapi.Schema(type=openapi.TYPE_STRING),
            'username': openapi.Schema(type=openapi.TYPE_STRING),
            'email': openapi.Schema(type=openapi.TYPE_STRING),
            'enabled': openapi.Schema(type=openapi.TYPE_BOOLEAN)
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
            "credentials": [
                {
                    "type": "password",
                    "value": generate_password,
                    "temporary": False
                }
            ],
            "emailVerified": False,
            "requiredActions": [
                "VERIFY_EMAIL"
            ]
        }

        #Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"{admin_login['data']['token_type']} {admin_login['data']['access_token']}",
            'Content-Type': "application/json",
            'cache-control': "no-cache"
        }

        res = requests.post(f"{APP_USER_BASE_URL}", json=form_data, headers=headers)

        if res.status_code != 201:
            return Response(res.reason, status=res.status_code)
        
        user = {
            "firstName": form_data["firstName"],
            "lastName": form_data["lastName"],
            "username": form_data["username"],
            "email": form_data["email"],
            "enabled": form_data["enabled"],
            "emailVerified": form_data["emailVerified"]
        }

        return Response({'message': 'User created successfully', 'user': user}, status=status.HTTP_200_OK)
    

class UpdateUserAPI(APIView):
    """
    API view to update Keycloak user
    """
    permission_classes = [AllowAny,]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'firstName': openapi.Schema(type=openapi.TYPE_STRING),
            'lastName': openapi.Schema(type=openapi.TYPE_STRING),
            'email': openapi.Schema(type=openapi.TYPE_STRING),
            'enabled': openapi.Schema(type=openapi.TYPE_BOOLEAN)
        }
    ))

    def put(self, request, *args, **kwargs):
        form_data = {
            "firstName": request.data.get("firstName", None),
            "lastName": request.data.get("lastName", None),
            "email": request.data.get("email", None),
            "enabled": request.data.get("enabled", None),
        }

        #Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"{admin_login['data']['token_type']} {admin_login['data']['access_token']}",
            'Content-Type': "application/json",
            'cache-control': "no-cache"
        }

        res = requests.put(f"{APP_USER_BASE_URL}/{kwargs['id']}", json=form_data, headers=headers)

        if res.status_code != 204:
            return Response(res.reason, status=res.status_code)

        return Response({'message': 'Account details updated successfully'}, status=status.HTTP_200_OK)    


class ListUsersAPI(APIView):
    """
    API view to get all users
    """
    permission_classes = [AllowAny, ]

    def get(self, request, *args, **kwargs): 
        #Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': "application/json",
            'cache-control': "no-cache"
        }

        response = requests.get(f"{APP_USER_BASE_URL}", headers=headers)

        if response.status_code != 200:
            return Response(response.json(), status=response.status_code)

        users = response.json()
        return Response(users, status=status.HTTP_200_OK)


class ListRolesAPI(APIView):
    """
    API view to get realm roles
    """
    permission_classes = [AllowAny, ]

    def get(self, request, *args, **kwargs): 
        #Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': "application/json",
            'cache-control': "no-cache"
        }

        response = requests.get(f"{APP_USER_ROLES}/", headers=headers)

        if response.status_code != 200:
            return Response(response.reason, status=response.status_code) 

        roles = response.json()
        return Response(roles, status=status.HTTP_200_OK)


class GetUserAPI(APIView):
    """
    API view to get user profile
    """   
    permission_classes = [AllowAny, ]
    def get(self, request, **kwargs):
        #Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': "application/json"
        }

        response = requests.get(url=f"{APP_USER_BASE_URL}/{kwargs['id']}", headers=headers)

        if response.status_code != 200:
            return Response(response.reason, status=response.status_code)

        users = response.json()
        return Response(users, status=status.HTTP_200_OK)
    

class DeleteUserAPI(APIView):
    """
    API view to delete user from keycloak
    """   
    permission_classes = [AllowAny, ]
    def delete(self, request, **kwargs):
        #Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': "application/json"
        }

        response = requests.delete(url=f"{APP_USER_BASE_URL}/{kwargs['id']}", headers=headers)

        if response.status_code != 200:
            return Response(response.reason, status=response.status_code)
        
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)  
     
    
class AssignRolesAPI(APIView):
    """
    API view to assign roles to users
    """   
    permission_classes = [AllowAny, ]

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
        #Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': "application/json"
        }

        response = requests.post(url=f"{APP_USER_BASE_URL}/{kwargs['id']}/role-mappings/realm", json=form_data, headers=headers)

        if response.status_code != 200:
            return Response(response.reason, status=response.status_code)
        
        return Response({'message': 'Roles has been assigned successfully'}, status=status.HTTP_200_OK)       


class ResetPasswordAPI(APIView):
    """
    API view to reset users password
    """   
    permission_classes = [AllowAny, ]


    def put(self, request, **kwargs):
        #Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': "application/json"
        }

        request_body = {
            "email": request.data.get("email", None)
        }

        checkUser = requests.get(f"{APP_USER_BASE_URL}?email={request_body['email']}", headers=headers)
        if checkUser.status_code != 200:
            return Response(checkUser.reason, status=response.status_code)

        users = checkUser.json()

        if len(users) == 0:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user = users[0]

        response = requests.put(url=f"{APP_USER_BASE_URL}/{user['id']}/execute-actions-email", json=["UPDATE_PASSWORD"], headers=headers)

        if response.status_code != 200:
            return Response(response.reason, status=response.status_code)
        
        return Response({'message': 'Reset password link has been sent to your email'}, status=status.HTTP_200_OK)       


class ResetPasswordRequestAPI(APIView):
    """
    API view to reset users password
    """   
    permission_classes = [AllowAny, ]

    def post(self, request, **kwargs):
        #Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': "application/json"
        }

        request_body = {
            "email": request.data.get("email", None)
        }

        checkUser = requests.get(f"{APP_USER_BASE_URL}?email={request_body['email']}", headers=headers)
        if checkUser.status_code != 200:
            return Response(checkUser.reason, status=checkUser.status_code)

        users = checkUser.json()

        if len(users) == 0:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user = users[0]

        payload = {
            "id": user["id"],
            "name": user["firstName"],
            "email": user["email"],
            "exp": datetime.utcnow() + timedelta(hours=5),
            "secret": APP_SECRET_KEY,
            "algorithm": 'HS256'
        }

        token = jwt.encode(payload, APP_SECRET_KEY, algorithm='HS256')
        redirectUri = f"{REST_REDIRECT_URI}?tok={token}"

        SendMail("IGAD Reset Password", payload, redirectUri)
        
        return Response({'message': 'Reset password link has been sent to your email'}, status=status.HTTP_200_OK) 


class CreateRolesAPI(APIView):
    """
    API view to create Keycloak roles
    """
    permission_classes = [AllowAny,]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING),
            'description': openapi.Schema(type=openapi.TYPE_STRING)
        }
    ))

    def post(self, request, *args, **kwargs):
        form_data = {
            "name": request.data.get("name", None),
            "description": request.data.get("description", None),
        }

        #Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"{admin_login['data']['token_type']} {admin_login['data']['access_token']}",
            'Content-Type': "application/json",
            'cache-control': "no-cache"
        }

        res = requests.post(f"{APP_USER_ROLES}", json=form_data, headers=headers)

        if res.status_code != 201:
            return Response(res.reason, status=res.status_code)

        return Response({'message': f'{form_data["name"]} role created successfully'}, status=status.HTTP_200_OK)
    

class DeleteRolesAPI(APIView):
    """
    API view to delete Keycloak roles
    """
    permission_classes = [AllowAny,]

    def delete(self, request, *args, **kwargs):
        #Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"{admin_login['data']['token_type']} {admin_login['data']['access_token']}",
            'Content-Type': "application/json",
            'cache-control': "no-cache"
        }

        res = requests.delete(f"{BASE_URL}/admin/realms/{APP_REALM}/roles-by-id/{kwargs['id']}", headers=headers)

        if res.status_code != 204:
            return Response(res.reason, status=res.status_code)

        return Response({'message': 'Role deletion was successful'}, status=status.HTTP_200_OK)  


class UpdateRolesAPI(APIView):
    """
    API view to delete Keycloak roles
    """
    permission_classes = [AllowAny,]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING),
            'description': openapi.Schema(type=openapi.TYPE_STRING)
        }
    ))

    def post(self, request, *args, **kwargs):
        form_data = {
            "name": request.data.get("name", None),
            "description": request.data.get("description", None),
        }

        #Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"{admin_login['data']['token_type']} {admin_login['data']['access_token']}",
            'Content-Type': "application/json",
            'cache-control': "no-cache"
        }

        res = requests.put(f"{BASE_URL}/admin/realms/{APP_REALM}/roles-by-id/{kwargs['id']}", json=form_data, headers=headers)

        if res.status_code != 204:
            return Response(res.reason, status=res.status_code)

        return Response({'message': 'Role update was successful'}, status=status.HTTP_200_OK)        

# class SendMailAPI(APIView):
#     permission_classes = [AllowAny,]
