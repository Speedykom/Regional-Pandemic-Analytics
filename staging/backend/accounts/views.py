import requests
import json
import os
from django.http import HttpResponse
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import AllowAny
from utils.env_configs import (APP_USER_BASE_URL, APP_CLIENT_ID, APP_CLIENT_SECRET, APP_REALM, APP_USER_ROLES)

from utils.generators import get_random_secret
from utils.keycloak_auth import keycloak_admin_login

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
        
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            print(admin_login["data"])
        
        print(admin_login)

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
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'firstName': openapi.Schema(type=openapi.TYPE_STRING),
            'lastName': openapi.Schema(type=openapi.TYPE_STRING),
            'username': openapi.Schema(type=openapi.TYPE_STRING),
            'email': openapi.Schema(type=openapi.TYPE_STRING)
        }
    ))
    def post(self, request):
        form_data = {
            "firstName": request.data.get("firstName", None),
            "lastName": request.data.get("lastName", None),
            "username": request.data.get("username", None),
            "email": request.data.get("email", None),
            "enabled": True,
            "credentials": [
                {
                    "type": "password",
                    "value": get_random_secret(8),
                    "temporary": False
                }
            ],
            "requiredActions": [
                "VERIFY_EMAIL"
            ],
            "groups": [],
            "attributes": {
                "locale": [
                    "en"
                ]
            }
        }

        # Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])
        
        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': 'application/json'
        }

        response = requests.post(url=APP_USER_BASE_URL, data=form_data, headers=headers)

        if response.status_code != 200 or response.status_code != 201:
            return Response(response.reason, status=response.status_code)
        
        user = {
            "firstName": form_data["firstName"],
            "lastName": form_data["lastName"],
            "username": form_data["username"],
            "email": form_data["email"],
        }
        return Response(user, status=status.HTTP_200_OK)


class ListUsersAPI(APIView):
    """
    API view to get all users
    """
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
            return Response(response.reason, status=response.status_code)

        users = response.json()
        return Response(users, status=status.HTTP_200_OK)
    
    
class ListRolesAPI(APIView):
    """
    API view to get realm roles
    """
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
    def get(self, request):
        #Login to admin
        admin_login = keycloak_admin_login()

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': "application/json"
        }

        response = requests.get(url=f"{APP_USER_BASE_URL}/{request.query_params.get('id', None)}", headers=headers)

        if response.status_code != 200:
            return Response(response.reason, status=response.status_code)
        
        users = response.json()
        return Response(users, status=status.HTTP_200_OK)

