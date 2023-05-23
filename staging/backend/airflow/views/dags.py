import requests
import os
from rest_framework.views import APIView
from rest_framework.response import Response

api = os.getenv("AIRFLOW_API")
username = os.getenv("AIRFLOW_USER")
password = os.getenv("AIRFLOW_PASSWORD")

class DagApiView(APIView):

    def get(self, request, id=None):
        if id:
            route = "{}/dags/{}".format(api, id)
            client = requests.get(route)
            return Response({'status': 'success', "dag": client.json()}, status=200)

        route = "{}/dags".format(api)
        client = requests.get(route, auth=(username, password))
        return Response({'status': 'success', "dags": client.json()['dags']}, status=200)
