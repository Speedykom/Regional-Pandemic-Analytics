import requests
import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..models import ProcessChain
from ..serializers import ProcessChainSerializer
from ..gdags.dynamic import DynamicDag
from ..gdags.hop import EditAccessProcess

api = os.getenv("AIRFLOW_API")
username = os.getenv("AIRFLOW_USER")
password = os.getenv("AIRFLOW_PASSWORD")

class EditProcess(APIView):

    permission_classes = [AllowAny]

    # dynamic dag template
    template = "process/gdags/template.py"

    # dynamic dag output
    output = "../airflow/dags/"

    # edit dag and dynamically edit dag file
    def patch(self, request, id):
        result = ProcessChain.objects.get(id=id)
        check_serializer = ProcessChainSerializer(result)
        serializer = ProcessChainSerializer(result, data=request.data, partial=True)

        if serializer.is_valid():
            # remove existing dag
            dag_id = check_serializer.data['dag_id']
            file_to_rem = pathlib.Path("{}{}.py".format(self.output, dag_id))
            file_to_rem.unlink()

            serializer.save()

            # init dynamic dag class
            dynamic_dag = DynamicDag(output=self.output, template=self.template)
            # create dag
            dynamic_dag.new_dag(request.data['dag_id'], request.data['dag_id'], request.data['parquet_path'],
                                request.data['data_source_name'], request.data['schedule_interval'],
                                request.data['path'])

            return Response({"status": "success", "data": serializer.data})
        else:
            return Response({"status": "error", "data": serializer.errors})

            # delete dag and dynamically remove file frome the airflow dags folder

class DeleteProcess(APIView):

    permission_classes = [AllowAny]

    # dynamic dag template
    template = "process/gdags/template.py"

    # dynamic dag output
    output = "../airflow/dags/"

    def delete(self, request, id=None):
        result = get_object_or_404(Dag, id=id)
        serializer = ProcessChainSerializer(result)

        file_to_rem = pathlib.Path("{}{}.py".format(self.output, serializer.data['dag_id']))
        file_to_rem.unlink()

        result.delete()
        return Response({"status": "success", "data": "Record Deleted"})


class CreateProcess(APIView):

    permission_classes = [AllowAny]

    # dynamic dag template
    template = "process/gdags/template.py"

    # dynamic dag output
    output = "../airflow/dags/"

    def post(self, request):
        serializer = ProcessChainSerializer(data=request.data)
        dag_id = request.data['dag_id']

        if serializer.is_valid():

            process = ProcessChain.objects.filter(dag_id=dag_id)

            if (len(process) > 0):
                return Response({"status": "Fail", "message": "process already exist with this dag_id {}".format(dag_id)}, status=409)

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
        if dag_id:
            process = ProcessChain.objects.filter(dag_id=dag_id)
            
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
        snippets = ProcessChain.objects.all()
        serializer = ProcessChainSerializer(snippets, many=True)

        for process in serializer.data:
            route = "{}/dags/{}".format(api, process['dag_id'])
            dag = requests.get(route, auth=(username, password))
            
            res_status = dag.status_code

            if (res_status == 404): 
                process['airflow'] = None
            else:
                process['airflow'] = dag.json()

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

class RunDetailsProcessChain(APIView):

    permission_classes = [AllowAny]

    def get(self, request, id=None):
        route = "{}/dags/{}/dagRuns".format(api, id)
        client = requests.get(route, json={}, auth=(username, password))

        res_status = client.status_code
        
        if (res_status == 404): return Response({'status': 'success', "message": client.json()['detail']}, status=res_status)
        else: return Response({'status': 'success', "message": client.json()['dag_runs'].format(id)}, status=200)
        

# Request edit access
class RequestEditProcess(APIView):

    permission_classes = [AllowAny]

    # dynamic dag output
    file = "../hop/data-orch.list"

    def get(self, request, dag_id=None):
        process = ProcessChain.objects.filter(dag_id=dag_id)
        
        if (len(process) <= 0): return Response({'status': 'success', "message": "No process found for this dag_id {}".format(dag_id)}, status=404)

        file_path = 'file:///files/{}'.format(process[0].path)
        payload = {"names": [file_path]}
        
        edit_hop = EditAccessProcess(file=self.file)
        edit_hop.request_edit(json.dumps(payload))

        return Response({"status": "success", "data": "Edit access granted!"}, status=status.HTTP_200_OK)