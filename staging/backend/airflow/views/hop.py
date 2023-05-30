import pathlib
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from ..models import Dag
from ..serializers import DagSerializer
from ..gdags.hop import EditPipeline

class HopView(APIView):

    permission_classes = [AllowAny]

    # dynamic dag output
    file = "../hop/data-orch.list"

    def post(self, request, id=None):
        pipeline = request.data["path"]
        edit_hop = EditPipeline(file=self.file)
        edit_hop.request_edit(pipeline)
        return Response({"status": "success", "data": "Edit access granted!"}, status=status.HTTP_200_OK)

class HopView(APIView):

    permission_classes = [AllowAny]

    # dynamic dag output
    file = "../hop/data-orch.list"

    def post(self, request, id=None):
        pipeline = request.data["path"]
        edit_hop = EditPipeline(file=self.file)
        edit_hop.request_edit(pipeline)
        return Response({"status": "success", "data": "Edit access granted!"}, status=status.HTTP_200_OK)
