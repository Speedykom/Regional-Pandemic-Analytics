import { baseQuery } from "@/common/redux/api";
import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { Role, Roles } from "./interface";
<<<<<<< HEAD
=======
import { url } from "inspector";
>>>>>>> cf5e802 (manage client roles instead of realm, role list refactor, role update redux mutation, tremor update fix errors)

export const RoleApi = createApi({
  reducerPath: 'RoleApi',
  baseQuery,
  endpoints: builder => ({
    getRoles: builder.query<Roles, void>({
      query: () => '/role',
    }),
    updateRole: builder.mutation<{message: string}, Pick<Role, 'id' | 'name' | 'description'>> ({
      query: ({ id, ...patch }) => ({
<<<<<<< HEAD
        url: `/role/${id}/update`,
=======
        url: `/role/${id}`,
>>>>>>> cf5e802 (manage client roles instead of realm, role list refactor, role update redux mutation, tremor update fix errors)
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