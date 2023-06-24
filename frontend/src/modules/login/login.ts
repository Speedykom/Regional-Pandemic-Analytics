// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Process } from "../../common/redux/interface/process";
import { BASE_URL } from "@/common/config";

// Define a service using a base URL and expected endpoints
export const AuthApi = createApi({
  reducerPath: "AuthApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation<Process, any>({
      query: (body) => ({
        url: "/api/auth/key-auth",
        method: "POST",
        body: body,
      }),
    }),
    userRoles: builder.mutation<Process, any[]>({
      query: (roles: any[]) => {
        const role = roles.find((item: any) => item != "default-roles-stack");

        return {
          url: `/api/role/${role}?type=name`,
          method: "GET"
        };
      },
    })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useUserRolesMutation } = AuthApi;
