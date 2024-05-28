// Need to use the React-specific entry point to import createApi
import { baseQuery } from '@/common/redux/api';
import { createApi } from '@reduxjs/toolkit/query/react';
import { PipelineData, PipelineList, TemplateList } from './interface';

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

    getAllTemplates: builder.query<TemplateList, string>({
      query: (query) => `/pipeline/template/${query}`,
    }),
    uploadTemplate: builder.mutation<
      { status: string; message?: string },
      string
    >({
      query: (name) => ({
        url: `/pipeline/template/`,
        method: 'POST',
        body: { name },
      }),
    }),
  }),
});

export const {
  useGetAllPipelinesQuery,
  useGetPipelineQuery,
  useDownloadPipelineQuery,
  useCreatePipelineMutation,
  useUploadPipelineMutation,
  useUpdatePipelineMutation,
  useGetAllTemplatesQuery,
  useUploadTemplateMutation,
} = pipelineApi;
