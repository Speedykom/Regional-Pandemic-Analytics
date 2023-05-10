from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.docker_operator import DockerOperator
from airflow.operators.bash import BashOperator
from airflow.operators.dummy_operator import DummyOperator
from docker.types import Mount

dev = "/Volumes/Disk/Work/speedykom/stack-101"

source = "{}/hop/pipeline".format(dev)

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
        host_tmp_dir='/home/covid',
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
        force_pull = False,
        command=[
            "/bin/bash",
            "-c",
            "mkdir -p chmod 777 /home/covid"
            "chown -R '0:0' /home/covid"
        ]
    )
    end_task = DummyOperator(
        task_id='end_task'
    )
    start_task >> hop >> end_task