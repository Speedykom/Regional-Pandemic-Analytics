from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from airflow import DAG
from airflow.operators.python_operator import PythonOperator

# Generate a DAG file (example.py) from config sent via REST API and jinja template "dag_template.jinja2"
def generate_dag(**context):
    env = Environment(loader=FileSystemLoader("/opt/airflow/include"))
    template = env.get_template('templates/dag_template.jinja2')
    
    config=context['dag_run'].conf['dag_conf']

    with open(f"dags/{config['dag_id']}.py","w") as f:
        f.write(template.render(config))

default_args = {
    'owner': 'airflow',
    'description': "Create Process chains over REST API",
    'depend_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'schedule_interval':None,
    'start_date':datetime(2023, 3, 24),
    'retries': 1,
}


dag = DAG(
    dag_id='FACTORY',
    default_args=default_args
    )

# Generate Dag
factory = PythonOperator(task_id='factory', python_callable=generate_dag, dag=dag)

factory

