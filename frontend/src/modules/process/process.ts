// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/common/redux/api';
import { DagDetailsResponse, DagForm, DagRunsResponse } from './interface';

export const processApi = createApi({
  reducerPath: 'processApi',
  baseQuery,
  tagTypes: ['process'],
  endpoints: (builder) => ({
    // GET POST dags
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
    enableProcess: builder.mutation<void, string>({
      query: (dag_id) => ({
        url: `/process/${dag_id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['process'],
    }),
    // GET PUT DELETE dag by dag_id
    // getProcessById: builder.query<DagDetails, string>({
    //   query: (dag_id) => `/process/${dag_id}`,
    // }),
    // GET POST dag_run
    getProcessHistoryById: builder.query<DagRunsResponse, string>({
      query: (dag_id) => `/process/${dag_id}/dagRuns`,
    }),
  }),
});

export const {
  useGetProcessQuery,
  useCreateProcessMutation,
  useEnableProcessMutation,
  useGetProcessHistoryByIdQuery,
} = processApi;
