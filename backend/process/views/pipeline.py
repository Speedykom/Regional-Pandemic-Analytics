import requests
import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..models import Pipeline
from ..serializers import PipelineSerializer
from ..gdags.dynamic import DynamicDag
from ..gdags.hop import EditAccessProcess
from utils.keycloak_auth import me

# api = os.getenv("AIRFLOW_API")
# username = os.getenv("AIRFLOW_USER")
# password = os.getenv("AIRFLOW_PASSWORD")

# class EditProcess(APIView):

#     permission_classes = [AllowAny]

#     # dynamic dag template
#     template = "process/gdags/template.py"

#     # dynamic dag output
#     output = "../airflow/dags/"

#     # edit dag and dynamically edit dag file
#     def patch(self, request, id):
#         result = ProcessChain.objects.get(id=id)
#         check_serializer = ProcessChainSerializer(result)
#         serializer = ProcessChainSerializer(result, data=request.data, partial=True)

#         if serializer.is_valid():
#             # remove existing dag
#             dag_id = check_serializer.data['dag_id']
#             file_to_rem = pathlib.Path("{}{}.py".format(self.output, dag_id))
#             file_to_rem.unlink()

#             serializer.save()

#             # init dynamic dag class
#             dynamic_dag = DynamicDag(output=self.output, template=self.template)
#             # create dag
#             dynamic_dag.new_dag(request.data['dag_id'], request.data['dag_id'], request.data['parquet_path'],
#                                 request.data['data_source_name'], request.data['schedule_interval'],
#                                 request.data['path'])

#             return Response({"status": "success", "data": serializer.data})
#         else:
#             return Response({"status": "error", "data": serializer.errors})

#             # delete dag and dynamically remove file frome the airflow dags folder

# class DeleteProcess(APIView):

#     permission_classes = [AllowAny]

#     def delete(self, request, dag_id=None):
#         process = ProcessChain.objects.get(dag_id=dag_id)
#         process.state = 'inactive'
#         process.save()
#         return Response({"status": "success", "data": "Record Deleted"})


# class CreateProcess(APIView):

#     permission_classes = [AllowAny]

#     # dynamic dag template
#     template = "process/gdags/template.py"

#     # dynamic dag output
#     output = "../airflow/dags/"

#     def post(self, request):
#         path = request.data['path']
#         name = request.data['dag_id'].replace(" ", "-").replace(".hpl", "").lower()

#         dag_id = name
#         process = ProcessChain.objects.filter(dag_id=dag_id)

#         if (len(process) > 0):
#             return Response({"status": "Fail", "message": "process already exist with this dag_id {}".format(dag_id)}, status=409)

#         file = open(path, "r")

#         pipeline_name = "../hop/pipelines/{}.hpl".format(name)
#         pipeline_path = "{}.hpl".format(name)
#         parquet_path = "/opt/shared/{}.parquet".format(name)

#         pipeline = open(pipeline_name,"w")
#         pipeline.write(file.read())
#         pipeline.close()
#         file.close()

#         request.data['path'] = pipeline_path
#         request.data['parquet_path'] = parquet_path
#         request.data['dag_id'] = name

#         serializer = ProcessChainSerializer(data=request.data)

#         if serializer.is_valid():

#             serializer.save()

#             # init dynamic dag class
#             dynamic_dag = DynamicDag(output=self.output, template=self.template)

#             # create dag
#             dynamic_dag.new_dag(request.data['dag_id'], request.data['dag_id'], request.data['parquet_path'],
#                                 request.data['data_source_name'], request.data['schedule_interval'],
#                                 request.data['path'])

#             return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
#         else:
#             return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class CreatePipeline(APIView):

    permission_classes = [AllowAny]

    # dynamic dag template
    template = "process/gdags/template.py"

    # dynamic dag output
    output = "../airflow/dags/"

    def post(self, request):
        cur_user = me(request)

        if (cur_user['is_authenticated'] == False):
            return Response(cur_user, status=cur_user["status"])

        user_id = cur_user['payload']['sub']

        path = request.data['path']
        name = request.data['name'].replace(
            " ", "-").replace(".hpl", "").lower()

        process = Pipeline.objects.filter(name=name, user_id=user_id)

        if (len(process) > 0):
            return Response({"status": "Fail", "message": "pipeline already exist with this name {}".format(name)}, status=409)

        file = open(path, "r")

        pipeline_name = "../hop/pipelines/{}.hpl".format(name)
        pipeline_path = "{}.hpl".format(name)
        parquet_path = "/opt/shared/{}.parquet".format(name)

        pipeline = open(pipeline_name, "w")
        pipeline.write(file.read())
        pipeline.close()
        file.close()

        request.data['path'] = pipeline_path
        request.data['parquet_path'] = parquet_path
        request.data['name'] = name
        request.data['user_id'] = user_id

        serializer = PipelineSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save()

            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class GetPipeline(APIView):

    permission_classes = [AllowAny]

    def get(self, request):
        cur_user = me(request)

        if (cur_user['is_authenticated'] == False):
            return Response(cur_user, status=cur_user["status"])

        user_id = cur_user['payload']['sub']

        snippets = Pipeline.objects.filter(user_id=user_id)
        pipelines = PipelineSerializer(snippets, many=True)

        return Response({"status": "success", "data": pipelines.data}, status=status.HTTP_200_OK)

# Request edit access
class RequestEditPipeline(APIView):

    permission_classes = [AllowAny]

    # dynamic dag output
    file = "../hop/data-orch.list"

    def get(self, request, id=None):
        pipeline = Pipeline.objects.filter(id=id)

        if (len(pipeline) <= 0): return Response({'status': 'success', "message": "No pipeline found for this id {}".format(id)}, status=404)

        file_path = 'file:///files/{}'.format(pipeline[0].path)
        payload = {"names": [file_path]}

        edit_hop = EditAccessProcess(file=self.file)
        edit_hop.request_edit(json.dumps(payload))

        return Response({"status": "success", "data": "Edit access granted!"}, status=status.HTTP_200_OK)
