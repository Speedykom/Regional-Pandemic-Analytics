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
interface EnableResponse {
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
    enableUser: builder.mutation<EnableResponse, string>({
      query: (id) => ({
        url: `account/user/${id}/update`,
        method: 'PUT',
        body: { enabled: true },
        headers: {
          'Content-Type': 'application/json',
        },
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
    uploadAvatar: builder.mutation<any, { id: string; avatarData: FormData }>({
      query: ({ id, avatarData }) => ({
        url: `account/user/${id}/avatar`,
        method: 'POST',
        body: avatarData,
      }),
      invalidatesTags: ['User'],
    }),

    getUserAvatar: builder.query<string, string>({
      query: (id) => ({
        url: `account/user/${id}/avatar`,
        responseHandler: async (response: Response) =>
          new Promise(async (resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(await response.blob());
          }),
        validateStatus(res: Response) {
          return res.ok && res.status !== 202;
        },
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useDisableUserMutation,
  useEnableUserMutation,
  useAddUserMutation,
  useResetPasswordMutation,
  useModifyUserMutation,
  useChangePasswordMutation,
  useUploadAvatarMutation,
  useGetUserAvatarQuery,
} = userApi;
