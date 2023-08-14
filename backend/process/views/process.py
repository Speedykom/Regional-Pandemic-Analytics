import requests
import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import ProcessChain, Pipeline
from ..serializers import ProcessChainSerializer, PipelineSerializer
from ..gdags.dynamic import DynamicDag
from utils.minio import client

class AirflowInstance:
    url = os.getenv("AIRFLOW_API")
    username = os.getenv("AIRFLOW_USER")
    password = os.getenv("AIRFLOW_PASSWORD")
    
class DagConfig:
    factory_id = "FACTORY"
    def __init__(self,owner,user_id,dag_id,schedule_interval,pipeline_name):
        self.owner=owner
        self.user_id=user_id
        self.dag_id=dag_id
        self.schedule_interval=schedule_interval
        self.pipeline_name=pipeline_name

class ProcessListView(APIView):
    keycloak_scopes = {
        'GET': 'process:read',
        'POST': 'process:add'
    }

    def get(self, request, dag_id=None):
        cur_user = request.userinfo
        user_name = cur_user["preferred_username"]

        processes = []

        # Get the list of process chains defined in Airflow over REST API
        res=requests.get(f"{AirflowInstance.url}/dags", auth=(AirflowInstance.username, AirflowInstance.password)).json()

        # Only returns the dags which owners flag is the same as the frontend username
        for dag in res["dags"]:
            if user_name in dag['owners']:
                processes.append(
                    {
                    "name":dag['dag_id'],
                    "dag_id":dag['dag_id'],
                    "data_source_name":dag['dag_id'],
                    "schedule_interval":dag['schedule_interval']["value"],
                    "active": dag["is_active"]
                    }
                    )
                
        return Response({'status': 'success', "dags": processes}, status=200)

    def post(self, request):
        cur_user = request.userinfo
        user_id = cur_user['sub']
        user_name = cur_user["preferred_username"]

        # Collect Form data
        dag_id = request.data['name'].replace(" ", "-").lower()
        pipeline_name = request.data['pipeline']
        schedule_interval = request.data['schedule_interval']
        
        # Create DagConfig object
        # Object contains config that will be passed to the dag factory to create new dag from templates
        new_dag_config = DagConfig(
            owner=user_name,
            user_id=user_id,
            dag_id=dag_id,
            schedule_interval=schedule_interval,
            pipeline_name=pipeline_name
            )
        
        # Run factory by passing config to create a process chain
        ariflow_internal_url=AirflowInstance.url.removesuffix("/api/v1")
        res=requests.post(
            f"{ariflow_internal_url}/factory", 
            auth=(AirflowInstance.username, AirflowInstance.password), 
            json={                
                "dag_conf":{
                    "owner":f"{new_dag_config.owner}",
                    "user_id":f"{new_dag_config.user_id}",
                    "dag_id":f"{new_dag_config.dag_id}",
                    "schedule_interval":f"{new_dag_config.schedule_interval}",
                    "pipeline_name":f"{new_dag_config.pipeline_name}"
                }
            })
        print(res.text)
        if res.status_code == 200:
            return Response({"status": "success"}, status=status.HTTP_200_OK)
        else:
            return Response({"status":"failed"}, status=res.status_code)

class ProcessDetailView(APIView):
    keycloak_scopes = {
        'GET': 'process:read',
        'POST': 'process:run',
        'DELETE': 'process:delete'
    }

    def get(self, request, id=None):
        route = "{}/dags/{}/dagRuns".format(AirflowInstance.url, id)
        client = requests.get(route, json={}, auth=(AirflowInstance.username, AirflowInstance.password))

        res_status = client.status_code

        if (res_status == 404):
            return Response({'status': 'success', "message": client.json()['detail']}, status=res_status)
        else:
            return Response({'status': 'success', "message": client.json()['dag_runs'].format(id)}, status=200)

    def post(self, request, id=None):
        route = "{}/dags/{}/dagRuns".format(AirflowInstance.url, id)
        client = requests.post(route, json={}, auth=(AirflowInstance.username, AirflowInstance.password))

        res_status = client.status_code

        if (res_status == 404):
            return Response({'status': 'success', "message": "No process found for this dag_id {}".format(id)}, status=res_status)
        else:
            return Response({'status': 'success', "message": "{} process start running!".format(id)}, status=res_status)

    def delete(self, request, dag_id=None):
        process = ProcessChain.objects.get(dag_id=dag_id)
        process.state = 'inactive'
        process.save()
        return Response({"status": "success", "data": "Record Deleted"})
