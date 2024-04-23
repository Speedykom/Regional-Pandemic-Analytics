import os
import json
import re
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from utils.minio import client
from minio.commonconfig import CopySource, REPLACE
from datetime import datetime
from utils.keycloak_auth import get_current_user_id
from rest_framework.parsers import MultiPartParser
from urllib.parse import quote, unquote


class EditAccessProcess:
    def __init__(self, file):
        self.file = file

    def request_edit(self, path):
        config = open(self.file, "w")
        config.write(path)
        config.close()


class PipelineListView(APIView):
    keycloak_scopes = {
        "POST": "pipeline:add",
        "GET": "pipeline:read",
    }

    def get(self, request , query = None):
        """Return a user created pipelines"""
        user_id = get_current_user_id(request)

        pipelines: list[str] = []

        objects = client.list_objects(
            "pipelines", prefix=f"pipelines-created/{user_id}/", include_user_meta=True
        )
        for object in objects:
            object_name = object.object_name.removeprefix(
                        f"pipelines-created/{user_id}/"
                    ).removesuffix(".hpl")
            description = object.metadata["X-Amz-Meta-Description"]
            description = unquote(description)
            if query:
                if (re.search(query, object_name, re.IGNORECASE)):
                    pipelines.append(
                        {
                            "name": object_name,
                            "description": description,
                        })
            else:
                pipelines.append(
                {
                    "name": object_name,
                    "description": object.metadata["X-Amz-Meta-Description"],
                }
            )

        return Response(
            {"status": "success", "data": pipelines}, status=status.HTTP_200_OK
        )

    def post(self, request):
        """Create a pipeline from a chosen template for a specific user"""
        user_id = get_current_user_id(request)
        name = request.data.get("name")
        description = request.data.get("description")
        description = quote(description.encode('utf-8'))
        template = request.data.get("template")
        try:
            # Checks if an object with the same name exits
            client_response = client.get_object(
                "pipelines", f"pipelines-created/{user_id}/{name}"
            )
            client_response.close()
            client_response.release_conn()
            return Response(
                {
                    "status": "Fail",
                    "message": f"file already exists with the name {name}",
                },
                status=409,
            )
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
        "PUT": "pipeline:update",
        "GET": "pipeline:read",
    }

    # dynamic dag output
    file = "../hop/data-orch.list"

    def get(self, request, name=None):
        user_id = get_current_user_id(request)
        try:
            object = client.stat_object(
                "pipelines", f"pipelines-created/{user_id}/{name}.hpl"
            )

            # Download file from Minio to be available for HopUI
            client.fget_object(
                "pipelines",
                f"pipelines-created/{user_id}/{name}.hpl",
                f"/hop/pipelines/{name}.hpl",
            )

            # Automatically open file in visual editor when HopUI opens
            payload = {"names": ["file:///files/{}.hpl".format(name)]}
            edit_hop = EditAccessProcess(file=self.file)
            edit_hop.request_edit(json.dumps(payload))
            return Response(
                {
                    "name": name,
                    "description": unquote(object.metadata["X-Amz-Meta-Description"]),
                },
                status=status.HTTP_200_OK,
            )
        except:
            return Response(
                {
                    "status": "error",
                    "message": "Something went wrong while attempting to fetch pipeline {}".format(
                        name
                    ),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def put(self, request, name=None):
        user_id = get_current_user_id(request)
        try:
            object = client.stat_object(
                "pipelines", f"pipelines-created/{user_id}/{name}.hpl"
            )
            # Update pipeline file in Minio
            client.fput_object(
                "pipelines",
                f"pipelines-created/{user_id}/{name}.hpl",
                f"/hop/pipelines/{name}.hpl",
                metadata={
                    "description": unquote(object.metadata["X-Amz-Meta-Description"]),
                    "updated": f"{datetime.utcnow()}",
                    "created": object.metadata["X-Amz-Meta-Created"],
                },
            )

            # Remove pipeline file from Minio volume
            os.remove(f"/hop/pipelines/{name}.hpl")

            return Response({"status": "success"}, status=status.HTTP_200_OK)
        except:
            return Response(
                {
                    "status": "error",
                    "message": "Unable to update the pipeline {}".format(name),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class PipelineDownloadView(APIView):
    keycloak_scopes = {
        "GET": "pipeline:read",
    }

    def get(self, request, name=None):
        """Download a specific pipeline."""
        user_id = get_current_user_id(request)
        try:
            # Check if the pipeline exists
            client_response = client.get_object("pipelines", f"pipelines-created/{user_id}/{name}.hpl")

            # Set response headers for file download
            response = Response(content_type='text/xml')
            response["Content-Disposition"] = f'attachment; filename="{name}.hpl'
            response.data = client_response.data
            return response
        except Exception as e:
            return Response(
                {"status": "Fail", "message": f"Failed to download pipeline {name}: {str(e)}"},
                status=status.HTTP_404_NOT_FOUND,
            )
        finally:
            client_response.close()
            client_response.release_conn()

class PipelineUploadView(APIView):
    parser_classes = (MultiPartParser,)
    keycloak_scopes = {
        "POST": "pipeline:add",
        "GET": "pipeline:read",
    }

    def post(self, request, format=None):
        user_id = get_current_user_id(request)
        name = request.data.get("name")
        description = request.data.get("description")
        description = quote(description.encode('utf-8'))
        uploaded_file = request.FILES.get("uploadedFile")
        if (uploaded_file) :
            try:
                # Checks if an object with the same name exits
                client_response = client.get_object(
                    "pipelines", f"pipelines-created/{user_id}/{name}.hpl"
                )
                client_response.close()
                client_response.release_conn()
                return Response(
                    {
                        "status": "Fail",
                        "message": f"file already exists with the name {name}.hpl",
                    },
                    status=409,
                )
            except:
                # upload new pipeline
                client_result = client.put_object(
                bucket_name='pipelines',
                object_name=f"pipelines-created/{user_id}/{name}.hpl",
                data=uploaded_file,
                length=uploaded_file.size,
                metadata={
                    "description": f"{description}",
                    "created": f"{datetime.utcnow()}",
                },
                )

            return Response({"status": "success"}, status=status.HTTP_200_OK)

