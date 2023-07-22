// Need to use the React-specific entry point to import createApi
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from '@/common/redux/api';
import { User, Users } from './interface';
import { Role } from "../roles/interface";

interface DisableResponse {
  message: string
}

export const UserApi = createApi({
  reducerPath: 'UserApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getUsers: builder.query<Users, void>({
      query: () => 'account/users',
    }),
    getUser: builder.query<User, string>({
      query: (id) => `account/user/${id}`,
    }),
    disableUser: builder.mutation<DisableResponse, string>({
      query: (id) => {
        return {
          url: `account/user/${id}/delete`,
          method: 'DELETE'
        }
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useDisableUserMutation
} = UserApi;
