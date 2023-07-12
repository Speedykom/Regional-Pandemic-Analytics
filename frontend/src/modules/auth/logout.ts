// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Process } from "../../common/redux/interface/process";
import getConfig from "next/config";
import secureLocalStorage from "react-secure-storage";

const { publicRuntimeConfig } = getConfig();

// Define a service using a base URL and expected endpoints
export const LogoutApi = createApi({
  reducerPath: "LogoutApi",
  baseQuery: fetchBaseQuery({
    baseUrl: publicRuntimeConfig.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: (headers: any, { getState, endpoint }: any) => {
      const tokens = secureLocalStorage.getItem("tokens");

      if (!tokens) return headers;

      const { refreshToken } = tokens as any;

      headers.set("AUTHORIZATION", `Bearer ${refreshToken}`);

      return headers;
    },
    credentials: "include",
  }),
  endpoints: (builder) => ({
    logout: builder.mutation<any, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "GET",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLogoutMutation } = LogoutApi;
