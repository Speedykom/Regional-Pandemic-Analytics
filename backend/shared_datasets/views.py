from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings
from .models import AccessToken
from .serializers import AccessTokenSerializer
from .keycloak_service import KeycloakService
from utils.minio import client  # <-- Always use this client!
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from utils.keycloak_auth import get_current_user_id
from rest_framework.permissions import AllowAny
from datetime import timedelta

def get_pipeline_minio_key(user_id, pipeline_name):
    return f"pipelines-created/{user_id}/{pipeline_name}.hpl"

class TokenManagementView(APIView):
    
    keycloak_scopes = {
        "POST": "shared_datasets:add",
        "GET": "shared_datasets:read",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.keycloak = KeycloakService(settings)

    @swagger_auto_schema(
    operation_summary="Create a new token",
    operation_description="Creates a new offline token for dataset sharing.",
    tags=["Shared Datasets"],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'allowed_objects': openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(type=openapi.TYPE_STRING),
                description="List of MinIO object IDs this token will grant access to"
            ),
        },
        required=['allowed_objects'],
    ),
    responses={
        200: openapi.Response(
            description="Token created successfully",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'token': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        ),
        500: "Server error"
    },
    security=[{"Bearer": []}],
)
    def post(self, request):
        """
        Create a new offline token for dataset sharing.
        
        This endpoint creates a service user if needed and generates an offline token
        that doesn't expire. The token is stored in the database along with the
        list of MinIO objects it grants access to.
        """
        allowed_objects = request.data.get('allowed_objects', [])
        password = settings.SERVICE_USER_PASSWORD
        user_id = get_current_user_id(request)
        service_username = f"repanshare_{user_id}"
        try:
            offline_token = self.keycloak.create_or_get_service_user(service_username, password)
            # Store pipeline names in allowed_objects
            AccessToken.objects.create(
                token_id=offline_token,
                user_id=user_id,
                allowed_objects=allowed_objects
            )
            return Response({"token": offline_token})
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    @swagger_auto_schema(
    operation_summary="List accessible datasets",
    operation_description="Lists all datasets accessible with the provided token.",
    tags=["Shared Datasets"],
    responses={
        200: openapi.Response(
            description="List of accessible datasets",
            schema=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'id': openapi.Schema(type=openapi.TYPE_STRING),
                        'size': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'last_modified': openapi.Schema(type=openapi.TYPE_STRING, format='date-time')
                    }
                )
            )
        ),
        401: "Invalid or revoked token"
    },
    security=[{"Bearer": []}],
)
    def get(self, request):
        """List all active tokens for the current user."""
        user_id = get_current_user_id(request)
        tokens = AccessToken.objects.filter(user_id=user_id, is_revoked=False)
        serializer = AccessTokenSerializer(tokens, many=True)
        return Response(serializer.data)

class TokenRevokeView(APIView):
    tags = ['shared-datasets']
    keycloak_scopes = {
        "DELETE": "shared_datasets:revoke",
    }

    @swagger_auto_schema(
    operation_summary="Revoke a token",
    operation_description="Revokes a token by marking it as revoked in the database.",
    tags=["Shared Datasets"],
    manual_parameters=[
        openapi.Parameter(
            'token_id',
            openapi.IN_PATH,
            description="ID of the token to revoke",
            type=openapi.TYPE_STRING,
            required=True,
        )
    ],
    responses={
        204: "Token successfully revoked",
        404: "Token not found"
    },
    security=[{"Bearer": []}],
)
    def delete(self, request, token_id):
        """Revoke a token by marking it as revoked in the database."""
        try:
            user_id = get_current_user_id(request)
            token = AccessToken.objects.get(token_id=token_id, user_id=user_id)
            token.is_revoked = True
            token.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except AccessToken.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

  
    
class SharedDatasetView(APIView):
    permission_classes = [AllowAny]
    tags = ['shared-datasets']
    @swagger_auto_schema(
    operation_summary="List accessible datasets",
    operation_description="Lists all datasets accessible with the provided token.",
    tags=["Shared Datasets"],
    responses={
        200: openapi.Response(
            description="List of accessible datasets",
            schema=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'id': openapi.Schema(type=openapi.TYPE_STRING),
                        'size': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'last_modified': openapi.Schema(type=openapi.TYPE_STRING, format='date-time')
                    }
                )
            )
        ),
        401: "Invalid or revoked token"
    },
    security=[{"Bearer": []}],
    )
    def get(self, request):
        """
        List all datasets accessible with the provided refresh token.
        Always treat the Authorization header as a refresh token.
        Only returns the allowed_objects from the AccessToken DB.
        """
        auth = request.headers.get("authorization")
        if not auth or not auth.startswith("Bearer "):
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        refresh_token = auth.split(" ")[1]
        try:
            token_obj = AccessToken.objects.get(token_id=refresh_token, is_revoked=False)
            # Just return the list of allowed object IDs
            return Response({'allowed_objects': token_obj.allowed_objects})
        except AccessToken.DoesNotExist:
            return Response({'error': 'Invalid or revoked token'}, status=status.HTTP_401_UNAUTHORIZED)
class DatasetDownloadView(APIView):
    tags = ['shared-datasets']

    permission_classes = [AllowAny]

    @swagger_auto_schema(
    operation_summary="Download a dataset",
    operation_description="Generates a presigned URL for downloading a specific dataset.",
    tags=["Shared Datasets"],
    manual_parameters=[
        openapi.Parameter(
            'dataset_id',
            openapi.IN_PATH,
            description="ID of the dataset to download",
            type=openapi.TYPE_STRING,
            required=True,
        )
    ],
    responses={
        200: openapi.Response(
            description="Presigned download URL",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'download_url': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        format='uri'
                    )
                }
            )
        ),
        401: "Invalid or revoked token",
        403: "Access denied - token doesn't grant access to this dataset",
        500: "Server error generating download URL"
    },
    security=[{"Bearer": []}],
)

    def get(self, request, dataset_id):
        """
        Generate a presigned URL for downloading a specific dataset.
        Always treat the Authorization header as a refresh token.
        Only allows download if the token is valid and grants access to the dataset.
        """
        auth = request.headers.get("authorization")
        if not auth or not auth.startswith("Bearer "):
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        refresh_token = auth.split(" ")[1]
        # Exchange refresh token for access token (Keycloak validation)
        try:
            KeycloakService(settings).get_access_token_from_refresh(refresh_token)
        except Exception:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            token_obj = AccessToken.objects.get(token_id=refresh_token, is_revoked=False)
            if dataset_id not in token_obj.allowed_objects:
                return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
            user_id = token_obj.user_id
            minio_key = get_pipeline_minio_key(user_id, dataset_id)
            
        
            # Generate presigned URL for the MinIO object
            url = client.presigned_get_object(
                settings.PIPELINES_BUCKET_NAME,
                minio_key,
                expires=timedelta(seconds=3600)
            )
            return Response({'download_url': url})
        except AccessToken.DoesNotExist:
            return Response({'error': 'Invalid or revoked token'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response(
                {'error': f'Error generating download URL: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
