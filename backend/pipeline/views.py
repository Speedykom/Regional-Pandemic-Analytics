import os
import json
import re
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from utils.minio import client
from minio.commonconfig import CopySource, REPLACE, Tags
from datetime import datetime
from utils.keycloak_auth import get_current_user_id
from rest_framework.parsers import MultiPartParser
from .validator import check_pipeline_validity
from urllib.parse import quote, unquote
from minio import Minio
import pyclamd
import time
import logging
from datetime import datetime, timedelta


class AirflowInstance:
    url = os.getenv("AIRFLOW_API")
    username = os.getenv("AIRFLOW_USER")
    password = os.getenv("AIRFLOW_PASSWORD")

class EditAccessProcess:
    def __init__(self, file):
        self.file = file
        self.max_retries = 5
        self.retry_interval = 1


    def request_edit(self, path):
        payload = json.dumps(path)
        for attempt in range(self.max_retries):
            try:
                with open(self.file, "w") as config:
                    config.write(payload)
                logging.info(f"File {self.file} successfully written.")
                break

            except (OSError, IOError) as e:
                logging.error(f"Error writing to file {self.file}: {str(e)}")

                if attempt < self.max_retries - 1:
                    logging.info(f"Retrying to write to {self.file} in {self.retry_interval} seconds...")
                    time.sleep(self.retry_interval)
                else:
                    logging.error(f"Failed to write to {self.file} after {self.max_retries} attempts.")
                    raise Exception(f"Failed to edit file {self.file} after {self.max_retries} attempts.")

class PipelineListView(APIView):
    keycloak_scopes = {
        "POST": "pipeline:add",
        "GET": "pipeline:read",
    }

    def __init__(self):
        self.permitted_characters_regex = re.compile(r'^[^\s!@#$%^&*()+=[\]{}\\|;:\'",<>/?]*$')

    def get(self, request , query = None):
        """Endpoint for getting pipelines created by a user"""
        user_id = get_current_user_id(request)
        pipelines: list[str] = []

        objects = client.list_objects(
            "pipelines", prefix=f"pipelines-created/{user_id}/", include_user_meta=True
        )
        for object in objects:
            if object.object_name.endswith(".hpl"):
                object_name = object.object_name.removeprefix(
                            f"pipelines-created/{user_id}/"
                        ).removesuffix(".hpl")
                tags = client.get_object_tags(bucket_name="pipelines", object_name=object.object_name)
                if tags is None :
                    tags = {}
                if query:
                    if (re.search(query, object_name, re.IGNORECASE)):
                        pipelines.append(
                            {
                                "name": object_name,
                                "description": tags.get("description", ""),
                                "check_status": tags.get("check_status", ""),
                                "check_text": tags.get("check_text", ""),    
                            })
                else:
                    pipelines.append(
                    {
                        "name": object_name,
                        "description": tags.get("description", ""),
                        "check_status": tags.get("check_status", ""),
                        "check_text": tags.get("check_text", ""),
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
        template = request.data.get("template")
        if not self.permitted_characters_regex.search(name):
            return Response(
                {"status": "Fail", "message": "Pipeline name contains unpermitted characters"},
                status=status.HTTP_400_BAD_REQUEST
            )
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
            #   3. adding tags: description + date of creation
            tags = Tags(for_object=True)
            tags["description"] = f"{quote(description.encode('utf-8'))}"
            tags["created"] = f"{datetime.utcnow()}"
            tags["check_status"] = "success"
            tags["check_text"] = "ValidPipeline"
            client_result = client.copy_object(
                "pipelines",
                f"pipelines-created/{user_id}/{name}.hpl",
                CopySource("pipelines", f"templates/{template}"),
                tags=tags,
                metadata_directive=REPLACE,
            )

            return Response({"status": "success"}, status=status.HTTP_200_OK)

class PipelineDetailView(APIView):
    keycloak_scopes = {
        "PUT": "pipeline:update",
        "GET": "pipeline:read",
        "DELETE": "pipeline:delete",
    }

    # dynamic dag output
    file = "../hop/data-orch.list"

    def get(self, request, name=None):
        """
        Endpoint for getting details of pipeline
        """
        user_id = get_current_user_id(request)
        try:
            # Automatically open file in visual editor when HopUI opens
            minio_access_key=os.getenv("MINIO_ACCESS_KEY")
            minio_secret_key=os.getenv("MINIO_SECRET_KEY")
            minio_host = os.getenv("MINIO_HOST")
            tags = client.get_object_tags(bucket_name="pipelines", object_name=f"pipelines-created/{user_id}/{name}.hpl")
            if tags is None :
                tags = {}
            # url = f"http://storage:9000/pipelines/pipelines-created/{user_id}/{name}.hpl"
            minio_ftp = f"{minio_access_key}:{minio_secret_key}@{minio_host}"
            url = f"ftp://{minio_ftp}/pipelines/pipelines-created/{user_id}/{name}.hpl"
            # url = client.get_presigned_url("GET","pipelines",f"pipelines-created/{user_id}/{name}.hpl", expires=timedelta(hours=2))
            print(url)
            payload = {"names": [url]}

            edit_hop = EditAccessProcess(file=self.file)
            edit_hop.request_edit(payload)         
            return Response(
                {
                    "name": name,
                    "description": tags.get("description", ""),
                    "check_status": tags.get("check_status", ""),
                    "check_text": tags.get("check_text", ""),
                    "created": tags.get("created", "")
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
        name = request.data.get("name")
        valid_pipeline, check_text = check_pipeline_validity(name, user_id)
        tags = Tags(for_object=True)
        tags["description"] = request.data.get("description")
        tags["created"] = request.data.get("created")
        tags["check_status"] = "success" if valid_pipeline else "failed"
        tags["check_text"] = check_text
        client.set_object_tags("pipelines",f"pipelines-created/{user_id}/{name}.hpl", tags)            
        return Response(
                {
                    "status": "success",
                },
                status=status.HTTP_200_OK,
            )

    def delete(self, request, name=None):
        """
        Endpoint for deleting a pipeline from local file system after downloading it from Minio
        """
        if not name:
            return Response({"status": "fail", "message": "Pipeline name is required."}, status=status.HTTP_400_BAD_REQUEST)

        local_file_path = f"/hop/pipelines/{name}.hpl"

        if os.path.exists(local_file_path):
            try:
                os.remove(local_file_path)
                return Response({"status": "success", "message": f"Pipeline {name} deleted successfully."}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"status": "error", "message": f"Error deleting file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"status": "fail", "message": f"Pipeline file {name}.hpl not found."}, status=status.HTTP_404_NOT_FOUND)
       
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

            # Read the data from the response
            data = client_response.read()

            # Set response headers for file download
            response = Response(data, content_type='application/octet-stream')
            response["Content-Disposition"] = f'attachment; filename="{name}.hpl"'
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
    def __init__(self):
        self.permitted_characters_regex = re.compile(r'^[^\s!@#$%^&*()+=[\]{}\\|;:\'",<>/?]*$')

    def post(self, request, format=None):
        """
        Endpoint for uploading a pipeline
        """
        user_id = get_current_user_id(request)
        name = request.data.get("name")
        description = request.data.get("description")
        uploaded_file = request.FILES.get("uploadedFile")

        cd = pyclamd.ClamdNetworkSocket(host="clamav", port=3310)
        scan_result = cd.scan_stream(uploaded_file.read())
        if scan_result is not None:
            logging.error(f"Malicious Pipeline uploaded : {scan_result}")
            return Response({'errorMessage': f'Malicious File Upload: {scan_result}'}, status=status.HTTP_400_BAD_REQUEST)
        # seeking to 0 in the uploaded_file because scan_stream does not release the pointer 
        uploaded_file.seek(0)

        if not self.permitted_characters_regex.search(name):
            return Response(
                {"status": "Fail", "message": "Pipeline name contains unpermitted characters"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if uploaded_file:
            # To check if file is valid we first have to have it saved on the local file system
            with open(f"/hop/pipelines/{name}.hpl", 'wb') as f:
                for chunk in uploaded_file.chunks():
                    f.write(chunk)
            try:
                # Checks if an object with the same name exists
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
                # Upload new pipeline
                valid_pipeline, check_text = check_pipeline_validity(name)
                tags = Tags(for_object=True)
                tags["desciprtion"] = f"{quote(description.encode('utf-8'))}"
                tags["created"] = f"{datetime.utcnow()}"
                tags["check_status"] = "success" if valid_pipeline else "failed"
                tags["check_text"] = check_text
                with open(f"/hop/pipelines/{name}.hpl", 'rb') as f:
                    client_result = client.put_object(
                    bucket_name='pipelines',
                    object_name=f"pipelines-created/{user_id}/{name}.hpl",
                    data=f,
                    length=os.path.getsize(f.name),
                    tags=tags
                    )
                return Response({"status": "success"}, status=status.HTTP_200_OK)

class PipelineUploadExternalFilesView(APIView):
    parser_classes = (MultiPartParser,)
    keycloak_scopes = {
        "POST": "pipeline:add",
        "GET": "pipeline:read",
    }

    def __init__(self):
        self.permitted_characters_regex = re.compile(r'^[^\s!@#$%^&*()+=[\]{}\\|;:\'",<>/?]*$')

    def post(self, request, format=None):
        """
        Endpoint for uploading an external file to an existing pipeline
        """
        user_id = get_current_user_id(request)
        name = request.data.get("name")
        description = request.data.get("description")
        uploaded_file = request.FILES.get("uploadedFile")

        file_extension = os.path.splitext(uploaded_file.name)[1]
        if not file_extension:
            return Response(
                {"status": "Fail", "message": "Uploaded file does not have a valid extension"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        local_save_path = f"/hop/pipelines/external_files/{name}{file_extension}"

        # Scan the file for viruses
        cd = pyclamd.ClamdNetworkSocket(host="clamav", port=3310)
        scan_result = cd.scan_stream(uploaded_file.read())
        if scan_result is not None:
            logging.error(f"Malicious Pipeline uploaded: {scan_result}")
            return Response({'errorMessage': f'Malicious File Upload: {scan_result}'}, status=status.HTTP_400_BAD_REQUEST)

        # Reset the file pointer after scanning
        uploaded_file.seek(0)

        # Check for unpermitted characters in the name
        if not self.permitted_characters_regex.search(name):
            return Response(
                {"status": "Fail", "message": "Pipeline name contains unpermitted characters"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            os.makedirs(os.path.dirname(local_save_path), exist_ok=True)
            with open(local_save_path, "wb") as local_file:
                for chunk in uploaded_file.chunks():
                    local_file.write(chunk)
            tags = Tags(for_object=True)
            tags["desciprtion"] = f"{quote(description.encode('utf-8'))}"
            tags["created"] = f"{datetime.utcnow()}"
           
            object_name = f"external_files/{name}{file_extension}"
            client.put_object(
                bucket_name="pipelines",
                object_name=object_name,
                data=open(local_save_path, "rb"),
                length=os.path.getsize(local_save_path),
                
                tags=tags
            )
            return Response({"status": "success"}, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"Error uploading file: {str(e)}")
            return Response(
                {"status": "Fail", "message": "Error processing the uploaded file"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PipelineDeleteView(APIView):
    keycloak_scopes = {
        "DELETE": "pipeline:delete",
    }

    def delete(self, request, name=None):
        """
        Endpoint for deleting a pipeline
        """
        # Disable all dags using the pipeline
        dag_ids = request.data.get("dags", [])

        result = self._deactivate_processes(dag_ids)
        if result["status"] == "failed":
            return Response({"status": "failed", "message": result["message"] }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Back up and then delete the pipeline
        user_id = get_current_user_id(request)
        try:
            # back up pipeline file
            client.copy_object(
            "pipelines",
            f"pipelines-deleted/{user_id}/{name}_{datetime.utcnow()}.hpl",
            CopySource("pipelines", f"pipelines-created/{user_id}/{name}.hpl"))
            # delete pipeline file from Minio
            client.remove_object(
                "pipelines",
                f"pipelines-created/{user_id}/{name}.hpl")

            return Response({"status": "success"}, status=status.HTTP_200_OK)
        except:
            return Response(
                {
                    "status": "error",
                    "message": "Unable to delete the pipeline {}".format(name),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def _deactivate_processes(self, dag_ids):
        if dag_ids is not None and dag_ids:
            all_successful = True
            messages = []
            deactivated_processes = []

            for dag_id in dag_ids:
                result = self._set_process_status(dag_id, True)
                if result["status"] == "failed":
                    all_successful = False
                    messages.append(result["message"])
                else:
                    deactivated_processes.append(dag_id)

            if all_successful:
                return {"status": "success"}
            else:
                # reactivate all deactivated processes
                for dag_id in deactivated_processes:
                    reactivation_result = self._set_process_status(dag_id, False)
                    messages.append(reactivation_result["message"])
                return {"status": "failed",
                    "message": "One or more process deactivation failed.",
                    "errors": messages}
        return {"status": "success"}

    def _set_process_status(self, dag_id, is_deactivated):
        route = f"{AirflowInstance.url}/dags/{dag_id}"

        try:
            # deactivate the process status
            airflow_toggle_response = requests.patch(
                route,
                auth=(AirflowInstance.username, AirflowInstance.password),
                json={"is_paused": is_deactivated},
            )

            if airflow_toggle_response.ok:
                return {"status": "success"}
            else:
                return {"status": "failed", "message": f"Failed to update process status for {dag_id}"}
        except Exception as e:
            return {"status": "failed", "message": f"Exception occured while updating process status {dag_id}: {str(e)}"}

class TemplateView(APIView):
    keycloak_scopes = {
        "GET": "pipeline:read",
        "POST": "pipeline:add",
    }

    def get(self, request, query: str = None):
        """ Return hop templates from minio bucket """
        user_id = get_current_user_id(request)
        pipelines_templates = []

        try:
            # Function to process template objects
            def process_templates(templates, prefix):
                return [
                    {"name": template.object_name.removeprefix(prefix)}
                    for template in templates
                    if template.object_name.endswith('.hpl') and (not query or re.search(query, template.object_name.removeprefix(prefix), re.IGNORECASE))
                ]

            # Fetch global templates
            global_templates = client.list_objects("pipelines", prefix="templates/")
            pipelines_templates.extend(process_templates(global_templates, "templates/"))

            # Fetch user-specific templates
            if user_id:
                user_templates = client.list_objects('pipelines', prefix=f'templates/{user_id}/')
                pipelines_templates.extend(process_templates(user_templates, f'templates/{user_id}/'))

            return Response({'status': 'success', "data": pipelines_templates}, status=200)
        except Exception as e:
            return Response(
                {
                    "status": "error",
                    "message": f"Unable to fetch templates: {e}",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        user_id = get_current_user_id(request)
        name = request.data.get("name", None)
        try:
            # save pipeline file as Template in Minio
            client.copy_object(
            "pipelines",
            f"templates/{user_id}/{name}.hpl",
            CopySource("pipelines", f"pipelines-created/{user_id}/{name}.hpl"))

            return Response({"status": "success"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {
                    "status": "error",
                    "message": "Unable to save the pipeline {} as Template: {}".format(name, e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
