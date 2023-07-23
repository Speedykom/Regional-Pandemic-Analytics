import { baseQuery } from "@/common/redux/api";
import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { Roles } from "./interface";

export const RoleApi = createApi({
  reducerPath: 'RoleApi',
  baseQuery,
  endpoints: (builder) => ({
    getRoles: builder.query<Roles, void>({
      query: () => '/role',
    }),
  })
});

export const {
  useGetRolesQuery
} = RoleApi;