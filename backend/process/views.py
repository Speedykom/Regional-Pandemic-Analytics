from datetime import datetime, date
import requests
import os
import re
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

class DruidInstance:
    url = os.getenv("DRUID_URL")
    username = "admin"
    password = os.getenv("DRUID_ADMIN_PASSWORD")


SupersetUrl = os.getenv("SUPERSET_PUBLIC_URL")

class DruidSegment:
    def __init__(self, dataSource, interval, version, loadSpec, dimensions, metrics, shardSpec, binaryVersion, size, identifier):
        self.data_source = dataSource
        self.interval = interval
        self.version = version
        self.load_spec = loadSpec
        self.dimensions = dimensions.split(',') if isinstance(dimensions, str) else dimensions
        self.metrics = metrics.split(',') if isinstance(metrics, str) else metrics

        self.shard_spec = shardSpec
        self.binary_version = binaryVersion
        self.size = size
        self.identifier = identifier

    def to_dict(self):
        return self.__dict__


class DruidDataSource:
    def __init__(self, name, properties, segments):
        self.name = name
        self.properties = properties
        self.segments = [DruidSegment(
            dataSource=segment.get('dataSource'),
            interval=segment.get('interval'),
            version=segment.get('version'),
            loadSpec=segment.get('loadSpec'),
            dimensions=segment.get('dimensions'),
            metrics=segment.get('metrics'),
            shardSpec=segment.get('shardSpec'),
            binaryVersion=segment.get('binaryVersion'),
            size=segment.get('size'),
            identifier=segment.get('identifier')
        ).to_dict() for segment in segments]

    def to_dict(self):
        return {
            "name": self.name,
            "properties": self.properties,
            "segments": self.segments
        }



class DagDTO:
    factory_id = "FACTORY"

    def __init__(
        self,
        owner,
        description,
        user_id,
        dag_id,
        dag_display_name,
        date,
        schedule_interval,
        pipeline_name,
    ):
        self.owner = owner
        self.description = description
        self.user_id = user_id
        self.dag_id = dag_id
        self.dag_display_name = dag_display_name
        self.date = date
        self.schedule_interval = schedule_interval
        self.pipeline_name = pipeline_name


class Dag:
    def __init__(
        self,
        name,
        dag_id,
        dag_display_name,
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
        self.dag_display_name = dag_display_name
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

    def __init__(self):
        self.permitted_characters_regex = re.compile(r'^[^\s!@#$%^&*()+=[\]{}\\|;:\'",<>/?]*$')

    def list(self, request):
        """List process chains"""
        try:
            # Get request params
            query = request.GET.get("query")
            taskId = request.GET.get("taskId")

            # Get username
            user_name = get_current_user_name(request)

            # Define processes array to store Airflow response
            processes = []

            if query:
                # Filter by query
                # Get the list of process chains defined in Airflow over REST API
                airflow_dags_response = requests.get(
                    f"{AirflowInstance.url}/dags",
                    auth=(AirflowInstance.username, AirflowInstance.password),
                    params={"dag_id_pattern": query},
                )
            else:
                airflow_dags_response = requests.get(
                    f"{AirflowInstance.url}/dags",
                    auth=(AirflowInstance.username, AirflowInstance.password),
                )

            if airflow_dags_response.ok:
                airflow_json = airflow_dags_response.json()["dags"]
                for dag in airflow_json:
                    # Only returns the dags which owners flag is the same as the username
                    if user_name in dag["owners"]:
                        if taskId:
                            # Filter by Task
                            airflow_dag_tasks_response, dag_has_task = self._dag_has_task(dag, taskId)
                            if airflow_dag_tasks_response.ok:
                                if not dag_has_task:
                                    # Only return dags having the specified task
                                    continue
                            else:
                                return Response(
                                    {"status": "failed", "message": "Internal Server Error"},
                                    status=airflow_dag_tasks_response.status_code,
                                )

                        # Get the latest dagRun status
                        latest_dag_run_status = self._get_latest_dag_run_status(dag["dag_id"])

                        augmentedDag = self._augment_dag(dag)
                        augmentedDag["latest_dag_run_status"] = latest_dag_run_status
                        processes.append(augmentedDag)
                return Response({"dags": processes}, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"status": "failed", "message": "Internal Server Error"},
                    status=airflow_dags_response.status_code,
                )
        except:
            return Response(
                {"status": "failed", "message": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create(self, request):
        """Create a process chain"""
        try:
            # Create DagDTO object
            # Object contains config that will be passed to the dag factory to create new dag from templates
            new_dag_config = DagDTO(
                owner=get_current_user_name(request),
                description=request.data["description"],
                user_id=get_current_user_id(request),
                dag_display_name=request.data["name"],
                dag_id=request.data["id"],
                pipeline_name=request.data["pipeline"],
                schedule_interval=request.data["schedule_interval"],
                date=datetime.fromisoformat(request.data["date"]),
            )
            if not self.permitted_characters_regex.search(new_dag_config.dag_id):
                return Response(
                    {"status": "failed", "message": "DAG ID contains unpermitted characters"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not self.permitted_characters_regex.search(new_dag_config.pipeline_name):
                return Response(
                    {"status": "failed", "message": "Pipeline name contains unpermitted characters"},
                    status=status.HTTP_400_BAD_REQUEST
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
            pipeline_name_id = new_dag_config.pipeline_name.encode('idna').decode()
            airflow_response = requests.post(
                f"{airflow_internal_url}/factory",
                auth=(AirflowInstance.username, AirflowInstance.password),
                json={
                    "dag_conf": {
                        "owner": f"{new_dag_config.owner}",
                        "description": f"{new_dag_config.description}",
                        "user_id": f"{new_dag_config.user_id}",
                        "dag_id": f"{new_dag_config.dag_id}",
                        "dag_display_name": f"{new_dag_config.dag_display_name}",
                        "date": f"{new_dag_config.date.year}, {new_dag_config.date.month}, {new_dag_config.date.day}",
                        "schedule_interval": f"{new_dag_config.schedule_interval}",
                        "pipeline_display_name": f"{new_dag_config.pipeline_name}.hpl", #task display name
                        "pipeline_name": f"{pipeline_name_id}.hpl", #represents task id

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
        """Get process pipeline"""
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
        """update process chain pipeline"""
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
        """
        Endpoint to enable, disable process chain
        """
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

    def _augment_dag(self, dag):
        airflow_start_date_response = requests.get(
                            f"{AirflowInstance.url}/dags/{dag['dag_id']}/details",
                            auth=(AirflowInstance.username, AirflowInstance.password),
                        )
        dataset_info_success, dataset_info = self._get_dataset_info_internal(dag['dag_id'])
        augmentedDag= Dag(
                                dag["dag_id"],
                                dag["dag_id"],
                                dag["dag_id"],
                                dag["dag_display_name"],
                                airflow_start_date_response.json()["start_date"],
                                dag["schedule_interval"]["value"],
                                not dag["is_paused"],
                                dag["description"],
                                dag["last_parsed_time"],
                                dag["next_dagrun"],
                                dataset_info_success,
                                dataset_info[0] if dataset_info != None else None,
                                dataset_info[1] if dataset_info != None else None
                            ).__dict__

        return augmentedDag

    def _dag_has_task(self, dag, taskId):
        result = False
        route = f"{AirflowInstance.url}/dags/{dag['dag_id']}/tasks"
        airflow_dag_tasks_response = requests.get(
                        route,
                        auth=(AirflowInstance.username, AirflowInstance.password),
                    )
        if airflow_dag_tasks_response.ok:
            airflow_json = airflow_dag_tasks_response.json()["tasks"]
            for task in airflow_json:
                if (task["operator_name"] == "HopPipelineOperator") and (task["task_id"] == f"{taskId}.hpl"):
                    result=True
        return airflow_dag_tasks_response,result

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
                f"{SupersetUrl}{dataset_url}"
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

    def get_datasource_info(self, request, datasource_id=None):
        """Get data source information """
        if datasource_id is None:
            return Response({"error": "Datasource ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        druid_url = f"{DruidInstance.url}/druid/coordinator/v1/metadata/datasources/{datasource_id}"

        try:
            response = requests.get(druid_url, auth=(DruidInstance.username, DruidInstance.password), verify=False)
            response.raise_for_status()
        except requests.exceptions.ConnectionError:
            return Response({"error": "Failed to connect to Druid"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except requests.exceptions.Timeout:
            return Response({"error": "Request to Druid timed out"}, status=status.HTTP_504_GATEWAY_TIMEOUT)
        except requests.exceptions.RequestException as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if response.status_code == 200:
            data = response.json()

            segments_data = data.get("segments", [])
            if segments_data:
                segments_count = len(segments_data)  # Count the number of segments

                # Calculate the total size of all segments
                total_size = sum(segment['size'] for segment in segments_data) / 1000

                # Include only the newest segment
                last_segment_data = segments_data[segments_count - 1]
                dimensions = last_segment_data.get("dimensions", "")
                dimensions_list = dimensions.split(",") if dimensions else []

                last_segment = {
                    "dataSource": last_segment_data["dataSource"],
                    "interval": last_segment_data["interval"],
                    "version": last_segment_data["version"],
                    "loadSpec": last_segment_data["loadSpec"],
                    "dimensions": dimensions_list,
                    "metrics": last_segment_data["metrics"],
                    "shardSpec": last_segment_data["shardSpec"],
                    "binaryVersion": last_segment_data["binaryVersion"],
                    "size": last_segment_data["size"],
                    "identifier": last_segment_data["identifier"]
                }

                druid_data_source = {
                    "name": datasource_id,
                    "properties": data.get("properties", {}),
                    "segments_count": segments_count,
                    "total_size": total_size,
                    "last_segment": last_segment  # Return only newest
                }

                return Response(druid_data_source, status=status.HTTP_200_OK)
            else:
                return Response({"error": "No segments found for the given datasource ID"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Failed to retrieve data from Druid"}, status=response.status_code)

    def _get_latest_dag_run_status(self, dag_id):
        route = f"{AirflowInstance.url}/dags/{dag_id}/dagRuns"
        airflow_response = requests.get(
            route,
            auth=(AirflowInstance.username, AirflowInstance.password),
        )

        if not airflow_response.ok:
            return None

        dag_runs = airflow_response.json().get("dag_runs", [])
        if not dag_runs:
            return None

        # Sort dagRuns by execution date
        dag_runs = sorted(dag_runs, key=lambda x: x['execution_date'], reverse=True)
        return dag_runs[0].get('state') if dag_runs else None

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
        """Listing the dag-runs of a specific dag""" 
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
        """Endpoint to create a dag-run: run the dag"""
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

