import { createApi } from '@reduxjs/toolkit/query/react';
import {
  DagForm,
  DagDetailsResponse,
  DagRunsResponse,
} from '../../modules/process/interface';
import { baseQuery } from '@/common/redux/api';

export const processApi = createApi({
  reducerPath: 'processApi',
  baseQuery,
  tagTypes: ['process'],
  endpoints: (builder) => ({
    getProcess: builder.query<DagDetailsResponse, void>({
      query: () => '/process',
      providesTags: ['process'],
    }),
    createProcess: builder.mutation<void, DagForm>({
      query: (dagForm) => ({
        url: '/process',
        method: 'POST',
        body: { ...dagForm },
      }),
      invalidatesTags: ['process'],
    }),
    getProcessPipelineById: builder.query<any, string>({
      query: (dag_id) => ({
        url: `/process/${dag_id}`,
      }),
    }),
    updateProcessPipelineById: builder.mutation<void, any>({
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
  useGetProcessQuery,
  useCreateProcessMutation,
  useGetProcessPipelineByIdQuery,
  useUpdateProcessPipelineByIdMutation,
  useToggleProcessStatusMutation,
  useGetProcessHistoryByIdQuery,
  useRunProcessByIdMutation,
} = processApi;
