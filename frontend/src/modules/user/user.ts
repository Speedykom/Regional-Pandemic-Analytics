// Need to use the React-specific entry point to import createApi
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from '@/common/redux/api';
import { Users, SerialUser, UserResponse } from './interface';

export const UserApi = createApi({
  reducerPath: 'UserApi',
  baseQuery,
  endpoints: (builder) => ({
    getUsers: builder.query<Users, void>({
      query: () => 'account/users',
    }),
    addUser: builder.mutation<UserResponse, SerialUser>({
      query: (body) => ({
        url: 'account/user',
        method: 'POST',
        body
      })
    })
  }),
});

export const
  {
    useGetUsersQuery,
    useAddUserMutation
  } = UserApi;
