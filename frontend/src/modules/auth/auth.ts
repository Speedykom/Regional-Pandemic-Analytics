// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getConfig from "next/config";
import { Credentials, LoginParams } from "./interface";

const { publicRuntimeConfig } = getConfig();

// Define a service using a base URL and expected endpoints
export const AuthApi = createApi({
  reducerPath: "AuthApi",
  baseQuery: fetchBaseQuery({
    baseUrl: publicRuntimeConfig.NEXT_PUBLIC_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<Credentials, LoginParams>({
      query: (body) => ({
        url: '/auth/key-auth',
        method: 'POST',
        body: body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation } = AuthApi;
