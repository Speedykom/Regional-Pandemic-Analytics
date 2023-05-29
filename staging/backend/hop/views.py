from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response

# Create your views here.
class ListHopViewSet(ViewSet):
    """
    This view returns the api response for the hop
    """

    # 
  
    def get_all(self, request):
      return Response({'status': 'success', "message": "listing hops"}, status=200)
    
    def get_single(self, request, hop_title):
      # request.data.get("name", None),
      return Response({'status': 'success', "message": "listing single hop {}".format(hop_title)}, status=200)
