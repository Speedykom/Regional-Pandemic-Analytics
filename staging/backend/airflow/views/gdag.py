import pathlib
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Dag
from ..serializers import DagSerializer
from ..gdags.dynamic import DynamicDag

class DagView(APIView):
    # dynamic dag template
    template = "airflow/gdags/template.py"

    # dynamic dag output
    output = "../airflow/dags/"

    # get all or one dag
    def get(self, request, id=None):
        if id:
            result = Dag.objects.get(id=id)
            serializer = DagSerializer(result)
            return Response({'success': 'success', "dag": serializer.data}, status=200)

        result = Dag.objects.all()
        serializers = DagSerializer(result, many=True)
        return Response({'status': 'success', "dags": serializers.data}, status=200)

        # create dag and dynamic schedule a dag for airflow

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

    def delete(self, request, id=None):
        result = get_object_or_404(Dag, id=id)
        serializer = DagSerializer(result)

        file_to_rem = pathlib.Path("{}{}.py".format(self.output, serializer.data['dag_name']))
        file_to_rem.unlink()

        result.delete()
        return Response({"status": "success", "data": "Record Deleted"})
