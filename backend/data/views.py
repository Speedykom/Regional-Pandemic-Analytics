from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import MultiPartParser
from data.serializers import FileUploadSerializer, FileListSerializer
from data.models import FileUpload
import logging

class DataUploadAPIView(APIView):
    keycloak_scopes = {
        'GET': 'data:read',
        'POST': 'data:add',
    }
    parser = [MultiPartParser]
    # Set up logging
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    handler = logging.FileHandler('/var/log/backend/backend.log')
    handler.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s:%(levelname)s:%(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'file_name': openapi.Schema(type=openapi.TYPE_STRING),
            'file_type': openapi.Schema(type=openapi.TYPE_STRING),
            'file': openapi.Schema(type=openapi.TYPE_FILE)
        }
    ))
    def get(self, request, *args, **kwargs):
        """Retrieves and returns file uploads associated with a specific username"""
        username = request.query_params.get("username")

        try:
            data = FileUpload.objects.filter(username=username).order_by("-date_added")
            serializer = FileUploadSerializer(data, many=True)
            self.logger.info("Retrieved file uploads for username: %s", username)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as err:
            self.logger.error("Error retrieving file uploads for username: %s, Error: %s", username, str(err))
            return Response({"message": "Error retrieving file uploads"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request, *args, **kwargs):
        """Upload a file for a user"""
        username = request.data.get('username', None)

        if username is None:
            self.logger.warning("Username not found in the request data")
            return Response({"message": "Username not found"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            serializer = FileListSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                self.logger.info("File uploaded successfully for username: %s", username)
                return Response({'message': 'File uploaded successfully'}, status=status.HTTP_201_CREATED)
        except Exception as err:
            self.logger.error("Error uploading file for username: %s, Error: %s", username, str(err))
            return Response({'message': 'Error uploading file'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
