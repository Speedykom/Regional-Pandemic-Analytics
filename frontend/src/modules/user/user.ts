// Need to use the React-specific entry point to import createApi
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from '@/common/redux/api';
import { Users } from './interface';

export const UserApi = createApi({
  reducerPath: 'UserApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getUsers: builder.query<Users, void>({
      query: () => 'account/users',
    }),
  }),
});

export const { useGetUsersQuery } = UserApi;
