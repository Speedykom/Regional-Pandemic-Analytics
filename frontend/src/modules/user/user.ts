// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/common/redux/api';
import {
  ResetRequest,
  SerialUser,
  User,
  UserResponse,
  Users,
} from './interface';

interface DisableResponse {
  message: string;
}
interface ChangePasswordRequest {
  id: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordResponse {
  message: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
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
          method: 'DELETE',
        };
      },
    }),
    addUser: builder.mutation<UserResponse, SerialUser>({
      query: (body) => ({
        url: 'account/user',
        method: 'POST',
        body,
      }),
    }),
    modifyUser: builder.mutation<UserResponse, { id: string; userData: any }>({
      query: ({ id, userData }) => ({
        url: `account/user/${id}/update`,
        method: 'PUT',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, ResetRequest>({
      query: (body) => ({
        url: '/auth/request-verify',
        method: 'POST',
        body,
      }),
    }),
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: ({ id, newPassword, confirmPassword }) => ({
        url: `auth/password`,
        method: 'PUT',
        body: {
          id,
          newPassword,
          confirmPassword,
        },
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useDisableUserMutation,
  useAddUserMutation,
  useResetPasswordMutation,
  useModifyUserMutation,
  useChangePasswordMutation,
} = userApi;
