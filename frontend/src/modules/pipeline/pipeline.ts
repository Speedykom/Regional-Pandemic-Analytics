// Need to use the React-specific entry point to import createApi
import { baseQuery } from '@/common/redux/api';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  PipelineData,
  PipelineDeleteRequest,
  PipelineList,
  TemplateList,
} from './interface';

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
  useDeletePipelineMutation,
} = pipelineApi;
