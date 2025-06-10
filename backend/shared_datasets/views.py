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
        "POST": "shared_datasets:add",
        "GET": "shared_datasets:read",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.keycloak = KeycloakService(settings)

    def post(self, request):
        """
        Create a new offline token for dataset sharing.
        
        This endpoint creates a service user if needed and generates an offline token
        that doesn't expire. The token is stored in the database along with the
        list of MinIO objects it grants access to.
        """
        allowed_objects = request.data.get('allowed_objects', [])
        password = settings.SERVICE_USER_PASSWORD

        service_username = f"repanshare_{request.user.id}"
        try:
            # Create service user if needed and ensure client has offline access
            self.keycloak.create_or_get_service_user(service_username, password)
            
            # Get an offline token (refresh token) that doesn't expire
            offline_token = self.keycloak.get_service_token(service_username, password)
            
            # Store the token in the database
            AccessToken.objects.create(
                token_id=offline_token,
                user_id=request.user.id,
                allowed_objects=allowed_objects
            )
            return Response({"token": offline_token})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    def get(self, request):
        """List all active tokens for the current user."""
        tokens = AccessToken.objects.filter(user_id=request.user.id, is_revoked=False)
        serializer = AccessTokenSerializer(tokens, many=True)
        return Response(serializer.data)

class TokenRevokeView(APIView):
    keycloak_scopes = {
        "DELETE": "shared_datasets:revoke",
    }

    def delete(self, request, token_id):
        """Revoke a token by marking it as revoked in the database."""
        try:
            token = AccessToken.objects.get(token_id=token_id, user_id=request.user.id)
            token.is_revoked = True
            token.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except AccessToken.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class SharedDatasetView(APIView):
    keycloak_scopes = {
        "GET": "shared_datasets:read",
    }

    def get(self, request):
        """
        List all datasets accessible with the provided token.
        
        This endpoint expects the token to be provided in the Authorization header
        and returns a list of all MinIO objects the token grants access to.
        """
        token_id = request.auth  # The token string from the Authorization header
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
                except Exception as e:
                    # Log the error but continue with other objects
                    print(f"Error accessing object {obj_id}: {str(e)}")
                    continue
            return Response(accessible_objects)
        except AccessToken.DoesNotExist:
            return Response({'error': 'Invalid or revoked token'}, status=status.HTTP_401_UNAUTHORIZED)

class DatasetDownloadView(APIView):
    keycloak_scopes = {
        "GET": "shared_datasets:download",
    }

    def get(self, request, dataset_id):
        """
        Generate a presigned URL for downloading a specific dataset.
        
        This endpoint checks if the token grants access to the requested dataset
        and returns a presigned URL for downloading it if authorized.
        """
        token_id = request.auth  # The token string from the Authorization header
        try:
            token_obj = AccessToken.objects.get(token_id=token_id, is_revoked=False)
            if dataset_id not in token_obj.allowed_objects:
                return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
            # Generate a presigned URL for downloading the object
            url = client.presigned_get_object(
                settings.AWS_STORAGE_BUCKET_NAME,
                dataset_id,
                expires=3600  # URL valid for 1 hour
            )
            return Response({'download_url': url})
        except AccessToken.DoesNotExist:
            return Response({'error': 'Invalid or revoked token'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': f'Error generating download URL: {str(e)}'}, 
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)
