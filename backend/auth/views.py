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
from rest_framework.parsers import MultiPartParser
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import AllowAny
from mailer.sender import SendMail
from utils.filename import gen_filename
from utils.env_configs import (
    BASE_URL, APP_USER_BASE_URL, APP_SECRET_KEY, APP_REALM, APP_USER_ROLES, REST_REDIRECT_URI)

from utils.generators import get_random_secret
from utils.keycloak_auth import keycloak_admin_login, role_assign

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


class Authorization (APIView):
    permission_classes = [AllowAny]
     
    """
    API to get details of current logged in user
    """
    def get(self, request, *args, **kwargs):
        reqToken: str = request.META.get('HTTP_AUTHORIZATION')
        if reqToken is None:
            return Response({'error': 'Authorization header was not provider or invalid'})
        
        serialToken = reqToken.replace("Bearer ", "")
        form_data = {
            "client_id": os.getenv("CLIENT_ID"),
            "client_secret": os.getenv("CLIENT_SECRET"),
            "token": serialToken
        }
        response = requests.post(f"{BASE_URL}/realms/{APP_REALM}/protocol/openid-connect/token/introspect",
                            data=form_data)
        
        if response.status_code != 200:
            return Response({'status': response.json()['active'], 'error': 'Authorization token is invalid or expired'}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(response.json(), status=status.HTTP_200_OK)
    
class Logout (APIView):
    permission_classes = [AllowAny]
     
    """
    API to logout user
    """
    def get(self, request, *args, **kwargs):
        reqToken: str = request.META.get('HTTP_AUTHORIZATION')
        if reqToken is None:
            return Response({'error': 'Refresh token was not set in authorization header'}, status=status.HTTP_400_BAD_REQUEST)
        
        serialToken = reqToken.replace("Bearer ", "")
        form_data = {
            "client_id": os.getenv("CLIENT_ID"),
            "client_secret": os.getenv("CLIENT_SECRET"),
            "refresh_token": serialToken
        }
        response = requests.post(f"{BASE_URL}/realms/{APP_REALM}/protocol/openid-connect/logout",
                            data=form_data)
        
        if response.status_code != 204:
            return Response(response.json(), status=response.status_code)
        
        return Response({'message': 'Logout was successful', 'success': True}, status=status.HTTP_200_OK)    

class KeyCloakLoginAPI(APIView):
    permission_classes = [AllowAny]
    
    """
    API for authenticating with Keycloak
    """
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

        res = requests.post(f"{BASE_URL}/realms/{APP_REALM}/protocol/openid-connect/token",
                            data=form_data)

        if res.status_code == 200:
            data = res.json()
            return Response(data, status=status.HTTP_200_OK)

        return Response({"result": "Login Failed"}, status=res.status_code)
    
    """API to refresh and update keycloak access token
    """
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'refresh_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def put(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh_token", None)
        form_data = {
            "client_id": os.getenv("CLIENT_ID"),
            "client_secret": os.getenv("CLIENT_SECRET"),
            "grant_type": "refresh_token",
            "refresh_token": refresh_token
        }

        res = requests.post(f"{BASE_URL}/realms/{APP_REALM}/protocol/openid-connect/token",
                            data=form_data)

        if res.status_code == 200:

            data = res.json()
            return Response(data, status=status.HTTP_200_OK)

        return Response({"result": "Failed to get access token."}, status=status.HTTP_400_BAD_REQUEST)

        
class PasswordAPI(APIView):
    permission_classes = [AllowAny,]
     
    """
    API view to create, update Keycloak user password after reset request
    """
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'newPassword': openapi.Schema(type=openapi.TYPE_STRING),
            'confirmPassword': openapi.Schema(type=openapi.TYPE_STRING),
            'token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def post(self, request, *args, **kwargs):
        # Login to admin
        admin_login = keycloak_admin_login()
        
        form_data = {
            "newPassword": request.data.get("newPassword", None),
            "confirmPassword": request.data.get("lastName", None),
            "token": request.data.get("token", None),
        }

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': "application/json",
            'cache-control': "no-cache"
        }

        credentials = {
            "type": "password",
            "value": form_data["newPassword"],
            "temporary": False
        }

        try:
            decode = jwt.decode(
                form_data["token"], APP_SECRET_KEY, algorithms=['HS256'])
            requests.put(
                f"{APP_USER_BASE_URL}/{decode['id']}/reset-password", json=credentials, headers=headers)
            return Response({'message': 'Password created successfully'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'errorMessage': 'Reset password token expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'errorMessage': 'Token provided is invalid'}, status=status.HTTP_401_UNAUTHORIZED)
        
    """
    API view to change Keycloak user password
    """
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'id': openapi.Schema(type=openapi.TYPE_STRING),
            'newPassword': openapi.Schema(type=openapi.TYPE_STRING),
            'confirmPassword': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def put(self, request, *args, **kwargs):
        # Login to admin
        admin_login = keycloak_admin_login()
        
        form_data = {
            "id": request.data.get("id", None),
            "newPassword": request.data.get("newPassword", None),
            "confirmPassword": request.data.get("lastName", None),
        }

        if admin_login["status"] != 200:
            return Response(admin_login["data"], status=admin_login["status"])

        headers = {
            'Authorization': f"Bearer {admin_login['data']['access_token']}",
            'Content-Type': "application/json",
            'cache-control': "no-cache"
        }

        credentials = {
            "type": "password",
            "value": form_data["newPassword"],
            "temporary": False
        }

        res = requests.put(
            f"{APP_USER_BASE_URL}/{form_data['id']}/reset-password", json=credentials, headers=headers)

        if res.status_code == 200:
            return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)

        print(res.text)
        return Response({'errorMessage': 'Error changing password'}, status=res.status_code)   


class ResetPasswordAPI(APIView):
    """
    API view to reset users password
    """
    permission_classes = [AllowAny, ]

    def post(self, request, **kwargs):
        # Login to admin
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

        checkUser = requests.get(
            f"{APP_USER_BASE_URL}?email={request_body['email']}", headers=headers)
        if checkUser.status_code != 200:
            return Response(checkUser.reason, status=checkUser.status_code)

        users = checkUser.json()

        if len(users) == 0:
            return Response({'errorMessage': 'Account not found'}, status=status.HTTP_404_NOT_FOUND)

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
    
    """
    API endpoint to verify reset password token
    """
    def patch(self, request, *args, **kwargs):
        form_data = {
            "token": request.data.get("token", None),
        }

        try:
            decode = jwt.decode(
                form_data["token"], APP_SECRET_KEY, algorithms=['HS256'])
            return Response(decode, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'errorMessage': 'Reset password token expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'errorMessage': 'Token provided is invalid'}, status=status.HTTP_401_UNAUTHORIZED)