from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta
import logging
import os

task_logger = logging.getLogger('airflow.task')

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2025, 1, 1),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    'backup_airflow_db',
    default_args=default_args,
    description='Backup airflow database',
    schedule_interval=os.getenv('DAG_SCHEDULE_BACKUP_AIRFLOW_DB', '@daily'),
    catchup=False,
    start_date=datetime(2025, 1, 1),
    is_paused_upon_creation=False
) as dag:
    task_logger.debug('Setting up components of DAG')

    backup_airflow_db_task = BashOperator(
        task_id='backup_airflow_db_task',
        bash_command='$AIRFLOW_HOME/airflow_db/backup_airflow.sh ',
    )

    backup_airflow_db_task
