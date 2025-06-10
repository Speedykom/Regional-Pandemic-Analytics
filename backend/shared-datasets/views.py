from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings
from .models import AccessToken
from .serializers import AccessTokenSerializer
from .keycloak_service import KeycloakService
from utils.minio import client  # <-- Always use this client!

class TokenManagementView(APIView):
    keycloak_scopes = {
        "POST": "shared-datasets:add",
        "GET": "shared-datasets:read",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.keycloak = KeycloakService(settings)

    def post(self, request):
        allowed_objects = request.data.get('allowed_objects', [])
        password = settings.SERVICE_USER_PASSWORD

        service_username = f"repanshare_{request.user.id}"
        try:
            self.keycloak.create_or_get_service_user(service_username, password)
            service_token = self.keycloak.get_service_token(service_username, password)
            AccessToken.objects.create(
                token_id=service_token,
                user_id=request.user.id,
                allowed_objects=allowed_objects
            )
            return Response({"token": service_token})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    def get(self, request):
        tokens = AccessToken.objects.filter(user_id=request.user.id, is_revoked=False)
        serializer = AccessTokenSerializer(tokens, many=True)
        return Response(serializer.data)

class TokenRevokeView(APIView):
    keycloak_scopes = {
        "DELETE": "shared-datasets:revoke",
    }

    def delete(self, request, token_id):
        try:
            token = AccessToken.objects.get(token_id=token_id, user_id=request.user.id)
            token.is_revoked = True
            token.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except AccessToken.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class SharedDatasetView(APIView):
    keycloak_scopes = {
        "GET": "shared-datasets:read",
    }

    def get(self, request):
        token_id = request.auth  # The Keycloak JWT string
        try:
            token_obj = AccessToken.objects.get(token_id=token_id, is_revoked=False)
            accessible_objects = []
            for obj_id in token_obj.allowed_objects:
                try:
                    obj = client.stat_object(
                        settings.AWS_STORAGE_BUCKET_NAME, obj_id
                    )
                    accessible_objects.append({
                        'id': obj_id,
                        'size': obj.size,
                        'last_modified': obj.last_modified
                    })
                except Exception:
                    continue
            return Response(accessible_objects)
        except AccessToken.DoesNotExist:
            return Response({'error': 'Invalid or revoked token'}, status=status.HTTP_401_UNAUTHORIZED)

class DatasetDownloadView(APIView):
    keycloak_scopes = {
        "GET": "shared-datasets:download",
    }

    def get(self, request, dataset_id):
        token_id = request.auth  # The Keycloak JWT string
        try:
            token_obj = AccessToken.objects.get(token_id=token_id, is_revoked=False)
            if dataset_id not in token_obj.allowed_objects:
                return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            url = client.presigned_get_object(
                settings.AWS_STORAGE_BUCKET_NAME,
                dataset_id,
                expires=3600  # URL valid for 1 hour
            )
            return Response({'download_url': url})
        except AccessToken.DoesNotExist:
            return Response({'error': 'Invalid or revoked token'}, status=status.HTTP_401_UNAUTHORIZED)
