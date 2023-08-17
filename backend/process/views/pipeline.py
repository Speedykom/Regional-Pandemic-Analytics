import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Pipeline
from ..serializers import PipelineSerializer
from ..gdags.hop import EditAccessProcess


class PipelineListView(APIView):
    keycloak_scopes = {
        'POST': 'pipeline:add',
        'GET': 'pipeline:read',
    }

    def get(self, request):
        cur_user = request.userinfo
        user_id = cur_user['sub']

        snippets = Pipeline.objects.filter(user_id=user_id)
        pipelines = PipelineSerializer(snippets, many=True)

        return Response({"status": "success", "data": pipelines.data}, status=status.HTTP_200_OK)

    def post(self, request):
        cur_user = request.userinfo
        user_id = cur_user['sub']

        path = request.data['path']
        name = request.data['name'].replace(
            " ", "-").replace(".hpl", "").lower()

        process = Pipeline.objects.filter(name=name, user_id=user_id)

        if (len(process) > 0):
            return Response({"status": "Fail", "message": "pipeline already exist with this name {}".format(name)}, status=409)

        file = open(path, "r")

        AIRFLOW_HOP_PIPELINES = os.getenv("AIRFLOW_HOP_PIPELINES")
        pipeline_name = f"..{AIRFLOW_HOP_PIPELINES}/{name}.hpl"
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


class PipelineDetailView(APIView):
    keycloak_scopes = {
        'GET': 'pipeline:read',
    }

    # dynamic dag output
    file = "../hop/data-orch.list"

    def get(self, request, id=None):
        pipeline = Pipeline.objects.get(id=id)

        if not pipeline:
            return Response({'status': "error", "message": "No pipeline found for this id {}".format(id)}, status=status.HTTP_404_NOT_FOUND)

        file_path = 'file:///files/{}'.format(pipeline.path)
        payload = {"names": [file_path]}

        edit_hop = EditAccessProcess(file=self.file)
        edit_hop.request_edit(json.dumps(payload))

        pipeline = PipelineSerializer(pipeline, many=False)

        return Response(pipeline.data, status=status.HTTP_200_OK)
