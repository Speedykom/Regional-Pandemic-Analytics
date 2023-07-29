from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.docker_operator import DockerOperator
from airflow.operators.bash import BashOperator
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.python_operator import PythonOperator
from airflow_hop.operators import HopPipelineOperator
from docker.types import Mount
import requests
import os


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
    url = "{}/druid/indexer/v1/task".format(DRUID_COORDINATOR_URL)
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
            "dimensions": []
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
    hop = HopPipelineOperator(
      task_id=pipeline_name,
      pipeline=pipeline_path,
      pipe_config='remote hop server',
      project_name='default',
      log_level='Basic'
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