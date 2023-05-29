import os
from typing import List
from rest_framework.views import APIView
from rest_framework.response import Response
from core import settings
from bs4 import BeautifulSoup
from django.http import HttpResponse

# Create your views here.
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

    def get_file_by_name(self, filename: str)-> any:
      """Looks for a file by it name and return the found item"""
      if os.path.isfile(os.path.join(settings.HOP_FILES_DIR, filename)):
        return os.path.join(settings.HOP_FILES_DIR, filename)
      else:
        return False
  
    def get(self, request, filename: str):
      """Returns a single file"""
      result = self.get_file_by_name(filename)
      if result:
        contents = None
        with open(result) as f:
          contents = f.read()
        bs_data = BeautifulSoup(contents, "xml")
        return HttpResponse(bs_data.prettify(), content_type="text/xml")
      else:
        return Response({'status': 'error', "message": "No match found! No filename match: {}".format(filename)}, status=404)
      # request.data.get("name", None),