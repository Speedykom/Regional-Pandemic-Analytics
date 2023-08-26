// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/common/redux/api';
import { Process } from '../../common/redux/interface/process';
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
    // GET PUT DELETE dag by dag_id
    // getProcessById: builder.query<DagDetails, string>({
    //   query: (dag_id) => `/process/${dag_id}`,
    // }),
    // GET POST dag_run
    getProcessHistoryById: builder.query<DagRunsResponse, string>({
      query: (dag_id) => `/process/${dag_id}/dagRuns`,
    }),
    createProcessChain: builder.mutation<Process, string>({
      query: (body) => ({
        url: '/process',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetProcessQuery,
  useCreateProcessMutation,
  useGetProcessHistoryByIdQuery,
} = processApi;
