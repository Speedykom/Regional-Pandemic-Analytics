import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..gdags.hop import EditAccessProcess
from utils.minio import client
from minio.commonconfig import CopySource, REPLACE
from datetime import datetime
from utils.keycloak_auth import get_current_user_id


import logging

logger = logging.getLogger("django")

class PipelineListView(APIView):
    keycloak_scopes = {
        'POST': 'pipeline:add',
        'GET': 'pipeline:read',
    }

    def get(self, request):
        """ Return a user created pipelines """
        user_id = get_current_user_id(request)

        pipelines: list[str] = []

        objects = client.list_objects(
            "pipelines", prefix=f"pipelines-created/{user_id}/", include_user_meta=True)
        for object in objects:
            pipelines.append(
                {
                    "name": object.object_name.removeprefix(f"pipelines-created/{user_id}/").removesuffix(".hpl"),
                    "description": object.metadata["X-Amz-Meta-Description"]
                }
            )

        return Response({"status": "success", "data": pipelines}, status=status.HTTP_200_OK)

    def post(self, request):
        """ Create a pipeline from a chosen template for a specific user  """
        user_id = get_current_user_id(request)

        name = request.data['name']
        template = request.data['template']
        description = request.data['description']

        try:
            # Checks if an object with the same name exits
            client_response = client.get_object(
                "pipelines", f"pipelines-created/{user_id}/{name}")
            client_response.close()
            client_response.release_conn()

            logger.error("file already exists with the name {}".format(name))
            
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
        'PUT': 'pipeline:update',
        'GET': 'pipeline:read',
    }

    # dynamic dag output
    file = "../hop/data-orch.list"

    def get(self, request, name=None):
        user_id = get_current_user_id(request)
        try:
            object = client.stat_object(
                "pipelines", f"pipelines-created/{user_id}/{name}.hpl")

            # Download file from Minio to be available for HopUI
            client.fget_object(
                "pipelines", f"pipelines-created/{user_id}/{name}.hpl", f"/hop/pipelines/{name}.hpl")

            # Automatically open file in visual editor when HopUI opens
            payload = {"names": ['file:///files/{}.hpl'.format(name)]}
            edit_hop = EditAccessProcess(file=self.file)
            edit_hop.request_edit(json.dumps(payload))

            return Response({
                "name": name,
                "description": object.metadata["X-Amz-Meta-Description"]
            }, status=status.HTTP_200_OK)
        except:
            logger.error("Something went wrong while attempting to fetch pipeline {}".format(name))
            return Response({'status': "error", "message": "Something went wrong while attempting to fetch pipeline {}".format(name)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, name=None):
        user_id = get_current_user_id(request)
        try:
            object = client.stat_object(
                "pipelines", f"pipelines-created/{user_id}/{name}.hpl")
            # Update pipeline file in Minio
            client.fput_object(
                "pipelines", f"pipelines-created/{user_id}/{name}.hpl", f"/hop/pipelines/{name}.hpl",
                metadata={
                    "description": object.metadata["X-Amz-Meta-Description"],
                    "updated": f"{datetime.utcnow()}",
                    "created": object.metadata["X-Amz-Meta-Created"],
                })

            # Remove pipeline file from Minio volume
            os.remove(f"/hop/pipelines/{name}.hpl")

            return Response({
                "status": "success"
            }, status=status.HTTP_200_OK)
        except:
            return Response({'status': "error", "message": "Unable to update the pipeline {}".format(name)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
