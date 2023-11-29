from datetime import datetime, date
import requests
import os
from rest_framework.viewsets import ViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from typing import Tuple, Union
from utils.keycloak_auth import get_current_user_id, get_current_user_name

class AirflowInstance:
    url = os.getenv("AIRFLOW_API")
    username = os.getenv("AIRFLOW_USER")
    password = os.getenv("AIRFLOW_PASSWORD")

SupersetUrl = os.getenv("SUPERSET_BASE_URL")

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
        start_date,
        schedule_interval,
        status,
        description,
        last_parsed_time,
        next_dagrun,
        dataset_success,
        dataset_id,
        dataset_url
    ):
        self.name = name
        self.dag_id = dag_id
        self.data_source_name = data_source_name
        self.start_date = (start_date,)
        self.schedule_interval = schedule_interval
        self.status = status
        self.description = description
        self.last_parsed_time = last_parsed_time
        self.next_dagrun = next_dagrun
        self.dataset_success = dataset_success
        self.dataset_id = dataset_id
        self.dataset_url = dataset_url


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
        try:
            # Get username
            user_name = get_current_user_name(request)
            query = request.GET.get("query")
            # Get username
            user_name = get_current_user_name(request)

            # Define processes array to store Airflow response
            processes = []

            # Get the list of process chains defined in Airflow over REST API
            if query:
                # Get the list of process chains defined in Airflow over REST API
                airflow_response = requests.get(
                    f"{AirflowInstance.url}/dags",
                    auth=(AirflowInstance.username, AirflowInstance.password),
                    params={"dag_id_pattern": query},
                )
            else:
                airflow_response = requests.get(
                    f"{AirflowInstance.url}/dags",
                    auth=(AirflowInstance.username, AirflowInstance.password),
                )

            if airflow_response.ok:
                airflow_json = airflow_response.json()["dags"]
                # Only returns the dags which owners flag is the same as the username
                for dag in airflow_json:
                    if user_name in dag["owners"]:
                        airflow_start_date_response = requests.get(
                            f"{AirflowInstance.url}/dags/{dag['dag_id']}/details",
                            auth=(AirflowInstance.username, AirflowInstance.password),
                        )
                        dataset_info_success, dataset_info = self._get_dataset_info_internal(dag['dag_id'])
                        processes.append(
                            Dag(
                                dag["dag_id"],
                                dag["dag_id"],
                                dag["dag_id"],
                                airflow_start_date_response.json()["start_date"],
                                dag["schedule_interval"]["value"],
                                dag["is_paused"],
                                dag["description"],
                                dag["last_parsed_time"],
                                dag["next_dagrun"],
                                dataset_info_success,
                                dataset_info[0] if dataset_info != None else None,
                                dataset_info[1] if dataset_info != None else None
                            ).__dict__
                        )
                return Response({"dags": processes}, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"status": "failed", "message": "Internal Server Error"},
                    status=airflow_response.status_code,
                )
        except:
            return Response(
                {"status": "failed", "message": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create(self, request):
        try:
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

            # Checks if the process chain already exists or not
            route = f"{AirflowInstance.url}/dags/{new_dag_config.dag_id}"

            airflow_response = requests.get(
                route, auth=(AirflowInstance.username, AirflowInstance.password)
            )

            if airflow_response.ok:
                return Response(
                    {"message": "process chain already created"},
                    status=status.HTTP_409_CONFLICT,
                )

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
                return Response(
                    {"status": "failed", "message": "Internal Server Error"},
                    status=airflow_response.status_code,
                )
        except:
            return Response(
                {"status": "failed", "message": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

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
            return Response({"status": "success"})
        else:
            return Response({"status": "failed"}, status=airflow_response.status_code)

    def _get_dataset_info_internal(self, dag_id) -> Tuple[bool, Union[Tuple[int, str], None]]:
        route = f"{AirflowInstance.url}/dags/{dag_id}/dagRuns"

        get_runs_response = requests.get(
            route, auth=(AirflowInstance.username, AirflowInstance.password)
        )

        if not get_runs_response.ok:
            return [False, None]
        successful_runs = sorted(
            [dag for dag in get_runs_response.json()["dag_runs"] if dag["state"] == "success"],
            key=lambda r: r["end_date"],
            reverse=True
        )

        if len(successful_runs) == 0:
            return [True, None]
        last_run_id = successful_runs[0]["dag_run_id"]
        get_dataset_id_route = f"{AirflowInstance.url}/dags/{dag_id}/dagRuns/{last_run_id}/taskInstances/link_dataset_to_superset/xcomEntries/superset_dataset_id"
        get_dataset_id_response = requests.get(
            get_dataset_id_route,
            auth=(AirflowInstance.username, AirflowInstance.password)
        )
        get_dataset_url_route = f"{AirflowInstance.url}/dags/{dag_id}/dagRuns/{last_run_id}/taskInstances/link_dataset_to_superset/xcomEntries/superset_dataset_url"
        get_dataset_url_response = requests.get(
            get_dataset_url_route,
            auth=(AirflowInstance.username, AirflowInstance.password)
        )

        if not (get_dataset_id_response.ok and get_dataset_url_response.ok):
            return [False, None]

        dataset_id = int(get_dataset_id_response.json()["value"])
        dataset_url = get_dataset_url_response.json()["value"]

        return [
            True,
            [
                dataset_id,
                f"${SupersetUrl}{dataset_url}"
            ]
        ]

    def get_dataset_info(self, request, dag_id) -> Response:
        success, dataset = self._get_dataset_info_internal(dag_id)
        if not success:
            return Response({"status": "failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({
            "status": "success",
            "dataset": None if dataset == None else { "id": dataset[0], "url": dataset[1] }
        }, status=status.HTTP_200_OK)

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
