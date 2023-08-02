export interface PipelineData {
    id: string;
    name: string;
    description: string;
    parquet_path: string;
    path: string;
    user_id: string;
}

export type PipelineList = {
    status: string;
    data: Array<PipelineData>
}


