// Need to use the React-specific entry point to import createApi
import { baseQuery } from '@/common/redux/api';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  PipelineData,
  PipelineDeleteRequest,
  PipelineList,
  TemplateList,
} from './interface';
import { processApi } from '../process/process';

export const pipelineApi = createApi({
  reducerPath: 'pipelineApi',
  baseQuery,
  tagTypes: ['pipelines'],
  endpoints: (builder) => ({
    getAllPipelines: builder.query<PipelineList, string>({
      query: (query) => `/pipeline/list/${query}`,
      providesTags: ['pipelines'],
    }),
    getPipeline: builder.query<PipelineData, string>({
      query: (name) => `/pipeline/${name}`,
    }),
    downloadPipeline: builder.query<any, string>({
      query: (name) => `/pipeline/download/${name}`,
    }),
    templates: builder.query<TemplateList, string>({
      query: (query) => `/hop/${query}`,
    }),
    createPipeline: builder.mutation<any, string>({
      query: (body) => ({
        url: '/pipeline',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['pipelines'],
    }),
    uploadPipeline: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/pipeline/upload/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['pipelines'],
    }),
    updatePipeline: builder.mutation<
      { status: string; message?: string },
      string
    >({
      query: (name) => ({
        url: `/pipeline/${name}`,
        method: 'PUT',
      }),
      invalidatesTags: ['pipelines'],
    }),
    savePipelineAsTemplate: builder.mutation<
      { status: string; message?: string },
      string
    >({
      query: (name) => ({
        url: `/pipeline/save/${name}`,
        method: 'POST',
      }),
    }),
    deletePipeline: builder.mutation<
      { status: string; message?: string },
      PipelineDeleteRequest
    >({
      query: ({ name, dags }) => ({
        url: `/pipeline/delete/${name}`,
        body: { dags },
        method: 'DELETE',
      }),
      invalidatesTags: ['pipelines'],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(processApi.util.invalidateTags(['process']));
      },
    }),
  }),
});

export const {
  useGetAllPipelinesQuery,
  useGetPipelineQuery,
  useDownloadPipelineQuery,
  useTemplatesQuery,
  useCreatePipelineMutation,
  useUploadPipelineMutation,
  useUpdatePipelineMutation,
  useSavePipelineAsTemplateMutation,
  useDeletePipelineMutation,
} = pipelineApi;
