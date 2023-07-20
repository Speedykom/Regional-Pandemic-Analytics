// Need to use the React-specific entry point to import createApi
import { baseQuery } from "@/common/redux/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Credentials, LoginParams } from "./interface";

// Define a service using a base URL and expected endpoints
export const AuthApi = createApi({
  reducerPath: "AuthApi",
  baseQuery,
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
