import os
import re
import time
from typing import List
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from core import settings
from utils.minio import client
from bs4 import BeautifulSoup
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
from rest_framework.permissions import AllowAny
from django.utils.datastructures import MultiValueDictKeyError
import docker

def get_file_by_name(filename: str)-> any:
  """Looks for a file by it name and return the found item"""
  if os.path.isfile(os.path.join(settings.HOP_FILES_DIR, filename)):
    return os.path.join(settings.HOP_FILES_DIR, filename)
  else:
    return False
  
def get_xml_content(content: str)-> any:
  """Receives a content, open and read it, then convert to xml format an return it"""
  contents = None
  # iterate over the file
  with open(content) as f:
    contents = f.read()
  return BeautifulSoup(contents, "xml")
     
class GetSingleHopAPIView(APIView):
    """
    Returns a single hop data in xml format
    """
    permission_classes = [AllowAny]

    def get(self, request, filename: str):
      """Returns a single file"""
      result = get_file_by_name(filename)
      if result:
        bs_content = get_xml_content(result)
        bs_data = bs_content.find("info")
        return HttpResponse(bs_data.prettify(), content_type="text/xml")
      else:
        return Response({'status': 'error', "message": "No match found! No filename match: {}".format(filename)}, status=404)

    def post(self, request, filename):
      """Receive a request and add a new tag"""
      result = get_file_by_name(filename)
      if result:
        bs_content = get_xml_content(result)
        # find the info tag content
        bsc_data = bs_content.find('info')

        # iterate over the request dict, find the xml tag and update it content
        for key, value in request.data.items():
          bs_data = bs_content.new_tag(key)
          bs_data.string = value
          bsc_data.append(bs_data) # append the new tag to the tree
        
        # find the info tag content and return as the response
        bsc_data = bs_content.find('info')
        return HttpResponse(bsc_data.prettify(), content_type="text/xml")
      else:
        return Response({'status': 'error', "message": "No match found! No filename match: {}".format(filename)}, status=404)
    
    def patch(self, request, filename):
      """Receive a request and update the file based on the request given"""
      result = get_file_by_name(filename)
      if result:
        bs_content = get_xml_content(result)

        # iterate over the request dict, find the xml tag and update it content
        for key, value in request.data.items():
          bs_data = bs_content.find(key)
          bs_data.string = value

        with open(filename, 'w') as f:
          # convert the files to a string and write to the file
          contents = "".join(str(item) for item in bs_content.contents)
          f.write(contents)
        
        # find the info tag content and return as the response
        bsc_data = bs_content.find('info')
        return HttpResponse(bsc_data.prettify(), content_type="text/xml")
      else:
        return Response({'status': 'error', "message": "No match found! No filename match: {}".format(filename)}, status=404)
      
    def delete(self, request, filename):
      """Receive a request and delete a tag (s) based on the request given"""
      result = get_file_by_name(filename)
      if result:
        bs_content = get_xml_content(result)

        # iterate over the request list
        for item in request.data['tags']:
          tag = bs_content.find(item) # find the xml tag
          tag.decompose() # remove the tag from the tree

        # find the info tag content and return as the response
        bsc_data = bs_content.find('info')
        return HttpResponse(bsc_data.prettify(), content_type="text/xml")
      else:
        return Response({'status': 'error', "message": "No match found! No filename match: {}".format(filename)}, status=404)
      
class NewHopAPIView(APIView):
  parser_classes = (MultiPartParser,)
  permission_classes = [AllowAny]

  def validate_file_extension(self, value):
    """Receives a file and validate it extension"""
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.hpl']
    if not ext in valid_extensions:
      return 'File type not supported! Please upload a .hpl file.'

  def post(self, request):
    """Receives a request to upload a file and sends it to filesystem for now. Later the file will be uploaded to minio server."""
    try:
      file_obj = request.data['file']
      filename = request.data['filename']
      extensionError = self.validate_file_extension(file_obj)

      # validate the file extension
      if extensionError:
        return Response({'status': 'error', "message": extensionError}, status=500)
      
      # check that a filename is passed
      if(len(filename) != 0):
        # check if the filename does exist and throw error otherwise; save the file as the name passed
        if get_file_by_name(filename):
          return Response({'status': 'error', "message": '{} already exists'.format(filename)}, status=409)
        else:
          # replace the file storage from filestorage to minio
          # upload_file_to_minio("hop-bucket", file_obj)
          return Response({'status': 'success', "message": "template file uploaded successfully"}, status=200)
      else:
        # check if the filename does exist and throw error otherwise; save the file as it is
        if get_file_by_name(file_obj.name):
          return Response({'status': 'error', "message": '{} already exists'.format(file_obj.name)}, status=409)
        else:
          # replace the file storage from filestorage to minio
          # upload_file_to_minio("hop-bucket", file_obj)
          return Response({'status': 'success', "message": "template file uploaded successfully"}, status=200)
    except MultiValueDictKeyError:
      return Response({'status': 'error', "message": "Please provide a file to upload"}, status=500)
         
class NewHopInstancesView(APIView):
  def start_docker_container(self, user_id, service_name, image, volumes, environment, user="0:1000"):
      """Starts a new Docker container for the given user."""
      client = docker.DockerClient(base_url='unix://var/run/docker.sock')
      container = client.containers.run(
          image,
          volumes=volumes,
          environment=environment,
          name=f"{service_name}_{user_id}",
          user=user,
          detach=True
      )
      return container.id

  def stop_docker_container(container_id):
    """Stops and removes a Docker container."""
    client = docker.from_env()
    try:
        container = client.containers.get(container_id)
        container.stop()
        container.remove()
    except docker.errors.NotFound:
        print(f"Container {container_id} not found.")

  def post(self, request):
    """Receive a request to create a new hop and hop-server instance"""
    
    user_id = request.data['user_id']
    base_path = os.getenv("PROJECT_BASE_PATH")
    
    hop_volumes = {
        f"/data/{user_id}": {"bind": "/hop/projects", "mode": "rw"},
        f"{base_path}/hop/pipelines": {"bind": "/files", "mode": "rw"},
        f"{base_path}/hop/pipelines/external_files": {"bind": "/files/external_files", "mode": "rw"},
        f"{base_path}/storage": {"bind": "/home", "mode": "rw"},
        f"{base_path}/hop/data-orch.list": {"bind": "/usr/local/tomcat/webapps/ROOT/audit/default/data-orch.list", "mode": "rw"},
        f"{base_path}/hop/keycloak/index.jsp": {"bind": "/usr/local/tomcat/webapps/ROOT/index.jsp", "mode": "rw"},
        f"{base_path}/hop/keycloak/server.xml": {"bind": "/usr/local/tomcat/conf/server.xml", "mode": "rw"}
    }
    hop_environment = {
        "HOP_KEYCLOAK_SELF_SIGNED_SSL": os.getenv("HOP_KEYCLOAK_SELF_SIGNED_SSL"),
        "HOP_KEYCLOAK_CLIENT_ID": os.getenv("HOP_KEYCLOAK_CLIENT_ID"),
        "HOP_KEYCLOAK_CLIENT_SECRET": os.getenv("HOP_KEYCLOAK_CLIENT_SECRET"),
        "HOP_KEYCLOAK_REALM": os.getenv("HOP_KEYCLOAK_REALM"),
        "HOP_KEYCLOAK_SERVER_URL": os.getenv("HOP_KEYCLOAK_SERVER_URL"),
        "HOP_KEYCLOAK_SSL_REQUIRED": os.getenv("HOP_KEYCLOAK_SSL_REQUIRED"),
        "HOP_KEYCLOAK_CONFIDENTIAL_PORT": os.getenv("HOP_KEYCLOAK_CONFIDENTIAL_PORT"),
        "HOP_KEYCLOAK_DISABLE_SSL_VERIFICATION": os.getenv("HOP_KEYCLOAK_DISABLE_SSL_VERIFICATION")
    }
    
    hop_container_id = self.start_docker_container(user_id, "hop", "custom-hop:latest", hop_volumes, hop_environment)

    hop_server_volumes = {
        f"{base_path}/hop/pipelines": {"bind": "/files", "mode": "rw"}
    }
    hop_server_environment = {
        "HOP_SERVER_USER": os.getenv("HOP_SERVER_USER"),
        "HOP_SERVER_PASS": os.getenv("HOP_SERVER_PASS"),
        "HOP_SERVER_PORT": 8080,
        "HOP_SERVER_HOSTNAME": "0.0.0.0"
    }
    
    hop_server_container_id = self.start_docker_container(user_id, "hop-server", "apache/hop:2.7.0", hop_server_volumes, hop_server_environment)

    # After 10 minutes, stop the containers
    time.sleep(600)
    self.stop_docker_container(hop_container_id)

    return Response({
        'status': 'success', 
        "message": "Hop and Hop-server instances created successfully", 
        "hop_container_id": hop_container_id,
        "hop_server_container_id": hop_server_container_id
    }, status=200)

