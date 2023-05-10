import json
import os
import shutil
import fileinput

dag_template_filename = "src/dag-template.py"

def new_dag(dag_name, dag_id, schedule_interval, pipeline_path):
    new_filename = "../airflow/dags/" + dag_name + ".py"
    shutil.copyfile(dag_template_filename, new_filename)

    path = "$" + "{" + "PROJECT_HOME" + "}" + pipeline_path

    with fileinput.input(new_filename, inplace=True) as file:
        for line in file:
            new_line = (
                line.replace("dag_id", "'{}'".format(dag_id))
                .replace("scheduleinterval", "'{}'".format(schedule_interval))
                .replace("pipeline_path", "'{}'".format(path))
            )
            print(new_line, end="")


# from src import new_dag

# new_dag("ebola_pipeline_schedular", "ebola-pipe-schedular", '@daily', "/ebola/covid.hpl")
# new_dag("ebola_pipeline_schedular_2", "ebola-pipeline-schedular", '@daily', "/ebola/covid.hpl")