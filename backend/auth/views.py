from datetime import datetime, timedelta
import requests
import os
import jwt
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import AllowAny
from mailer.sender import SendMail
from utils.keycloak_auth import get_keycloak_admin, get_keycloak_openid, get_current_user_id
from django.conf import settings
from utils.env_configs import (
    BASE_URL, APP_SECRET_KEY, APP_REALM, REST_REDIRECT_URI)

import logging

logger = logging.getLogger(__name__)

class Authorization (APIView):
    
    permission_classes = [AllowAny]
     
    """
    API to get details of current logged in user
    """
    def get(self, request, *args, **kwargs):
        reqToken: str = request.META.get('HTTP_AUTHORIZATION')
        if reqToken is None:

            logger.error("Authorization header was not provider or invalid")

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
            logger.error("Authorization token is invalid or expired")
            return Response({'status': response.json()['active'], 'error': 'Authorization token is invalid or expired'}, status=status.HTTP_401_UNAUTHORIZED)
        
        logger.info("Authorization token is invalid or expired")
        return Response(response.json(), status=status.HTTP_200_OK)
    
class Logout (APIView):
    permission_classes = [AllowAny]
     
    """
    API to logout user
    """
    def post(self, request, *args, **kwargs):
        reqToken: str = request.META.get('HTTP_AUTHORIZATION')

        if reqToken is None:
            logger.info('Refresh token was not set in authorization header')
            return Response({'error': 'Refresh token was not set in authorization header'}, status=status.HTTP_401_UNAUTHORIZED)
        
        serialToken = reqToken.replace("Bearer ", "")

        form_data = {
            "client_id": os.getenv("CLIENT_ID"),
            "client_secret": os.getenv("CLIENT_SECRET"),
            "refresh_token": serialToken
        }

        response = requests.post(f"{BASE_URL}/realms/{APP_REALM}/protocol/openid-connect/logout",
                            data=form_data)

        if not response.ok:
            logger.error(response.json())
            return Response(response.json(), status=response.status_code)
        
        logger.info("Logout was successful")
        return Response({'message': 'Logout was successful', 'success': True}, status=status.HTTP_200_OK)    

class KeyCloakLoginAPI(APIView):
    permission_classes = [AllowAny]
    
    """
    API for authenticating with Keycloak (exchange code for token)
    """
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'code': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def post(self, request, *args, **kwargs):
        try:
            config = settings.KEYCLOAK_CONFIG
            keycloak = get_keycloak_openid(request)
            credentials = keycloak.token(
                grant_type='authorization_code',
                code=request.data.get("code", None),
                redirect_uri=config["KEYCLOAK_REDIRECT_URI"] + "/",
                scope="openid email profile offline_access roles",
            )
            if credentials:
                keycloak_admin = get_keycloak_admin()
                client_id = config['KEYCLOAK_CLIENT_ID']
                client_id = keycloak_admin.get_client_id(client_id)
                client_authz_settings = keycloak_admin.get_client_authz_settings(client_id=client_id)
                keycloak.authorization.load_config(client_authz_settings)
                user_permissions = keycloak.get_permissions(credentials['access_token'])
                credentials["permissions"] = map(lambda p: {'name': p.name, 'scopes': p.scopes}, user_permissions)
                return Response(credentials, status=status.HTTP_200_OK)

            logger.error("Login Failed")
            return Response({"result": "Login Failed"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.error("Login Failed")
            return Response({"result": "Login Failed"}, status=status.HTTP_401_UNAUTHORIZED)

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

        logger.error("Failed to get access token.")

        return Response({"result": "Failed to get access token."}, status=status.HTTP_400_BAD_REQUEST)

        
class PasswordAPI(APIView):
    keycloak_scopes = {
        'PUT': 'user:update'
    }
     
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
        newPassword = request.data.get("newPassword", None)
        confirmPassword = request.data.get("confirmPassword", None)
        token = request.data.get("token", None)

        decode = jwt.decode(token, APP_SECRET_KEY, algorithms=['HS256'])
        user_id = get_current_user_id(request)

        if not newPassword or newPassword != confirmPassword:
            logger.error('Invalid password')
            return Response({'errorMessage': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)
        elif decode['id'] != user_id:
            logger.error('Invalid reset password token')
            return Response({'errorMessage': 'Invalid reset password token'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            keycloak_admin = get_keycloak_admin()
            keycloak_admin.set_user_password(user_id=user_id, password=newPassword, temporary=False)
            logger.info('Password created successfully')
            return Response({'message': 'Password created successfully'}, status=status.HTTP_200_OK)
        except Exception as err:
            logger.error('Unable to create user password')
            return Response({'errorMessage': 'Unable to create user password'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
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
        newPassword = request.data.get("newPassword", None)
        confirmPassword = request.data.get("confirmPassword", None)

        if not newPassword or newPassword != confirmPassword:
            logger.error('Invalid password')
            return Response({'errorMessage': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = request.data.get("id", None)
            keycloak_admin = get_keycloak_admin()
            keycloak_admin.set_user_password(user_id=user_id, password=newPassword, temporary=False)
            logger.info('Password updated successfully')
            return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)
        except Exception as err:
            logger.error('Unable to update user password')
            return Response({'errorMessage': 'Unable to update user password'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPasswordAPI(APIView):
    """
    API view to reset users password
    """
    permission_classes = [AllowAny, ]

    def post(self, request, **kwargs):
        try:
            keycloak_admin = get_keycloak_admin()
            users = keycloak_admin.get_users({
                "email": request.data.get("email", None)
            })

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
            
            logger.info('Reset password link has been sent to your email')
            return Response({'message': 'Reset password link has been sent to your email'}, status=status.HTTP_200_OK)
        except Exception as err:
            logger.error('Unable to reset the user password')
            return Response({'errorMessage': 'Unable to reset the user password'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            logger.error('Reset password token expired')
            return Response({'errorMessage': 'Reset password token expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            logger.error('Token provided is invalid')
            return Response({'errorMessage': 'Token provided is invalid'}, status=status.HTTP_401_UNAUTHORIZED)