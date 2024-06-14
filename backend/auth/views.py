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
from rest_framework.views import APIView
from rest_framework import status
from binascii import unhexlify
from django.http import JsonResponse
from django.conf import settings
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
from base64 import b64decode
from binascii import unhexlify
from utils.env_configs import (
    BASE_URL, APP_SECRET_KEY, APP_REALM, REST_REDIRECT_URI)

class LoginAPI(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        """
        Endpoint for login with username and password
        """
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
        """
        Endpoint for getting details of the current logged in user 
        """
        reqToken: str = request.META.get('HTTP_AUTHORIZATION')
        if reqToken is None:
            return Response({'error': 'Authorization header was not provider or invalid'})
        
        access_token = reqToken.replace("Bearer ", "")
        keycloak_openid = get_keycloak_openid(request)
        token_info = keycloak_openid.introspect(access_token)
        if (not token_info['active']):
            return Response({'error': 'Authorization token is invalid or expired'}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({'success': True}, status=status.HTTP_200_OK)
    
class Logout (APIView):
    permission_classes = [AllowAny]
     
    """
    API to logout user
    """
    def post(self, request, *args, **kwargs):
        """
        Endpoint for loggin out
        """
        reqToken: str = request.META.get('HTTP_AUTHORIZATION')

        if reqToken is None:
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
            return Response(response.json(), status=response.status_code)
        
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
        """
        Endpoint for authenticating with Keycloak (exchange code for token)
        """
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

            return Response({"result": "Login Failed"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
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
        """
        Endpoint for refreshing and updating Keycloak access token
        """
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
        """
        Endpoint for changing password 
        """
        newPassword = request.data.get("newPassword", None)
        confirmPassword = request.data.get("confirmPassword", None)
        token = request.data.get("token", None)

        decode = jwt.decode(token, APP_SECRET_KEY, algorithms=['HS256'])
        user_id = get_current_user_id(request)

        if not newPassword or newPassword != confirmPassword:
            return Response({'errorMessage': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)
        elif decode['id'] != user_id:
            return Response({'errorMessage': 'Invalid reset password token'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            keycloak_admin = get_keycloak_admin()
            keycloak_admin.set_user_password(user_id=user_id, password=newPassword, temporary=False)
            return Response({'message': 'Password created successfully'}, status=status.HTTP_200_OK)
        except Exception as err:
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
        """
        Endpoint for changing Keycloak password 
        """
        key_hex = os.getenv("PASSWORD_HEX_KEY")
        key = unhexlify(key_hex)
        iv_hex = os.getenv("PASSWORD_IVHEX")
        iv = unhexlify(iv_hex)

        try:
            encrypted_new_password = request.data.get("newPassword", None)
            encrypted_confirm_password = request.data.get("confirmPassword", None)

            # Function to decrypt and unpad passwords
            def decrypt_password(encrypted_password):
                cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
                decryptor = cipher.decryptor()
                unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()

                decrypted_password = decryptor.update(b64decode(encrypted_password)) + decryptor.finalize()
                unpadded_password = unpadder.update(decrypted_password) + unpadder.finalize()
                return unpadded_password.decode('utf-8')

            # Decrypt both passwords
            new_password = decrypt_password(encrypted_new_password)
            confirm_password = decrypt_password(encrypted_confirm_password)

            if new_password != confirm_password:
                return JsonResponse({'errorMessage': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

            user_id = request.data.get("id", None)
            keycloak_admin = get_keycloak_admin()
            keycloak_admin.set_user_password(user_id=user_id, password=new_password, temporary=False)

            return JsonResponse({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)
        except Exception as err:
            return JsonResponse({'errorMessage': 'Unable to decrypt or update user password', 'details': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class ResetPasswordAPI(APIView):
    """
    API view to reset users password
    """
    permission_classes = [AllowAny, ]

    def post(self, request, **kwargs):
        """
        Endpoint for sending email reset password 
        """
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

            return Response({'message': 'Reset password link has been sent to your email'}, status=status.HTTP_200_OK)
        except Exception as err:
            return Response({'errorMessage': 'Unable to reset the user password'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    """
    API endpoint to verify reset password token
    """
    def patch(self, request, *args, **kwargs):
        """
        Endpoint for reset password token verification
        """
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
