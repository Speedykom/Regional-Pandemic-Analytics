from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings
from .models import AccessToken
from .serializers import  AccessTokenListSerializer
from .keycloak_service import KeycloakService
from utils.minio import client  # <-- Always use this client!
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from utils.keycloak_auth import get_current_user_id
from rest_framework.permissions import AllowAny
from datetime import timedelta
from django.http import StreamingHttpResponse

def get_pipeline_minio_key(user_id, pipeline_name):
    return f"pipelines-created/{user_id}/{pipeline_name}.hpl"

class TokenManagementView(APIView):
    tags = ['shared-datasets']

    keycloak_scopes = {
        "POST": "pipeline:add",
        "GET": "pipeline:read",
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
            'description': openapi.Schema(
                type=openapi.TYPE_STRING,
                description="A description for this token"
            ),
        },
        required=['allowed_objects'],
        example={
            'allowed_objects': ['object1', 'object2'],
            'description': 'Token for project X data sharing'
        }
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
        list of MinIO objects it grants access to and a description.
        """
        allowed_objects = request.data.get('allowed_objects', [])
        description = request.data.get('description', '')
        password = settings.SERVICE_USER_PASSWORD
        user_id = get_current_user_id(request)
        service_username = f"repanshare_{user_id}"
        try:
            offline_token = self.keycloak.create_or_get_service_user(service_username, password)
            AccessToken.objects.create(
                token_id=offline_token,
                user_id=user_id,
                allowed_objects=allowed_objects,
                description=description
            )
            return Response({"token": offline_token})
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    @swagger_auto_schema(
        operation_summary="List active tokens",
        operation_description="Lists all active tokens for the current user (excluding the token value).",
        tags=["Shared Datasets"],
        responses={
            200: openapi.Response(
                description="List of active tokens",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'id': openapi.Schema(type=openapi.TYPE_STRING),
                            'description': openapi.Schema(type=openapi.TYPE_STRING),
                            'created': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
                            'expires': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
                            'is_revoked': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        }
                    )
                )
            ),
            401: openapi.Response(description="Invalid or revoked token")
        },
        security=[{"Bearer": []}],
    )
    def get(self, request):
        """List all active tokens for the current user (excluding the token value)."""
        user_id = get_current_user_id(request)
        tokens = AccessToken.objects.filter(user_id=user_id, is_revoked=False)
        # Exclude the 'token' field from the response
        serializer = AccessTokenListSerializer(tokens, many=True)
        return Response(serializer.data)

class TokenRevokeView(APIView):
    tags = ['shared-datasets']
    keycloak_scopes = {
        "DELETE": "pipeline:delete",
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
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.keycloak = KeycloakService(settings)

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
            self.keycloak.get_access_token_from_refresh(refresh_token)
        except Exception:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            token_obj = AccessToken.objects.get(token_id=refresh_token, is_revoked=False)
            # Just return the list of allowed object IDs
            return Response({'allowed_objects': token_obj.allowed_objects})
        except AccessToken.DoesNotExist:
            return Response({'error': 'Invalid or revoked token'}, status=status.HTTP_401_UNAUTHORIZED)
class DatasetDownloadView(APIView):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.keycloak = KeycloakService(settings)

    tags = ['shared-datasets']
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="Download a parquet file",
        operation_description="Downloads a parquet file from the user's MinIO folder.",
        tags=["Shared Datasets"],
        responses={
            200: openapi.Response(description="Parquet file"),
            401: openapi.Response(description="Invalid or revoked token"),
            404: openapi.Response(description="File not found"),
        },
        security=[{"Bearer": []}],
    )
    def get(self, request, file_name):
        """
        Download a parquet file for the user identified by the refresh token.
        """
        auth = request.headers.get("authorization")
        if not auth or not auth.startswith("Bearer "):
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        refresh_token = auth.split(" ")[1]
        # Step 1: Validate the refresh token with Keycloak

        try:
            self.keycloak.get_access_token_from_refresh(refresh_token)
        except Exception:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        # Step 2: Find the AccessToken in the database
        try:
            token_obj = AccessToken.objects.get(token_id=refresh_token, is_revoked=False)
        except AccessToken.DoesNotExist:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        # Step 3: Proceed with the treatment (download logic)
        user_id = token_obj.user_id
        bucket_name = "parquets"
        object_key = f"{user_id}/{file_name}.parquet"
        try:
            data = client.get_object(bucket_name, object_key)
            response = StreamingHttpResponse(data, content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{file_name}.parquet"'
            return response
        except Exception:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)



class ParquetListView(APIView):
    keycloak_scopes = {
        "GET": "pipeline:read",
    }
    @swagger_auto_schema(
        operation_summary="List all parquet files",
        operation_description="Lists all parquet files in the user's MinIO bucket (parquets/<user_id>/...).",
        tags=["Shared Datasets"],
        responses={
            200: openapi.Response(
                description="List of parquet files",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(type=openapi.TYPE_STRING)
                )
            ),
            401: "Invalid or revoked token"
        },
        security=[{"Bearer": []}],
    )
    def get(self, request):
        """List all parquet files in the user's MinIO bucket (parquets/<user_id>/...)."""
        try:
            user_id = get_current_user_id(request)
            bucket_name = "parquets"
            prefix = f"{user_id}/"
            objects = client.list_objects(bucket_name, prefix=prefix, recursive=True)
            parquet_files = [
                obj.object_name[len(prefix):-8]  # Remove prefix and '.parquet'
                for obj in objects
                if obj.object_name.endswith('.parquet') and obj.object_name.startswith(prefix)
            ]
            return Response(parquet_files)
        except AccessToken.DoesNotExist:
            return Response({'error': 'Invalid or revoked token'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
