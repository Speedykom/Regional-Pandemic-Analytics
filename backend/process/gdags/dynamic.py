import json
import os
import shutil
import fileinput


class DynamicDag:
    def __init__(self, output, template):
        self.output = output
        self.template = template

    def new_dag(self, dag_name, dag_id, parquet_path, data_source_name, schedule_interval, pipeline_name):
        new_filename = self.output + dag_name + ".py"
        shutil.copyfile(self.template, new_filename)

        with fileinput.input(new_filename, inplace=True) as file:
            for line in file:
                new_line = (
                    line.replace("dag_id", "'{}'".format(dag_id))
                        .replace("parquet_path", "'{}'".format(parquet_path))
                        .replace("data_source_name", "'{}'".format(data_source_name))
                        .replace("scheduleinterval", "'{}'".format(schedule_interval))
                        .replace("pipeline_name", "'{}'".format(pipeline_name))
                        .replace("pipeline_path", "'{}'".format(pipeline_name))
                )
                print(new_line, end="")

    def change_pipeline(self, dag_name, pipeline_name, new_pipeline_name, pipeline_path, new_pipeline_path):
        filename = self.output + dag_name + ".py"

        with fileinput.input(filename, inplace=True) as file:
            for line in file:
                new_line = (
                    line.replace(pipeline_name, new_pipeline_name)
                    .replace(pipeline_path, new_pipeline_path)
                )
                print(new_line, end="")

    def change_druid(self, dag_name, query, rollup, segiment):
        filename = self.output + dag_name + ".py"

        with fileinput.input(filename, inplace=True) as file:
            for line in file:
                new_line = (
                    line.replace("none", query)
                    .replace("False", rollup)
                    .replace("day", segiment)
                )
                print(new_line, end="")
