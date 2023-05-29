import os
from typing import List
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from core import settings

# Create your views here.
class ListHopViewSet(ViewSet):
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

  
    def get_all(self, request):
          #   file_path = os.path.join(settings.HOP_FILES_DIR, 'test.txt')
      return Response({'status': 'success', "message": "{}".format(self.get_all_directory_files())}, status=200)
    
    def get_single(self, request, hop_title):
      # request.data.get("name", None),
      return Response({'status': 'success', "message": "listing single hop {}".format(hop_title)}, status=200)
