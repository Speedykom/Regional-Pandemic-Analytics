// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Process } from "../interface/process";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Define a service using a base URL and expected endpoints
export const processApi = createApi({
  reducerPath: "processApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["processes"],
  endpoints: (builder) => ({
    findAll: builder.query<Process, void>({
      query: () => "/api/process/",
    }),
    findOne: builder.query<Process, string>({
      query: (id) => `/api/process/${id}`,
    }),
    runPipeline: builder.mutation<Process, string>({
      query: (id) => ({
        url: `/api/process/run/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["processes"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useFindAllQuery, useFindOneQuery, useRunPipelineMutation } = processApi;
