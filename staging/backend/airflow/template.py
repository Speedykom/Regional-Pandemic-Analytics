from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.docker_operator import DockerOperator
from airflow.operators.bash import BashOperator
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.python_operator import PythonOperator
from docker.types import Mount
import requests

#/Volumes/Disk/Work/speedykom/Regional-Pandemic-Analytics
#/home/igad/Regional-Pandemic-Analytics/staging
dev = "/home/igad/Regional-Pandemic-Analytics/staging"

source = "{}/hop/pipelines".format(dev)

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
    print(client.text, "Done!")

with DAG(dag_id, default_args=default_args, schedule_interval=scheduleinterval, catchup=False, is_paused_upon_creation=False) as dag:
    start_task = DummyOperator(
        task_id='start_task'
    )
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
            'HOP_PROJECT_NAME': 'stack',
            'HOP_ENVIRONMENT_NAME': 'pro-config.json',
            'HOP_ENVIRONMENT_CONFIG_FILE_NAME_PATHS': '/files/pro-config.json',
            'HOP_RUN_CONFIG': 'local',
        },
        docker_url='unix://var/run/docker.sock',
        network_mode='host',
        mounts = [ Mount(source=source, target='/files', type='bind') ],
        force_pull = False
    )
    druid_dag = PythonOperator(
        task_id='druid_dag',
        python_callable=ingest
    )
    end_task = DummyOperator(
        task_id='end_task'
    )
    start_task >> hop >> druid_dag >> end_task