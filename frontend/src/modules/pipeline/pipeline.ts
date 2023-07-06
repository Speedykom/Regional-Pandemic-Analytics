// Need to use the React-specific entry point to import createApi
import { prepareHeaders } from "@/common/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

// Define a service using a base URL and expected endpoints
export const pipelineApi = createApi({
  reducerPath: "pipelineApi",
  baseQuery: fetchBaseQuery({
    baseUrl: publicRuntimeConfig.NEXT_PUBLIC_BASE_URL,
    prepareHeaders,
    credentials: "include",
  }),
  tagTypes: ["pipelines"],
  endpoints: (builder) => ({
    findAll: builder.query<any, void>({
      query: () => "/api/pipeline/list",
      providesTags: ["pipelines"],
    }),
    templates: builder.query<any, void>({
      query: () => "/api/hop"
    }),
    editAccess: builder.mutation<any, string>({
      query: (id) => `/api/pipeline/access/${id}`,
    }),
    createPipeline: builder.mutation<any, string>({
      query: (body) => ({
        url: "/api/pipeline",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["pipelines"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useFindAllQuery, useTemplatesQuery, useCreatePipelineMutation, useEditAccessMutation } = pipelineApi;
