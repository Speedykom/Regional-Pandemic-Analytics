from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.docker_operator import DockerOperator
from airflow.operators.bash import BashOperator
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.python_operator import PythonOperator
from docker.types import Mount
from minio import Minio
import requests
import os

ENVIRONMENT = os.getenv("ENVIRONMENT")
DRUID_COORDINATOR_URL = os.getenv("DRUID_COORDINATOR_URL")

pipelines = "{}/hop/pipelines".format(ENVIRONMENT)
storage = "{}/storage".format(ENVIRONMENT)
config = "{}/hop/hop-config.json".format(ENVIRONMENT)
plugins = "{}/hop/plugins/transforms/googlesheets".format(ENVIRONMENT)

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

# Upload parquet_path
def upload_to_minio():
    MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
    MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
    MINIO_BUCKET = os.getenv("MINIO_BUCKET")

    client = Minio(
        "storage:9000",
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=False
    )

    # Make 'asiatrip' bucket if not exist.
    found = client.bucket_exists(MINIO_BUCKET)

    if not found:
        client.make_bucket(MINIO_BUCKET)
    else:
        print("Bucket {} already exists".format(MINIO_BUCKET))

    res = client.fput_object(
        MINIO_BUCKET, fine_name, parquet_path
    )
    print(res, "Parquet file uploaded successfully !!!")

# Ingest to druid
def ingest_druid_data():
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
    client = requests.post(url, json=payload)
    print("Done!!!")


with DAG(dag_id, default_args=default_args, schedule_interval=scheduleinterval, catchup=False, is_paused_upon_creation=False) as dag:
    start_task = DummyOperator(
        task_id='start_task'
    )
    # Run Hop pipeline
    hop_task = DockerOperator(
        task_id='hop_task',
        image='apache/hop',
        container_name=dag_id,
        api_version='auto',
        auto_remove=True,
        host_tmp_dir='/files',
        mount_tmp_dir=False,
        user='0:0',
        privileged=True,
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
        mounts=[
            Mount(source=storage, target='/home', type='bind'),
            Mount(source=pipelines, target='/files', type='bind'),
            Mount(source=plugins,
                  target='/opt/hop/hop/plugins/transforms/googlesheets', type='bind'),
            Mount(source=config,
                  target='/opt/hop/hop/config/hop-config.json', type='bind')
        ],
        force_pull=False
    )
    inject_task = PythonOperator(
        task_id='inject_task',
        python_callable=ingest_druid_data
    )
    upload_task = PythonOperator(
        task_id='upload_task',
        python_callable=upload_to_minio
    )
    end_task = DummyOperator(
        task_id='end_task'
    )
    start_task >> hop_task >> upload_task >> inject_task >> end_task
