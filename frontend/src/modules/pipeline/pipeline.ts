// Need to use the React-specific entry point to import createApi
import { baseQuery } from "@/common/redux/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import { PipelineData, PipelineList, TemplateList } from "./interface";

export const PipelineApi = createApi({
  reducerPath: 'PipelineApi',
  baseQuery,
  tagTypes: ['pipelines'],
  endpoints: (builder) => ({
    getAllPipelines: builder.query<PipelineList, void>({
      query: () => '/pipeline/list',
      providesTags: ['pipelines'],
    }),
    getPipeline: builder.query<PipelineData, string>({
      query: (name) => `/pipeline/${name}`,
    }),
    templates: builder.query<TemplateList, void>({
      query: () => '/hop'
    }),
    createPipeline: builder.mutation<any, string>({
      query: (body) => ({
        url: '/pipeline',
        method: "POST",
        body: body,
      }),
      invalidatesTags: ['pipelines'],
    }),
    updatePipeline: builder.mutation<any, string>({
      query: (name) => ({
        url: `/pipeline/${name}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useGetAllPipelinesQuery,
  useGetPipelineQuery,
  useTemplatesQuery,
  useCreatePipelineMutation,
  useUpdatePipelineMutation,
} = PipelineApi;
