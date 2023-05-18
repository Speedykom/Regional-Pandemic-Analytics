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
    permission_classes = [AllowAny, ]

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
