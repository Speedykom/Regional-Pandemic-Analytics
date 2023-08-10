// Need to use the React-specific entry point to import createApi
import { baseQuery } from "@/common/redux/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import { PipelineList, TemplateList } from "./interface";

export const PipelineApi = createApi({
  reducerPath: 'PipelineApi',
  baseQuery,
  tagTypes: ['pipelines'],
  endpoints: (builder) => ({
    findAll: builder.query<PipelineList, void>({
      query: () => '/pipeline/list',
      providesTags: ['pipelines'],
    }),
    templates: builder.query<TemplateList, void>({
      query: () => '/hop'
    }),
    editAccess: builder.mutation<any, string>({
      query: (id) => `/pipeline/access/${id}`,
    }),
    createPipeline: builder.mutation<any, string>({
      query: (body) => ({
        url: '/pipeline',
        method: "POST",
        body: body,
      }),
      invalidatesTags: ['pipelines'],
    }),
  }),
});

export const { useFindAllQuery, useTemplatesQuery, useCreatePipelineMutation, useEditAccessMutation } = PipelineApi;
