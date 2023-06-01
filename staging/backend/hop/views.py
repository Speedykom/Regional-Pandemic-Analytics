import os
from typing import List
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from core import settings
from bs4 import BeautifulSoup
from django.http import HttpResponse

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

class ListHopAPIView(APIView):
    """
    This view returns the api response for the hop
    """

    def get_all_directory_files(self)-> List[str]:
      """Looks into the hops template, iterate over the files, append and return"""
      files: List[str] = []
    
      for filename in os.listdir(settings.HOP_FILES_DIR):
        if filename.endswith(".hpl"):
          files.append(filename)
        else:
          continue
      
      return files

    def get(self, request):
      """Returns all the files from the hop directory"""
      return Response({'status': 'success', "data": "{}".format(self.get_all_directory_files())}, status=200)
  
      
class GetSingleHopAPIView(APIView):
    """
    Returns a single hop data in xml format
    """
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

  def post(self, request):
    file_obj = request.data['file']
    return Response({'status': 'success', "message": "file: {} received".format(file_obj)}, status=200)
    