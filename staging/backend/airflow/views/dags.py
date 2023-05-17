import requests
from core.env import AIRFLOW_API
from rest_framework.views import APIView
from rest_framework.response import Response

api = AIRFLOW_API

class DagApiView(APIView):

    def get(self, request, id=None):
        print(api);

        if id:
            route = "{}/dags/{}".format(api, id)
            client = requests.get(route)
            print(client)
            return Response({'status': 'success', "dag": {}}, status=200)
        
        route = "{}/dags".format(api)
        print(route)
        client = requests.get(route)
        print(client)
        return Response({'status': 'success', "dags": []}, status=200)