from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta
import logging

task_logger = logging.getLogger('airflow.task')

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime.now(),
}

with DAG('restore_minio_db',default_args=default_args,description='Restore minio database',schedule_interval=None) as dag:
    task_logger.debug('Setting up components of DAG')
    
    restore_minio_db_task = BashOperator(
        task_id='restore_minio_db_task',
        bash_command='$AIRFLOW_HOME/minio_db/restore_minio.sh ',
    )

    restore_minio_db_task
