import { baseQuery } from "@/common/redux/api";
import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { Role, Roles } from "./interface";
import { url } from "inspector";

export const RoleApi = createApi({
  reducerPath: 'RoleApi',
  baseQuery,
  endpoints: builder => ({
    getRoles: builder.query<Roles, void>({
      query: () => '/role',
    }),
    updateRole: builder.mutation<{message: string}, Pick<Role, 'id' | 'name' | 'description'>> ({
      query: ({ id, ...patch }) => ({
        url: `/role/${id}`,
        method: 'PUT',
        body: patch
      })
    })
  })
});

export const {
  useGetRolesQuery,
  useUpdateRoleMutation
} = RoleApi;