// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/common/config";

// Define a service using a base URL and expected endpoints
export const templateApi = createApi({
  reducerPath: "templateApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" }),
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
export const {
  useFindAllQuery,
} = templateApi;
