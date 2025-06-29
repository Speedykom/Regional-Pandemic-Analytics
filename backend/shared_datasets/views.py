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

class TokenListView(APIView):
    """
    View for listing access tokens for the current user.
    GET: List all active tokens for the current user
    """
    tags = ['shared-datasets']
    keycloak_scopes = {
        "GET": "pipeline:read",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.keycloak = KeycloakService(settings)

    @swagger_auto_schema(
        operation_summary="List tokens",
        operation_description="Lists all active tokens for the current user",
        tags=["Shared Datasets"],
        responses={
            200: openapi.Response(
                description="List of active tokens",),
            401: "Unauthorized"
        },
        security=[{"Bearer": []}],
    )
    def get(self, request):
        """List all active tokens for the current user."""
        user_id = get_current_user_id(request)
        tokens = AccessToken.objects.filter(user_id=user_id, is_revoked=False).order_by('-created_at')
        serializer = AccessTokenListSerializer(tokens, many=True)
        return Response(serializer.data)


class TokenCreateView(APIView):
    """
    View for creating access tokens.
    POST: Create a new access token
    """
    tags = ['shared-datasets']
    keycloak_scopes = {
        "POST": "pipeline:add",
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
            400: "Bad request - invalid input or missing required fields",
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

        # --- Dataset existence verification ---
        bucket_name = "parquets"
        missing_datasets = []
        for dataset in allowed_objects:
            object_key = f"{user_id}/{dataset}.parquet"
            try:
                client.stat_object(bucket_name, object_key)
            except Exception:
                missing_datasets.append(dataset)
        if missing_datasets:
            return Response(
                {'error': f'The following datasets do not exist: {missing_datasets}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        # --- End verification ---

        # --- Check for existing valid token for this exact resource set ---
        sorted_allowed_objects = sorted(allowed_objects)
        existing_token = AccessToken.objects.filter(
            user_id=user_id,
            is_revoked=False,
            allowed_objects=sorted_allowed_objects
        ).first()
        if existing_token:
            return Response({"token": existing_token.token_id})
        # --- End check ---

        try:
            offline_token = self.keycloak.create_or_get_service_user(service_username, password)
            AccessToken.objects.create(
                token_id=offline_token,
                user_id=user_id,
                allowed_objects=sorted_allowed_objects,
                description=description
            )
            return Response({"token": offline_token})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TokenDetailView(APIView):
    """
    View for retrieving and managing a specific token.
    GET: Get token details
    DELETE: Revoke a token
    """
    tags = ['shared-datasets']
    keycloak_scopes = {
        "GET": "pipeline:read",
        "DELETE": "pipeline:delete",
    }

    @swagger_auto_schema(
        operation_summary="Get token details",
        operation_description="Retrieves details for a specific token.",
        tags=["Shared Datasets"],
        manual_parameters=[
            openapi.Parameter(
                'token_id',
                openapi.IN_PATH,
                description="ID of the token to retrieve",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ],
       
        security=[{"Bearer": []}],
    )
    def get(self, request, token_id):
        """Retrieve details for a specific token."""
        try:
            user_id = get_current_user_id(request)
            token = AccessToken.objects.get(token_id=token_id, user_id=user_id)
            serializer = AccessTokenListSerializer(token)
            return Response(serializer.data)
        except AccessToken.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

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
            403: "Forbidden - Token does not belong to user",
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
    """
    View for downloading a specific dataset.
    GET: Download a dataset file
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.keycloak = KeycloakService(settings)

    tags = ['datasets']
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="Download a dataset file",
        operation_description="""
        Downloads a dataset file in parquet format.
        
        The user must provide a valid token in the Authorization header.
        The token must have the requested file in its allowed_objects list.
        """,
        tags=["Datasets"],
        manual_parameters=[
            openapi.Parameter(
                'file_name',
                openapi.IN_PATH,
                description="Name of the file to download (without .parquet extension)",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ],
        responses={
            200: openapi.Response(
                description="Dataset file",
                content={
                    'application/octet-stream': {
                        'schema': {
                            'type': 'string',
                            'format': 'binary'
                        }
                    }
                }
            ),
            401: openapi.Response(
                description="Unauthorized",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            ),
            403: openapi.Response(
                description="Forbidden - Token is invalid or doesn't have permission",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            ),
            404: openapi.Response(
                description="File not found",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            )
        },
        security=[{"Bearer": []}],
    )
    def get(self, request, file_name):
        """
        Download a dataset file for the user identified by the provided token.
        
        The token must be provided in the Authorization header as a Bearer token.
        The token must have the requested file in its allowed_objects list.
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
        # Step 3: Check if the requested file is in the allowed_objects list
        if file_name not in token_obj.allowed_objects:
            return Response(
                {'error': 'You do not have permission to access this file'}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Step 4: Proceed with the download
        user_id = token_obj.user_id
        bucket_name = "parquets"
        object_key = f"{user_id}/{file_name}.parquet"
        try:
            data = client.get_object(bucket_name, object_key)
            response = StreamingHttpResponse(data, content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{file_name}.parquet"'
            response['Cache-Control'] = 'private, max-age=3600'  # Cache for 1 hour
            return response
        except Exception as e:
            if 'NoSuchKey' in str(e):
                return Response(
                    {'error': f'File {file_name}.parquet not found in your storage'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            return Response(
                {'error': 'An error occurred while processing your request'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DatasetListView(APIView):
    """
    View for listing available datasets for the current user.
    GET: List all datasets in the user's MinIO bucket
    """
    keycloak_scopes = {
        "GET": "pipeline:read",
    }
    
    @swagger_auto_schema(
        operation_summary="List available datasets",
        operation_description="""
        Lists all dataset files available to the current user.
        
        Returns a list of dataset names (without the .parquet extension)
        that the authenticated user has access to in their MinIO bucket.
        """,
        tags=["Datasets"],
        responses={
            200: openapi.Response(
                description="List of available dataset names",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_STRING,
                        description="Name of the dataset (without .parquet extension)"
                    ),
                    example=["dataset1", "dataset2", "dataset3"]
                )
            ),
            401: openapi.Response(
                description="Unauthorized",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description="Error message"
                        )
                    },
                    example={"error": "Authentication credentials were not provided."}
                )
            ),
            500: openapi.Response(
                description="Internal Server Error",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description="Error message"
                        )
                    }
                )
            )
        },
        security=[{"Bearer": []}],
    )
    def get(self, request):
        """
        List all dataset files available to the current user.
        
        Retrieves a list of all .parquet files in the user's MinIO bucket
        and returns their names without the .parquet extension.
        """
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
