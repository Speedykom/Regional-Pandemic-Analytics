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

# Set up logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.FileHandler('/var/log/backend/backend.log')
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s:%(levelname)s:%(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

class LoginAPI(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        """
        Endpoint for login with username and password
        """
        logger.info("Login attempt with data: %s", request.data)
        serializer = self.serializer_class(data=request.data, context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            logger.info("Login successful for user: %s", user.username)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'email': user.email
            })
        except Exception as e:
            logger.error("Login failed: %s", str(e))
            return Response({'error': 'Login failed'}, status=status.HTTP_400_BAD_REQUEST)


class Authorization(APIView):
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
            logger.warning("Authorization header was not provided or invalid.")
            return Response({'error': 'Authorization header was not provided or invalid'}, status=status.HTTP_400_BAD_REQUEST)
        
        access_token = reqToken.replace("Bearer ", "")
        keycloak_openid = get_keycloak_openid(request)
        try:
            token_info = keycloak_openid.introspect(access_token)
            if not token_info['active']:
                logger.warning("Authorization token is invalid or expired.")
                return Response({'error': 'Authorization token is invalid or expired'}, status=status.HTTP_401_UNAUTHORIZED)
            
            logger.info("Authorization token is valid.")
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error("Authorization check failed: %s", str(e))
            return Response({'error': 'Authorization check failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
class Logout(APIView):
    permission_classes = [AllowAny]

    """
    API to logout user
    """
    def post(self, request, *args, **kwargs):
        """
        Endpoint for logging out
        """
        logger.info("Logout attempt")
        reqToken: str = request.META.get('HTTP_AUTHORIZATION')

        if reqToken is None:
            logger.warning("Refresh token was not set in authorization header")
            return Response({'error': 'Refresh token was not set in authorization header'}, status=status.HTTP_401_UNAUTHORIZED)
        
        serialToken = reqToken.replace("Bearer ", "")

        form_data = {
            "client_id": os.getenv("CLIENT_ID"),
            "client_secret": os.getenv("CLIENT_SECRET"),
            "refresh_token": serialToken
        }

        response = requests.post(f"{BASE_URL}/realms/{APP_REALM}/protocol/openid-connect/logout", data=form_data)

        if not response.ok:
            logger.error("Logout failed: %s", response.json())
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
        """
        Endpoint for authenticating with Keycloak (exchange code for token)
        """
        logger.info("Keycloak login attempt with code: %s", request.data.get("code", None))
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
                logger.info("Keycloak login successful for code: %s", request.data.get("code", None))
                return Response(credentials, status=status.HTTP_200_OK)

            logger.warning("Keycloak login failed for code: %s", request.data.get("code", None))
            return Response({"result": "Login Failed"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.error("Keycloak login error: %s", str(e))
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
        logger.info("Token refresh attempt with refresh_token: %s", request.data.get("refresh_token", None))
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
            logger.info("Token refresh successful")
            return Response(data, status=status.HTTP_200_OK)

        logger.error("Token refresh failed: %s", res.json())
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
            logger.warning("Invalid password change attempt for user ID: %s", user_id)
            return Response({'errorMessage': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)
        elif decode['id'] != user_id:
            logger.warning("Invalid reset password token for user ID: %s", user_id)
            return Response({'errorMessage': 'Invalid reset password token'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            keycloak_admin = get_keycloak_admin()
            keycloak_admin.set_user_password(user_id=user_id, password=newPassword, temporary=False)
            logger.info("Password created successfully for user ID: %s", user_id)
            return Response({'message': 'Password created successfully'}, status=status.HTTP_200_OK)
        except Exception as err:
            logger.error("Unable to create user password for user ID: %s, Error: %s", user_id, str(err))
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
                logger.warning("Passwords do not match for user ID: %s", request.data.get("id", None))
                return JsonResponse({'errorMessage': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

            user_id = request.data.get("id", None)
            keycloak_admin = get_keycloak_admin()
            keycloak_admin.set_user_password(user_id=user_id, password=new_password, temporary=False)
            logger.info("Password updated successfully for user ID: %s", user_id)
            return JsonResponse({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)
        except Exception as err:
            logger.error("Unable to decrypt or update user password for user ID: %s, Error: %s", request.data.get("id", None), str(err))
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
                logger.warning("Account not found for email: %s", request.data.get("email", None))
                return Response({'errorMessage': 'Account not found'}, status=status.HTTP_404_NOT_FOUND)
            
            user = users[0]
            logger.info("User found for email: %s", user["email"])

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
            logger.info("Reset password link sent to email: %s", user["email"])

            return Response({'message': 'Reset password link has been sent to your email'}, status=status.HTTP_200_OK)
        except Exception as err:
            logger.error("Unable to reset the user password. Error: %s", str(err))
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
            logger.info("Reset password token verified for user ID: %s", decode["id"])
            return Response(decode, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            logger.warning("Reset password token expired")
            return Response({'errorMessage': 'Reset password token expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            logger.warning("Token provided is invalid")
            return Response({'errorMessage': 'Token provided is invalid'}, status=status.HTTP_401_UNAUTHORIZED)
