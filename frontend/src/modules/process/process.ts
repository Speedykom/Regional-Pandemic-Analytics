// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Process } from "../../common/redux/interface/process";
import { prepareHeaders } from "@/common/config";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

// Define a service using a base URL and expected endpoints
export const processApi = createApi({
  reducerPath: "processApi",
  baseQuery: fetchBaseQuery({
    baseUrl: publicRuntimeConfig.NEXT_PUBLIC_BASE_URL,
    prepareHeaders,
    credentials: "include",
  }),
  tagTypes: ["processes"],
  endpoints: (builder) => ({
    findAll: builder.query<Process, void>({
      query: () => "/api/process/list",
      providesTags: ["processes"],
    }),
    findOne: builder.query<Process, string>({
      query: (id) => `/api/process/one/${id}`,
    }),
    editAccess: builder.mutation<Process, string>({
      query: (id) => `/api/process/access/${id}`,
    }),
    runProcess: builder.mutation<Process, string>({
      query: (id) => ({
        url: `/api/process/run/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["processes"],
    }),
    delProcess: builder.mutation<Process, string>({
      query: (id) => ({
        url: `/api/process/delete/${id}`,
        method: "DELETE",
        body: {},
      }),
      invalidatesTags: ["processes"],
    }),
    createProcess: builder.mutation<Process, string>({
      query: (body) => ({
        url: "/api/process",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["processes"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useFindAllQuery,
  useFindOneQuery,
  useRunProcessMutation,
  useCreateProcessMutation,
  useEditAccessMutation,
  useDelProcessMutation,
} = processApi;
