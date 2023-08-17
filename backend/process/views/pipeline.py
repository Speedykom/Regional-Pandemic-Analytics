import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Pipeline
from ..serializers import PipelineSerializer
from ..gdags.hop import EditAccessProcess
from utils.minio import client
from minio.commonconfig import COPY, CopySource, REPLACE
from datetime import datetime


class PipelineListView(APIView):
    keycloak_scopes = {
        'POST': 'pipeline:add',
        'GET': 'pipeline:read',
    }

    def get(self, request):
        """ Return a user created pipelines """
        
        cur_user = request.userinfo
        user_id = cur_user['sub']

        pipelines:list[str]=[]
    
        objects=client.list_objects("pipelines",prefix=f"pipelines-created/{user_id}/",include_user_meta=True)
        for object in objects:
            pipelines.append(
                {
                    "name": object.object_name.removeprefix(f"pipelines-created/{user_id}/"),
                    "description": object.metadata["X-Amz-Meta-Description"]
                    }
                )  
        
        return Response({"status": "success", "data": pipelines}, status=status.HTTP_200_OK)

    def post(self, request):
        """ Create a pipeline from a chosen template for a specific user  """
        
        cur_user = request.userinfo
        user_id = cur_user['sub']
        
        name = request.data['name']
        template = request.data['template']
        description = request.data['description']
        
        try:
            # Checks if an object with the same name exits 
            client_response = client.get_object("pipelines", f"pipelines-created/{user_id}/{name}")
            client_response.close()
            client_response.release_conn()
            return Response({"status": "Fail", "message": f"file already exists with the name {name}"}, status=409)
        except:            
            # Create new pipeline by: 
            #   1. copying the template,
            #   2. renaming it to another index in the same bukcket
            #   3. adding metadata: description + date of creation
            client_result = client.copy_object(
                "pipelines",
                f"pipelines-created/{user_id}/{name}.hpl",
                CopySource("pipelines", f"templates/{template}"),
                metadata={
                "description": f"{description}",
                "created": f"{datetime.utcnow()}",
                },
                metadata_directive=REPLACE,
            )

            return Response({"status": "success"}, status=status.HTTP_200_OK)


class PipelineDetailView(APIView):
    keycloak_scopes = {
        'GET': 'pipeline:read',
    }

    # dynamic dag output
    file = "../hop/data-orch.list"

    def get(self, request, id=None):
        pipeline = Pipeline.objects.get(id=id)

        if not pipeline:
            return Response({'status': "error", "message": "No pipeline found for this id {}".format(id)}, status=status.HTTP_404_NOT_FOUND)

        file_path = 'file:///files/{}'.format(pipeline.path)
        payload = {"names": [file_path]}

        edit_hop = EditAccessProcess(file=self.file)
        edit_hop.request_edit(json.dumps(payload))

        pipeline = PipelineSerializer(pipeline, many=False)

        return Response(pipeline.data, status=status.HTTP_200_OK)
