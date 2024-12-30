import { createApi } from '@reduxjs/toolkit/query/react';
import {
  DagForm,
  DagDetailsResponse,
  DagRunsResponse,
  DagPipelineResponse,
  DagPipelineRequest,
  DagRunTasksResponse,
  DagRunTasksRequest,
  DagDatasetResponse,
  DataSourceInfoResponse,
} from '../../modules/process/interface';
import { baseQuery } from '@/common/redux/api';

export const processApi = createApi({
  reducerPath: 'processApi',
  baseQuery,
  tagTypes: ['process'],
  endpoints: (builder) => ({
    getDatasourceInfo: builder.query<DataSourceInfoResponse, string>({
      query: (datasource_id) => `/process/datasource/${datasource_id}/`,
      providesTags: ['process'],
    }),
    getProcess: builder.query<DagDetailsResponse, string>({
      query: (query) => `/process?query=${query}`,
      providesTags: ['process'],
    }),
    getProcessByTaskId: builder.query<DagDetailsResponse, string>({
      query: (taskId) => `/process?taskId=${taskId}`,
      providesTags: ['process'],
    }),
    getDatasetInfo: builder.query<DagDatasetResponse, string>({
      query: (dag_id) => `/process/${dag_id}/dataset`,
    }),
    createProcess: builder.mutation<void, DagForm>({
      query: (dagForm) => ({
        url: '/process',
        method: 'POST',
        body: { ...dagForm },
      }),
      invalidatesTags: ['process'],
    }),
    getProcessPipelineById: builder.query<DagPipelineResponse, string>({
      query: (dag_id) => ({
        url: `/process/${dag_id}`,
      }),
    }),
    updateProcessPipelineById: builder.mutation<void, DagPipelineRequest>({
      query: ({ old_pipeline, new_pipeline, dag_id }) => ({
        url: `/process/${dag_id}`,
        body: { old_pipeline, new_pipeline },
        method: 'POST',
      }),
      invalidatesTags: ['process'],
    }),
    toggleProcessStatus: builder.mutation<void, string>({
      query: (dag_id) => ({
        url: `/process/${dag_id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['process'],
    }),
    getProcessHistoryById: builder.query<DagRunsResponse, string>({
      query: (dag_id) => `/process/${dag_id}/dagRuns`,
      providesTags: ['process'],
    }),
    getProcessHistoryTasksbyId: builder.query<
      DagRunTasksResponse,
      DagRunTasksRequest
    >({
      query: ({ dag_id, dag_run_id }) =>
        `/process/${dag_id}/dagRuns/${dag_run_id}/taskInstances`,
    }),
    runProcessById: builder.mutation<void, string>({
      query: (dag_id) => ({
        url: `/process/${dag_id}/dagRuns`,
        method: 'POST',
      }),
      invalidatesTags: ['process'],
    }),
  }),
});

export const {
  useGetDatasourceInfoQuery,
  useGetProcessQuery,
  useGetProcessByTaskIdQuery,
  useCreateProcessMutation,
  useGetDatasetInfoQuery,
  useGetProcessPipelineByIdQuery,
  useUpdateProcessPipelineByIdMutation,
  useToggleProcessStatusMutation,
  useGetProcessHistoryByIdQuery,
  useGetProcessHistoryTasksbyIdQuery,
  useRunProcessByIdMutation,
} = processApi;
