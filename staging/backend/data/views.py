import io
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import MultiPartParser, FormParser
from data.serializers import FileUploadSerializer
from data.models import FileUpload
from rest_framework.permissions import AllowAny
from django.core.files.base import ContentFile


class DataUploadAPI(APIView):
    permission_classes = [AllowAny, ]
    parser = [MultiPartParser]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'file_name': openapi.Schema(type=openapi.TYPE_STRING),
            'file_type': openapi.Schema(type=openapi.TYPE_STRING),
            'file': openapi.Schema(type=openapi.TYPE_FILE)
        }
    ))
    def get(self, request, *args, **kwargs):
        username = request.query_params.get("username")
        print(username)
        data = FileUpload.objects.filter(username=username).order_by("-date_added")

        serializer = FileUploadSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist('files')
        username = request.data.get('username', None)
        file_name = request.data.get('file_name', None)

        if username is None:
            return Response({"message": "Username not found"}, status=status.HTTP_400_BAD_REQUEST)

        for file in files:
            file_upload = FileUpload(
                username=request.data.get('username'),
                file_name=file_name,
                file_type=file.content_type,
                file=file
            )
            file_upload.save()

        return Response({'message': 'File uploaded successfully'}, status=status.HTTP_201_CREATED)

# class DataUploadAPI(APIView):
#     """
#         API for uploading data to minio
#     """
#     parser = [MultiPartParser]
#
#     @swagger_auto_schema(request_body=openapi.Schema(
#         type=openapi.TYPE_OBJECT,
#         properties={
#             'file_name': openapi.Schema(type=openapi.TYPE_STRING),
#             'file_type': openapi.Schema(type=openapi.TYPE_STRING),
#             'file': openapi.Schema(type=openapi.TYPE_FILE)
#         }
#     ))
#     def post(self, request):
#         file_name = request.data.get('file_name')
#         file_type = request.data.get('file_type')
#         file = request.FILES.get('file')
#
#         print(file.name)
#
#         if not file_name or not file_type or not file:
#             return Response({'error': 'Missing required data'}, status=400)
#
#         # Perform file type check
#         if not file.name.endswith(file_type):
#             return Response({'error': 'File type does not match'}, status=400)
#
#         # Process the file (save to minio)
#
#         upload_file = upload_file_to_minio('repan-bucket', file)
#
#         print(upload_file)
#
#         if upload_file:
#             return Response({"message", "File uploaded successfully"}, status=status.HTTP_201_CREATED)
#
#         return Response({'message': 'Failed to upload file to the server'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
