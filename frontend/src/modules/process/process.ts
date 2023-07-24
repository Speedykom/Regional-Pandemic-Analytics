// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react';
import { Process } from '../../common/redux/interface/process';
import { baseQuery } from '@/common/redux/api';

// Define a service using a base URL and expected endpoints
export const processApi = createApi({
  reducerPath: 'processApi',
  baseQuery,
  tagTypes: ['processes'],
  endpoints: (builder) => ({
    getProcessChains: builder.query<Process, void>({
      query: () => '/process/list',
      providesTags: ['processes'],
    }),
    getProcessChainById: builder.query<Process, string>({
      query: (id) => `/process/one/${id}`,
    }),
    updateProcessChainAction: builder.mutation<Process, string>({
      query: (id) => `/process/access/${id}`,
    }),
    runProcessChain: builder.mutation<Process, string>({
      query: (id) => ({
        url: `/process/run/${id}`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: ['processes'],
    }),
    deleteProcessChain: builder.mutation<Process, string>({
      query: (id) => ({
        url: `/process/delete/${id}`,
        method: 'DELETE',
        body: {},
      }),
      invalidatesTags: ['processes'],
    }),
    createProcessChain: builder.mutation<Process, string>({
      query: (body) => ({
        url: '/process',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['processes'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetProcessChainsQuery,
  useGetProcessChainByIdQuery,
  useRunProcessChainMutation,
  useCreateProcessChainMutation,
  useUpdateProcessChainActionMutation,
  useDeleteProcessChainMutation,
} = processApi;
