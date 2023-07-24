import requests
import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..models import ProcessChain, Pipeline
from ..serializers import ProcessChainSerializer, PipelineSerializer
from ..gdags.dynamic import DynamicDag
from ..gdags.hop import EditAccessProcess
from utils.keycloak_auth import me

api = os.getenv("AIRFLOW_API")
username = os.getenv("AIRFLOW_USER")
password = os.getenv("AIRFLOW_PASSWORD")

druid_api = os.getenv("DRUID_API")

class DeleteProcess(APIView):

    permission_classes = [AllowAny]

    def delete(self, request, dag_id=None):
        process = ProcessChain.objects.get(dag_id=dag_id)
        process.state = 'inactive'
        process.save()
        return Response({"status": "success", "data": "Record Deleted"})

class CreateProcess(APIView):

    permission_classes = [AllowAny]
    
    template = "process/gdags/template.py"

    # dynamic dag output
    output = "../airflow/dags/"

    def post(self, request):
        cur_user = me(request)

        if (cur_user['is_authenticated'] == False):
            return Response(cur_user, status=cur_user["status"])

        pipeline_id = request.data['pipeline']
        snippets = Pipeline.objects.filter(id=pipeline_id)

        if (len(snippets) < 0):
            return Response({"status": "Fail", "message": "no pipeline exist with this pipeline id {}".format(pipeline_id)}, status=409)

        pipeline_serializer = PipelineSerializer(snippets[0])
        pipeline = pipeline_serializer.data

        dag_id = request.data['name'].replace(" ", "-").lower()
        user_id = cur_user['payload']['sub']

        process = ProcessChain.objects.filter(dag_id=dag_id, user_id=user_id)

        if (len(process) > 0):
            return Response({"status": "Fail", "message": "process already exist with this dag_id {}".format(dag_id)}, status=409)

        request.data['path'] = pipeline['path']
        request.data['parquet_path'] = pipeline['parquet_path']
        request.data['dag_id'] = dag_id
        request.data['dag_name'] = dag_id
        request.data['user_id'] = user_id
        request.data['data_source_name'] = dag_id

        serializer = ProcessChainSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save()

            # init dynamic dag class
            dynamic_dag = DynamicDag(output=self.output, template=self.template)

            # create dag
            dynamic_dag.new_dag(request.data['dag_id'], request.data['dag_id'], request.data['parquet_path'],
                                request.data['data_source_name'], request.data['schedule_interval'],
                                request.data['path'])

            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class GetProcess(APIView):
    
    permission_classes = [AllowAny]

    def get(self, request, dag_id=None):

        cur_user = me(request)

        if (cur_user['is_authenticated'] == False):
            return Response(cur_user, status=cur_user["status"])

        user_id = cur_user['payload']['sub']

        if dag_id:
            process = ProcessChain.objects.filter(dag_id=dag_id, user_id=user_id)
            
            if (len(process) <= 0): return Response({'status': 'success', "message": "No process found for this dag_id {}".format(dag_id)}, status=404)

            route = "{}/dags/{}".format(api, dag_id)
            client = requests.get(route, auth=(username, password))

            res_status = client.status_code
            
            if (res_status == 404): return Response({'status': 'success', "message": client.json()['detail']}, status=res_status)

            route = "{}/dags/{}/dagRuns".format(api, dag_id)
            runs = requests.get(route, json={}, auth=(username, password))

            respose = client.json()
            respose['runs'] = runs.json()['dag_runs']
            respose["data_source_name"] = "ebola-hop-druid"

            return Response({'status': 'success', "dag": respose}, status=200)

        processes = []
        snippets = ProcessChain.objects.filter(user_id=user_id)
        serializer = ProcessChainSerializer(snippets, many=True)

        for process in serializer.data:
            route = "{}/dags/{}".format(api, process['dag_id'])
            dag = requests.get(route, auth=(username, password))
            
            res_status = dag.status_code

            if (res_status == 200):
                process['airflow'] = dag.json()
            elif(res_status == 404):
                process['airflow'] = None

            processes.append(process)
        
        return Response({'status': 'success', "dags": processes}, status=200)


class RunProcess(APIView):

    permission_classes = [AllowAny]

    def post(self, request, id=None):
        route = "{}/dags/{}/dagRuns".format(api, id)
        client = requests.post(route, json={}, auth=(username, password))

        res_status = client.status_code
        
        if (res_status == 404): return Response({'status': 'success', "message": "No process found for this dag_id {}".format(id)}, status=res_status)
        else: return Response({'status': 'success', "message": "{} process start running!".format(id)}, status=res_status)

class DruidDetailsProcessChain(APIView):

    permission_classes = [AllowAny]

    def get(self, request, id=None):
        snippet = ProcessChain.objects.filter(id=id)
        
        if (len(snippet) <= 0): return Response({'status': 'success', "message": "No process found for this dag_id {}".format(id)}, status=404)

        serializer = ProcessChainSerializer(snippet[0])

        process = serializer.data

        data_source = process['data_source_name']

        route = "{}/druid/coordinator/v1/datasources/{}?full".format(druid_api, data_source)
        client = requests.get(route)

        respose = client.json()
        
        if (respose['name']): return Response({'status': 'success', "message": "No data found!!"}, status=404)

        process['druid'] = respose

        return Response({'status': 'success', "data": process}, status=200)

class OrchestrationDetailsProcessChain(APIView):

    permission_classes = [AllowAny]

    def get(self, request, id=None):
        process = ProcessChain.objects.filter(dag_id=id)
        
        if (len(process) <= 0): return Response({'status': 'success', "message": "No process found for this dag_id {}".format(id)}, status=404)

        route = "{}/dags/{}".format(api, id)
        client = requests.get(route, auth=(username, password))

        res_status = client.status_code
        
        if (res_status == 404): return Response({'status': 'success', "message": client.json()['detail']}, status=res_status)

        route = "{}/dags/{}/dagRuns".format(api, id)
        runs = requests.get(route, json={}, auth=(username, password))

        respose = client.json()
        respose['runs'] = runs.json()['dag_runs']

        return Response({'status': 'success', "data": respose}, status=200)