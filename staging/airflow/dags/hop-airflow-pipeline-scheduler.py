from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.docker_operator import DockerOperator
from airflow.operators.bash import BashOperator
from airflow.operators.dummy_operator import DummyOperator
from docker.types import Mount

# change pwd to your project location
# dev server = /home/igad/Regional-Pandemic-Analytics
pwd = "/Volumes/Disk/Work/speedykom/Regional-Pandemic-Analytics/staging/hop"

pipelines = "{}/pipelines".format(pwd)
storage = "{}/storage".format(pwd)
config = "{}/hop-config.json".format(pwd)
plugins = "{}/plugins/transforms/googlesheets".format(pwd)

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
        container_name='covid_pipeline_scheduler',
        api_version='auto',
        auto_remove=True,
        host_tmp_dir='files',
        mount_tmp_dir=False,
        user = '0:0',
        privileged = True,
        environment={
            'HOP_LOG_LEVEL': 'Basic',
            'HOP_FILE_PATH': '${PROJECT_HOME}/covid/Covid.hpl',
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
    start_dag >> hop >> end_dag