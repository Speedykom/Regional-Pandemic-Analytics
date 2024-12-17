export interface PipelineData {
  name: string;
  description: string;
  check_status: string;
  check_text: string;
  parquet_path: string;
  path: string;
  user_id: string;
  created: string;
}

export interface PipelineDeleteRequest {
  name: string;
  dags: string[];
}

export type PipelineList = {
  status: string;
  data: Array<PipelineData>;
};

export interface Template {
  name: string;
  path: string;
}

export type TemplateList = {
  status: string;
  data: Array<Template>;
};
