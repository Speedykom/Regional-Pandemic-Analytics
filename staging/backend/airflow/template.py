from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.docker_operator import DockerOperator
from airflow.operators.bash import BashOperator
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.python_operator import PythonOperator
from docker.types import Mount
import requests

pwd = "/home/igad/Regional-Pandemic-Analytics/staging"

pipelines = "{}/hop/pipelines".format(pwd)
storage = "{}/storage".format(pwd)
config = "{}/hop/hop-config.json".format(pwd)
plugins = "{}/hop/plugins/transforms/googlesheets".format(pwd)

default_args = {
    'owner': 'airflow',
    'description': dag_id,
    'depend_on_past': False,
    'start_date': datetime(2023, 3, 24),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

# Ingest to druid
def ingest():
    url = 'http://89.58.44.88:8081/druid/indexer/v1/task'
    payload = {
      "type": "index_parallel",
      "spec": {
        "ioConfig": {
          "type": "index_parallel",
          "inputSource": {
            "type": "local",
            "baseDir": parquet_path,
            "filter": "*.parquet"
          },
          "inputFormat": {
            "type": "parquet"
          }
        },
        "tuningConfig": {
          "type": "index_parallel",
          "partitionsSpec": {
            "type": "dynamic"
          }
        },
        "dataSchema": {
          "dataSource": data_source_name,
          "timestampSpec": {
            "column": "Date",
            "format": "millis"
          },
          "dimensionsSpec": {
            "dimensions": [
              "FullyVaccinated",
              {
                "type": "long",
                "name": "NewDeaths"
              },
              "STATE",
              "Latitude",
              {
                "type": "long",
                "name": "NewRecoveries"
              },
              {
                "type": "long",
                "name": "TotalCases"
              },
              "Code",
              "Longitude",
              "TotalDoses",
              {
                "type": "long",
                "name": "TotalRecoveries"
              },
              "Population",
              {
                "type": "long",
                "name": "NewCases"
              },
              {
                "type": "long",
                "name": "TotalDeaths"
              },
              {
                "type": "long",
                "name": "DailyTests"
              }
            ]
          },
          "granularitySpec": {
            "queryGranularity": "none",
            "rollup": False,
            "segmentGranularity": "day"
          }
        }
      }
    }
    client = requests.post(url, json = payload)
    print("Done!")

with DAG(dag_id, default_args=default_args, schedule_interval=scheduleinterval, catchup=False, is_paused_upon_creation=False) as dag:
    start_task = DummyOperator(
        task_id='start_task'
    )
    # Run Hop pipeline
    hop = DockerOperator(
        task_id='hop_task',
        image='apache/hop',
        container_name=dag_id,
        api_version='auto',
        auto_remove=True,
        host_tmp_dir='/files',
        mount_tmp_dir=False,
        user = '0:0',
        privileged = True,
        environment={
            'HOP_LOG_LEVEL': 'Basic',
            'HOP_FILE_PATH': pipeline_path,
            'HOP_PROJECT_FOLDER': '/files',
            'HOP_PROJECT_NAME': 'igad',
            'HOP_ENVIRONMENT_NAME': 'prod',
            'HOP_ENVIRONMENT_CONFIG_FILE_NAME_PATHS': '/files/prod-config.json',
            'HOP_RUN_CONFIG': 'local',
        },
        docker_url='unix://var/run/docker.sock',
        network_mode='host',
        mounts = [
          Mount(source=storage, target='/home', type='bind'),
          Mount(source=pipelines, target='/files', type='bind'),
          Mount(source=plugins, target='/opt/hop/hop/plugins/transforms/googlesheets', type='bind'), 
          Mount(source=config, target='/opt/hop/hop/config/hop-config.json', type='bind')
        ],
        force_pull = False
    )
    # Run Druid ingection
    druid_dag = PythonOperator(
        task_id='druid_dag',
        python_callable=ingest
    )
    end_task = DummyOperator(
        task_id='end_task'
    )
    start_task >> hop >> druid_dag >> end_task