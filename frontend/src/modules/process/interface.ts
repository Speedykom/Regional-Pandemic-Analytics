export interface DagForm {
  name: string;
  id: string;
  pipeline: string;
  schedule_interval: string;
  description: string;
}

export interface DagDetails {
  dataset_success: boolean;
  name: string;
  dag_id: string;
  dag_display_name: string;
  data_source_name: string;
  start_date: any;
  schedule_interval: string;
  status: boolean;
  description: string;
  last_parsed_time: string;
  next_dagrun: string;
  next_dagrun_create_after: string;
  dataset_id: number;
  dataset_url: string;
  latest_dag_run_status?: string | null;
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

export interface DagDatasetResponse {
  dataset: {
    id: number;
    url: string;
  };
}

export interface DataSourceInfoResponse {
  name: string;
  properties: {
    created: string;
  };
  segments_count: number;
  total_size: number;
  last_segment: {
    dataSource: string;
    interval: string;
    version: string;
    loadSpec: {
      type: string;
      path: string;
    };
    dimensions: string[];
    metrics: string;
    shardSpec: {
      type: string;
      partitionNum: number;
      partitions: number;
    };
    binaryVersion: number;
    size: number;
    identifier: string;
  };
}
