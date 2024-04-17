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

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  tagTypes: ['user'],
  endpoints: (builder) => ({
    getUsers: builder.query<Users, void>({
      query: () => 'account/users',
    }),
    getUser: builder.query<User, string>({
      query: (id) => `account/user/${id}`,
      providesTags: ['user'],
    }),
    disableUser: builder.mutation<DisableResponse, string>({
      query: (id) => {
        return {
          url: `account/user/${id}/delete`,
          method: 'DELETE',
        };
      },
    }),
    modifyUser: builder.mutation<UserResponse, SerialUser>({
      query: (body) => ({
        url: 'account/user',
        method: 'PUT',
        body,
      }),
    }),
    addUser: builder.mutation<UserResponse, SerialUser>({
      query: (body) => ({
        url: 'account/user',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, ResetRequest>({
      query: (body) => ({
        url: '/auth/request-verify',
        method: 'POST',
        body,
      }),
    }),
    uploadAvatar: builder.mutation<any, FormData>({
      query: (FormData) => ({
        url: `account/user/avatar-upload`,
        method: 'POST',
        body: FormData,
      }),
      invalidatesTags: ['user'],
    }),
    getUserAvatar: builder.query<any, { id: string }>({
      query: (id) => `account/user/${id}/avatar`,
      providesTags: ['user'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useDisableUserMutation,
  useAddUserMutation,
  useModifyUserMutation,
  useResetPasswordMutation,
  useUploadAvatarMutation,
  useGetUserAvatarQuery,
} = userApi;
