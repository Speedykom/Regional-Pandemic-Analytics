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
    'backup_backend_db',
    default_args=default_args,
    description='Backup backend database',
    schedule_interval=os.getenv('DAG_SCHEDULE_BACKUP_BACKEND_DB', '@daily'),
    catchup=False,
    start_date=datetime(2025, 1, 1),
    is_paused_upon_creation=False
) as dag:
    task_logger.debug('Setting up components of DAG')

    backup_backend_db_task = BashOperator(
        task_id='backup_backend_db_task',
        bash_command='$AIRFLOW_HOME/backend_db/backup_backend.sh ',
    )

    backup_backend_db_task
