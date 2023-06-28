from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import MultiPartParser, FormParser
from data.serializers import FileUploadSerializer, FileListSerializer
from data.models import FileUpload
from rest_framework.permissions import AllowAny


class DataUploadAPI(APIView):
    permission_classes = [AllowAny, ]
    parser = [MultiPartParser]

    def get(self, request, *args, **kwargs):
        username = request.query_params.get("username")

        data = FileUpload.objects.filter(username=username).order_by("-date_added")
        serializer = FileUploadSerializer(data, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        username = request.data.get('username', None)

        if username is None:
            return Response({"message": "Username not found"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = FileListSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return Response({'message': 'File uploaded successfully'}, status=status.HTTP_201_CREATED)
