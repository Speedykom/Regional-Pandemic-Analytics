// Need to use the React-specific entry point to import createApi
import { prepareHeaders } from "@/common/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

// Define a service using a base URL and expected endpoints
export const templateApi = createApi({
  reducerPath: "templateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: publicRuntimeConfig.NEXT_PUBLIC_BASE_URL,
    prepareHeaders,
    credentials: "include",
  }),
  tagTypes: ["templates"],
  endpoints: (builder) => ({
    findAll: builder.query<any, void>({
      query: () => "/api/hop/",
      providesTags: ["templates"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useFindAllQuery } = templateApi;
