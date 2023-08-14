import requests
import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import ProcessChain, Pipeline
from ..serializers import ProcessChainSerializer, PipelineSerializer
from rest_framework.permissions import AllowAny
from ..gdags.dynamic import DynamicDag

api = os.getenv("AIRFLOW_API")
username = os.getenv("AIRFLOW_USER")
password = os.getenv("AIRFLOW_PASSWORD")

coordinator_api = os.getenv("COORDINATOR_API")

class ProcessListView(APIView):
    keycloak_scopes = {
        'GET': 'process:read',
        'POST': 'process:add'
    }

    template = "process/gdags/template.py"

    # dynamic dag output
    output = "../airflow/dags/"

    def get(self, request, dag_id=None):

        cur_user = request.userinfo
        user_id = cur_user['sub']

        if dag_id:
            process = ProcessChain.objects.filter(
                dag_id=dag_id, user_id=user_id)

            if (len(process) <= 0):
                return Response({'status': 'Fail', "message": "No process found for this dag_id {}".format(dag_id)}, status=404)

            route = "{}/dags/{}".format(api, dag_id)
            client = requests.get(route, auth=(username, password))

            res_status = client.status_code

            if (res_status == 404):
                return Response({'status': 'Fail', "message": client.json()['detail']}, status=res_status)

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
            print(route)
            print(username)
            print(password)
            dag = requests.get(route, auth=(username, password))
            res_status = dag.status_code

            if (res_status == 200):
                process['airflow'] = dag.json()
            elif (res_status == 404):
                process['airflow'] = None

            processes.append(process)

        return Response({'status': 'success', "dags": processes}, status=200)

    def post(self, request):
        cur_user = request.userinfo

        pipeline_id = request.data['pipeline']
        snippets = Pipeline.objects.filter(id=pipeline_id)

        if (len(snippets) < 0):
            return Response({"status": "Fail", "message": "no pipeline exist with this pipeline id {}".format(pipeline_id)}, status=409)

        pipeline_serializer = PipelineSerializer(snippets[0])
        pipeline = pipeline_serializer.data

        dag_id = request.data['name'].replace(" ", "-").lower()
        user_id = cur_user['sub']

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
            dynamic_dag = DynamicDag(
                output=self.output, template=self.template)

            # create dag
            dynamic_dag.new_dag(request.data['dag_id'], request.data['dag_id'], request.data['parquet_path'],
                                request.data['data_source_name'], request.data['schedule_interval'],
                                request.data['path'])

            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "Fail", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ProcessDetailView(APIView):
    keycloak_scopes = {
        'GET': 'process:read',
        'POST': 'process:run',
        'DELETE': 'process:delete'
    }

    def get(self, request, id=None):
        route = "{}/dags/{}/dagRuns".format(api, id)
        client = requests.get(route, json={}, auth=(username, password))

        res_status = client.status_code

        if (res_status == 404):
            return Response({'status': 'Fail', "message": client.json()['detail']}, status=res_status)
        else:
            return Response({'status': 'success', "message": client.json()['dag_runs'].format(id)}, status=200)

    def post(self, request, id=None):
        route = "{}/dags/{}/dagRuns".format(api, id)
        client = requests.post(route, json={}, auth=(username, password))

        res_status = client.status_code

        if (res_status == 404):
            return Response({'status': 'Fail', "message": "No process found for this dag_id {}".format(id)}, status=res_status)
        else:
            return Response({'status': 'success', "message": "{} process start running!".format(id)}, status=res_status)

    def delete(self, request, dag_id=None):
        process = ProcessChain.objects.get(dag_id=dag_id)
        process.state = 'inactive'
        process.save()
        return Response({"status": "success", "data": "Record Deleted"})


class AirflowDetailView(APIView):
    keycloak_scopes = {
        'GET': 'process:read',
        'POST': 'process:run',
        'DELETE': 'process:delete'
    }

    def get(self, request, dag_id=None):
        route = "{}/dags/{}/dagRuns".format(api, dag_id)
        client = requests.get(route, json={}, auth=(username, password))

        res_status = client.status_code

        if (res_status == 404):
            return Response({'status': 'Fail', "message": client.json()['detail']}, status=res_status)
        else:
            return Response({'status': 'success', "runs": client.json()['dag_runs']}, status=200)


class UpdateHopChainView(APIView):
    template = "process/gdags/template.py"

    # dynamic dag output
    output = "../airflow/dags/"

    # keycloak_scopes = {
    #     'POST': 'process:edit'
    # }

    def post(self, request, id=None):
        process = ProcessChain.objects.get(id=id)
        serializer = ProcessChainSerializer(process)
        chain = serializer.data

        # Check if the new pipeline available
        pipeline_id = request.data['pipeline']
        pipeline = Pipeline.objects.filter(id=pipeline_id)

        if (len(pipeline) == 0):
            return Response({'status': 'fail', "message": 'No pipeline found for this id {}'.format(pipeline_id)}, status=404)

        snippets = pipeline[0]
        serializer = PipelineSerializer(snippets)

        new_pipeline = serializer.data

        # Check for old pipeline
        pipeline_id = chain['pipeline']
        pipeline = Pipeline.objects.filter(id=pipeline_id)

        if (len(pipeline) == 0):
            return Response({'status': 'fail', "message": 'No pipeline found for this id {}'.format(pipeline_id)}, status=404)

        snippets = pipeline[0]
        serializer = PipelineSerializer(snippets)
        old_pipeline = serializer.data

        # Save data
        process_chain = ProcessChain.objects.get(id=id)
        process_chain.pipeline = new_pipeline['id']
        process_chain.save()

        # Update dag
        # init dynamic dag class
        dynamic_dag = DynamicDag(
            output=self.output, template=self.template)

        dynamic_dag.change_pipeline(chain['dag_id'], old_pipeline['path'], new_pipeline['path'],
                                    old_pipeline['parquet_path'], new_pipeline['parquet_path'])

        return Response({'status': 'success', "message": "Pipeline change successfully"}, status=200)

class StepperDruidChainView(APIView):

    # keycloak_scopes = {
    #     'POST': 'process:edit'
    # }
    def post(self, request, id=None):

        template = "process/gdags/template.py"

        # dynamic dag output
        output = "../airflow/dags/"

        process = ProcessChain.objects.get(id=id)
        serializer = ProcessChainSerializer(process)
        chain = serializer.data

        # Update dag
        # init dynamic dag class
        dynamic_dag = DynamicDag(output, template)

        dynamic_dag.change_druid(
            chain['dag_id'], request.data['query'], request.data['rollup'],  request.data['segiment'])

        return Response({'status': 'success', "message": "Druid injection change successfully"}, status=200)
    def get(self, request, id=None):
        process = ProcessChain.objects.get(id=id)
        serializer = ProcessChainSerializer(process)
        chain = serializer.data

        route = "{}/druid/coordinator/v1/datasources/{}?full".format(coordinator_api, chain['data_source_name'])
        client = requests.get(route, json={})

        druid_state = client.json()

        route = "{}/druid/indexer/v1/tasks?datasource={}&createdTimeInterval=01_2022-01-01".format(coordinator_api, chain['data_source_name'])
        client = requests.get(route, json={})

        druid_state['tasks'] = client.json()

        return Response({'status': 'success', "data": druid_state}, status=200)

class SupersetStepperChainView(APIView):
    
    permission_classes = [AllowAny]

    def post(self, request, feed=None):
        print(request.body, "alert", feed)

        return Response({'status': 'success', "message": "Notify"}, status=200)
