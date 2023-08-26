export interface DagForm {
  name: string;
  pipeline: string;
  schedule_interval: string;
}

export interface DagDetails {
  name: string;
  dag_id: string;
  data_source_name: string;
  schedule_interval: string;
  status: string;
}

export interface DagRun {
  dag_id: string;
  dag_run_id: string;
  status: string;
}

export interface DagDetailsResponse {
  dags: DagDetails[];
}

export interface DagRunsResponse {
  dag_runs: DagRun[];
}
