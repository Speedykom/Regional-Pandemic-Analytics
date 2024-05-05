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

interface AvatarResponse {
  avatar_url: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<Users, void>({
      query: () => 'account/users',
      providesTags: ['User'],
    }),
    getUser: builder.query<User, string>({
      query: (id) => `account/user/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    disableUser: builder.mutation<DisableResponse, string>({
      query: (id) => ({
        url: `account/user/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    addUser: builder.mutation<UserResponse, SerialUser>({
      query: (body) => ({
        url: 'account/user',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
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
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          userApi.util.updateQueryData('getUser', arg.id, (draft) => {
            Object.assign(draft, arg.userData);
          })
        );
        try {
          await queryFulfilled;
          dispatch(userApi.util.invalidateTags([{ type: 'User', id: arg.id }]));
        } catch {
          patchResult.undo();
        }
      },
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
    uploadAvatar: builder.mutation<any, FormData>({
      query: (FormData) => ({
        url: `account/user/avatar-upload`,
        method: 'POST',
        body: FormData,
      }),
    }),
    getUserAvatar: builder.query<string, { id: string }>({
      query: (id) => `account/${id}/avatar`,
      transformResponse: (response: AvatarResponse) => response.avatar_url,
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
  useUploadAvatarMutation,
  useGetUserAvatarQuery,
} = userApi;
