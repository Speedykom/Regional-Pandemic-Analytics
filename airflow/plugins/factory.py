from airflow.plugins_manager import AirflowPlugin
from flask import Blueprint, request
from flask_appbuilder import expose, BaseView as AppBuilderBaseView
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from airflow.www.app import csrf

bp = Blueprint("factory_endpoint", __name__)


# Generate a DAG file (example.py) from config sent via REST API and jinja template "dag_template.jinja2"
def generate_dag(dag_conf):
    env = Environment(loader=FileSystemLoader("/opt/airflow/include"))
    template = env.get_template("templates/dag_template.jinja2")

    with open(f"dags/{dag_conf['dag_id']}.py", "w") as f:
        f.write(template.render(dag_conf))


def update_dag(old_pipeline, new_pipeline, dag):
    print("AAAAAAAAAAAAAAAAAAAAA", old_pipeline, new_pipeline, dag)
    with open(f"dags/{dag}.py", "r") as f:
        content = f.read()
    content = content.replace(old_pipeline, new_pipeline)
    with open(f"dags/{dag}.py", "w") as f:
        f.write(content)


class Factory(AppBuilderBaseView):
    default_view = "factory"

    @expose("/", methods=["GET", "POST", "PUT"])
    @csrf.exempt
    def factory(self):
        if request.method == "POST":
            generate_dag(request.json["dag_conf"])
            return {"Status": "Success"}
        elif request.method == "PUT":
            update_dag(
                request.json["old_pipeline"],
                request.json["new_pipeline"],
                request.json["dag"],
            )
            return {"Status": "Success"}
        return "AA"


v_appbuilder_view = Factory()
v_appbuilder_package = {"view": v_appbuilder_view}


class AirflowFactoryPlugin(AirflowPlugin):
    name = "factory_endpoint"
    flask_blueprints = [bp]
    appbuilder_views = [v_appbuilder_package]
