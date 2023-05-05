from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.docker_operator import DockerOperator
from airflow.operators.bash import BashOperator
from airflow.operators.dummy_operator import DummyOperator
from docker.types import Mount

# change pwd to your project location
# dev server = /home/igad/Regional-Pandemic-Analytics
# /Volumes/Disk/Work/speedykom/IGAD
pwd = "/home/igad/Regional-Pandemic-Analytics/staging/"

source = "{}/hop/pipelines".format(pwd)

default_args = {
    'owner': 'airflow',
    'description': 'covid-pipeline-scheduler',
    'depend_on_past': False,
    'start_date': datetime(2023, 3, 24),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

with DAG('covid-pipeline-scheduler', default_args=default_args, schedule_interval='@daily', catchup=False, is_paused_upon_creation=False) as dag:
    start_dag = DummyOperator(
        task_id='start_dag'
    )
    end_dag = DummyOperator(
        task_id='end_dag'
    )
    hop = DockerOperator(
        task_id='covid_pipeline_scheduler',
        image='apache/hop',
        container_name='PipelineScheduler',
        api_version='auto',
        auto_remove=True,
        host_tmp_dir='files',
        mount_tmp_dir=False,
        user = '0:0',
        privileged = True,
        environment={
            'HOP_LOG_LEVEL': 'Basic',
            'HOP_FILE_PATH': '${PROJECT_HOME}/covid/covid.hpl',
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
    start_dag >> hop >> end_dag