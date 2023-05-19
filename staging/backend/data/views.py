from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


class DataUploadAPI(APIView):
    """
        API for uploading data to minio
    """

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'file_name': openapi.Schema(type=openapi.TYPE_STRING),
            'file_type': openapi.Schema(type=openapi.TYPE_STRING),
            'file': openapi.Schema(type=openapi.TYPE_FILE)
        }
    ))
    def post(self, request):
        file_name = request.data.get('file_name')
        file_type = request.data.get('file_type')
        file = request.data.get('file')

        if not file_name or not file_type or not file:
            return Response({'error': 'Missing required data'}, status=400)

        # Perform file type check
        if not file.name.endswith(file_type):
            return Response({'error': 'File type does not match'}, status=400)

        # Process the file (save to minio)
        file_path = '/path/to/save/files/' + file_name
        with open(file_path, 'wb') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        return Response({'success': 'File uploaded successfully'})
