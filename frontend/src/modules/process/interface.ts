export interface DagForm {
  name: string;
  pipeline: string;
  schedule_interval: string;
  description: string;
}

export interface DagDetails {
  name: string;
  dag_id: string;
  data_source_name: string;
  start_date: any;
  schedule_interval: string;
  status: string;
  description: string;
  last_parsed_time: string;
  next_dagrun: string;
  next_dagrun_create_after: string;
}

export interface DagRun {
  dag_id: string;
  dag_run_id: string;
  state: string;
}

export interface DagRunTask {
  task_id: string;
  state: string;
  start_date: string;
}

export interface DagDetailsResponse {
  dags: DagDetails[];
}

export interface DagRunsResponse {
  dag_runs: DagRun[];
}

export interface DagPipelineResponse {
  pipeline: string;
}

export interface DagPipelineRequest {
  old_pipeline: string;
  new_pipeline: string;
  dag_id: string;
}

export interface DagRunTasksRequest {
  dag_id: string;
  dag_run_id: string;
}

export interface DagRunTasksResponse {
  tasks: DagRunTask[];
}
