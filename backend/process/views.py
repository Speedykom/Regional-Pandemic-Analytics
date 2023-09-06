from datetime import datetime, date
import requests
import os
from rest_framework.viewsets import ViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from utils.keycloak_auth import get_current_user_id, get_current_user_name


class AirflowInstance:
    url = os.getenv("AIRFLOW_API")
    username = os.getenv("AIRFLOW_USER")
    password = os.getenv("AIRFLOW_PASSWORD")


class DagDTO:
    factory_id = "FACTORY"

    def __init__(
        self,
        owner,
        description,
        user_id,
        dag_id,
        date,
        schedule_interval,
        pipeline_name,
    ):
        self.owner = owner
        self.description = description
        self.user_id = user_id
        self.dag_id = dag_id
        self.date = date
        self.schedule_interval = schedule_interval
        self.pipeline_name = pipeline_name


class Dag:
    def __init__(
        self,
        name,
        dag_id,
        data_source_name,
        schedule_interval,
        status,
        description,
        last_parsed_time,
        next_dagrun,
    ):
        self.name = name
        self.dag_id = dag_id
        self.data_source_name = data_source_name
        self.schedule_interval = schedule_interval
        self.status = status
        self.description = description
        self.last_parsed_time = last_parsed_time
        self.next_dagrun = next_dagrun


class DagRun:
    def __init__(self, dag_id, dag_run_id, state):
        self.dag_id = dag_id
        self.dag_run_id = dag_run_id
        self.state = state


class ProcessView(ViewSet):
    """
    This view handles Dag logic
        - list:
            Method: GET
            *** This method returns the list of dags ***
        - create:
            Method: POST
            *** This method creates a dag from user input ***
        - retrieve:
            Method: GET
            *** This method returns details of a specific dag ***
    """

    keycloak_scopes = {
        "GET": "process:read",
        "POST": "process:add",
        "PUT": "process:run",
        "DELETE": "process:delete",
    }

    def list(self, request):
        # Get username
        user_name = get_current_user_name(request)

        # Define processes array to store Airflow response
        processes = []

        # Get the list of process chains defined in Airflow over REST API
        airflow_response = requests.get(
            f"{AirflowInstance.url}/dags",
            auth=(AirflowInstance.username, AirflowInstance.password),
        )

        if airflow_response.ok:
            airflow_json = airflow_response.json()["dags"]
            # Only returns the dags which owners flag is the same as the username
            for dag in airflow_json:
                if user_name in dag["owners"]:
                    processes.append(
                        Dag(
                            dag["dag_id"],
                            dag["dag_id"],
                            dag["dag_id"],
                            dag["schedule_interval"]["value"],
                            dag["is_paused"],
                            dag["description"],
                            dag["last_parsed_time"],
                            dag["next_dagrun"],
                        ).__dict__
                    )
            return Response({"dags": processes}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "failed"}, status=airflow_response.status_code)

    def create(self, request):
        # Create DagDTO object
        # Object contains config that will be passed to the dag factory to create new dag from templates
        new_dag_config = DagDTO(
            owner=get_current_user_name(request),
            description=request.data["description"],
            user_id=get_current_user_id(request),
            dag_id=request.data["name"].replace(" ", "-").lower(),
            pipeline_name=request.data["pipeline"],
            schedule_interval=request.data["schedule_interval"],
            date=datetime.fromisoformat(request.data["date"]),
        )
        print(new_dag_config.date)

        # Run factory by passing config to create a process chain
        airflow_internal_url = AirflowInstance.url.removesuffix("/api/v1")
        airflow_response = requests.post(
            f"{airflow_internal_url}/factory",
            auth=(AirflowInstance.username, AirflowInstance.password),
            json={
                "dag_conf": {
                    "owner": f"{new_dag_config.owner}",
                    "description": f"{new_dag_config.description}",
                    "user_id": f"{new_dag_config.user_id}",
                    "dag_id": f"{new_dag_config.dag_id}",
                    "date": f"{new_dag_config.date.year}, {new_dag_config.date.month}, {new_dag_config.date.day}",
                    "schedule_interval": f"{new_dag_config.schedule_interval}",
                    "pipeline_name": f"{new_dag_config.pipeline_name}.hpl",
                }
            },
        )

        if airflow_response.ok:
            return Response({"status": "success"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"status": "failed"}, status=airflow_response.status_code)

    # Dag Pipeline
    def retrieve(self, request, dag_id=None):
        route = f"{AirflowInstance.url}/dags/{dag_id}/tasks"
        airflow_response = requests.get(
            route,
            auth=(AirflowInstance.username, AirflowInstance.password),
        )

        if airflow_response.ok:
            airflow_json = airflow_response.json()["tasks"]
            for task in airflow_json:
                if task["operator_name"] == "HopPipelineOperator":
                    return Response(
                        {"pipeline": task["task_id"]},
                        status=status.HTTP_200_OK,
                    )
        else:
            return Response({"status": "failed"}, status=airflow_response.status_code)

    def update(self, request, dag_id=None):
        old_pipeline = request.data["old_pipeline"]
        new_pipeline = request.data["new_pipeline"]

        airflow_internal_url = AirflowInstance.url.removesuffix("/api/v1")
        airflow_response = requests.put(
            f"{airflow_internal_url}/factory",
            auth=(AirflowInstance.username, AirflowInstance.password),
            json={
                "old_pipeline": f"{old_pipeline}",
                "new_pipeline": f"{new_pipeline}",
                "dag": f"{dag_id}",
            },
        )

        if airflow_response.ok:
            return Response({"status": "success"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"status": "failed"}, status=airflow_response.status_code)

    def partial_update(self, request, dag_id=None):
        route = f"{AirflowInstance.url}/dags/{dag_id}"

        airflow_response = requests.get(
            route, auth=(AirflowInstance.username, AirflowInstance.password)
        )
        is_paused = airflow_response.json()["is_paused"]

        airflow_response = requests.patch(
            route,
            auth=(AirflowInstance.username, AirflowInstance.password),
            json={"is_paused": not is_paused},
        )

        if airflow_response.ok:
            return Response({"status": "success"}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "failed"}, status=airflow_response.status_code)


class ProcessRunView(ViewSet):
    """
    This view handles Dag-Runs logic
        - list:
            Method: GET
            *** This method returns the list of dag-runs of a specific dag ***
        - create:
            Method: POST
            *** This method creates a dag-run: run the dag ***
    """

    keycloak_scopes = {
        "GET": "process:read",
        "POST": "process:run",
    }

    def list(self, request, dag_id=None):
        dag_runs = []

        route = f"{AirflowInstance.url}/dags/{dag_id}/dagRuns"
        airflow_response = requests.get(
            route,
            auth=(AirflowInstance.username, AirflowInstance.password),
            params={"limit": 5, "order_by": "-execution_date"},
        )

        airflow_json = airflow_response.json()["dag_runs"]
        if airflow_response.ok:
            for dag_run in airflow_json:
                dag_runs.append(
                    DagRun(
                        dag_id=dag_run["dag_id"],
                        dag_run_id=dag_run["dag_run_id"],
                        state=dag_run["state"],
                    ).__dict__
                )
            return Response({"dag_runs": dag_runs}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "failed"}, status=airflow_response.status_code)

    def create(self, request, dag_id=None):
        route = f"{AirflowInstance.url}/dags/{dag_id}/dagRuns"
        airflow_response = requests.post(
            route,
            auth=(AirflowInstance.username, AirflowInstance.password),
            json={},
        )

        if airflow_response.ok:
            return Response({"status": "success"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"status": "failed"}, status=airflow_response.status_code)

    def retrieve(self, request, dag_id=None, dag_run_id=None):
        route = (
            f"{AirflowInstance.url}/dags/{dag_id}/dagRuns/{dag_run_id}/taskInstances"
        )
        airflow_response = requests.get(
            route,
            auth=(AirflowInstance.username, AirflowInstance.password),
        )

        if airflow_response.ok:
            airflow_json = airflow_response.json()["task_instances"]
            tasks = []
            for task in airflow_json:
                tasks.append(
                    {
                        "task_id": task["task_id"],
                        "state": task["state"],
                        "start_date": task["start_date"],
                    }
                )

            return Response({"tasks": tasks}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "failed"}, status=airflow_response.status_code)
