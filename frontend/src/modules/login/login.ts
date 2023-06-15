// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Process } from "../../common/redux/interface/process";
import { api_url } from "@/common/utils/auth";

// Define a service using a base URL and expected endpoints
export const AuthApi = createApi({
  reducerPath: "AuthApi",
  baseQuery: fetchBaseQuery({ baseUrl: api_url }),
  endpoints: (builder) => ({
    login: builder.mutation<Process, string>({
      query: (body) => ({
        url: '/api/auth/login',
        method: "POST",
        body: body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation } = AuthApi;

