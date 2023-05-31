import requests
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from ..gdags.dynamic import DynamicDag
from ..models import Dag
from ..serializers import DagSerializer
from ..gdags.hop import EditProcess

api = os.getenv("AIRFLOW_API")
username = os.getenv("AIRFLOW_USER")
password = os.getenv("AIRFLOW_PASSWORD")

class EditProcess(APIView):

    permission_classes = [AllowAny]

    # dynamic dag template
    template = "airflow/gdags/template.py"

    # dynamic dag output
    output = "../airflow/dags/"

    # edit dag and dynamically edit dag file
    def patch(self, request, id):
        result = Dag.objects.get(id=id)
        check_serializer = DagSerializer(result)
        serializer = DagSerializer(result, data=request.data, partial=True)

        if serializer.is_valid():
            # remove existing dag
            dag_name = check_serializer.data['dag_name']
            file_to_rem = pathlib.Path("{}{}.py".format(self.output, dag_name))
            file_to_rem.unlink()

            serializer.save()

            # init dynamic dag class
            dynamic_dag = DynamicDag(output=self.output, template=self.template)
            # create dag
            dynamic_dag.new_dag(request.data['dag_name'], request.data['dag_id'], request.data['parquet_path'],
                                request.data['data_source_name'], request.data['schedule_interval'],
                                request.data['path'])

            return Response({"status": "success", "data": serializer.data})
        else:
            return Response({"status": "error", "data": serializer.errors})

            # delete dag and dynamically remove file frome the airflow dags folder

class DeleteProcess(APIView):

    permission_classes = [AllowAny]

    # dynamic dag template
    template = "airflow/gdags/template.py"

    # dynamic dag output
    output = "../airflow/dags/"

    def delete(self, request, id=None):
        result = get_object_or_404(Dag, id=id)
        serializer = DagSerializer(result)

        file_to_rem = pathlib.Path("{}{}.py".format(self.output, serializer.data['dag_name']))
        file_to_rem.unlink()

        result.delete()
        return Response({"status": "success", "data": "Record Deleted"})

class CreateProcess(APIView):

    permission_classes = [AllowAny]

    # dynamic dag template
    template = "airflow/gdags/template.py"

    # dynamic dag output
    output = "../airflow/dags/"

    def post(self, request):
        serializer = DagSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            # init dynamic dag class
            dynamic_dag = DynamicDag(output=self.output, template=self.template)
            # create dag
            dynamic_dag.new_dag(request.data['dag_name'], request.data['dag_id'], request.data['parquet_path'],
                                request.data['data_source_name'], request.data['schedule_interval'],
                                request.data['path'])

            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class GetProcess(APIView):
    
    permission_classes = [AllowAny]

    def get(self, request, id=None):
        if id:
            route = "{}/dags/{}".format(api, id)
            client = requests.get(route, auth=(username, password))

            route = "{}/dags/{}/dagRuns".format(api, id)
            runs = requests.get(route, json={}, auth=(username, password))

            respose = client.json()
            respose['runs'] = runs.json()['dag_runs']

            return Response({'status': 'success', "dag": respose}, status=200)

        route = "{}/dags".format(api)
        client = requests.get(route, auth=(username, password))
        return Response({'status': 'success', "dags": client.json()['dags']}, status=200)

class RunProcess(APIView):

    permission_classes = [AllowAny]

    def post(self, request, id=None):
        route = "{}/dags/{}/dagRuns".format(api, id)
        client = requests.post(route, json={}, auth=(username, password))
        return Response({'status': 'success', "message": "{} process start running!".format(id)}, status=200)

class RunDetailsProcessChain(APIView):

    permission_classes = [AllowAny]

    def get(self, request, id=None):
        route = "{}/dags/{}/dagRuns".format(api, id)
        client = requests.get(route, json={}, auth=(username, password))
        return Response({'status': 'success', "message": "{} process start running!".format(id)}, status=200)

class RequestEditProcess(APIView):

    permission_classes = [AllowAny]

    # dynamic dag output
    file = "../hop/data-orch.list"

    def get(self, request, dag_name=None):
        process = Dag.objects.get(dag_name=dag_name)
        file_path = 'file:///files/{}'.format(process.path)
        payload = {"names": [file_path]}
        
        edit_hop = EditProcess(file=self.file)
        edit_hop.request_edit(json.dumps(payload))

        return Response({"status": "success", "data": "Edit access granted!"}, status=status.HTTP_200_OK)