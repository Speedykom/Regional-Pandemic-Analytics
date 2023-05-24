from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator
from docker.types import Mount
default_args = {
    'owner': 'airflow',
    'description': 'basic-pipeline-scheduler',
    'depend_on_past': False,
    'start_date': datetime(2022, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

with DAG('basic-pipeline-scheduler', default_args=default_args, schedule_interval='@hourly', catchup=False, is_paused_upon_creation=False) as dag:
    start_dag = DummyOperator(
        task_id='start_dag'
    )
    end_dag = DummyOperator(
        task_id='end_dag'
    )
    start_dag >> end_dag