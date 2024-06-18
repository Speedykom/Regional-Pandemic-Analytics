import os
import re
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
         
    