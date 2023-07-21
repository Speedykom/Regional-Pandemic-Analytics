// Need to use the React-specific entry point to import createApi
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from '@/common/redux/api';
import { User, Users } from './interface';

export const UserApi = createApi({
  reducerPath: 'UserApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getUsers: builder.query<Users, void>({
      query: () => 'account/users',
    }),
    getUser: builder.query<User, void>({
      query: (id) => `account/user/${id}`,
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery } = UserApi;
