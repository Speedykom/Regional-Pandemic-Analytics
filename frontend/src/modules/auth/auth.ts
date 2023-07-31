// Need to use the React-specific entry point to import createApi
import { baseQuery } from '@/common/redux/api';
import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import secureLocalStorage from 'react-secure-storage';
import { Credentials, UserProfile, LoginParams, Permissions, Jwt } from './interface';
import jwt_decode from 'jwt-decode';

// Define a service using a base URL and expected endpoints
export const AuthApi = createApi({
  reducerPath: 'AuthApi',
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<Credentials, LoginParams>({
      query: (body) => ({
        url: '/auth/key-auth',
        method: 'POST',
        body: body,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useLogoutMutation } = AuthApi;

type UserAuth = {
  user: null | UserProfile; // for user object
  permissions: Permissions;
};

type UserAuthState = {
  auth: UserAuth;
};

const parseAccessToken = (accessToken: string | null): UserProfile | null => {
  if (!accessToken) {
    return null;
  }

  const {
    realm_access,
    resource_access,
    sub,
    email_verified,
    preferred_username,
    avatar,
    given_name,
    family_name,
    email,
    gender,
  } = jwt_decode(accessToken) as Jwt;

  return {
    id: sub,
    realm_access,
    resource_access,
    email_verified,
    preferred_username,
    avatar,
    given_name,
    family_name,
    email,
    gender,
  };
};

const loadAccessToken = () => {
  if (typeof window !== undefined) {
    const tokens = secureLocalStorage.getItem('tokens') as {
      accessToken: string;
    };
    return tokens?.accessToken
  }
  return null
}


const loadPermissions = () => {
  if (typeof window !== undefined) {
    const permissions = secureLocalStorage.getItem('permissions') as Permissions;
    return permissions || []
  }
  return []
}

const initialState: UserAuth = {
  user: parseAccessToken(loadAccessToken()), // for user object
  permissions: loadPermissions(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    clearCredentials: (state: UserAuth) => {
      secureLocalStorage.clear();
      state.user = null;
      state.permissions = [];
    },
    setCredentials: (
      state: UserAuth,
      action: {
        payload: {
          permissions: Permissions;
          accessToken: string;
          refreshToken: string;
        };
      }
    ) => {
      const { accessToken, refreshToken, permissions } = action.payload;

      secureLocalStorage.setItem('tokens', {
        accessToken,
        refreshToken,
      });
      secureLocalStorage.setItem('permissions', permissions);

      state.user = parseAccessToken(accessToken);
      state.permissions = permissions;
    },
  },
  extraReducers: {},
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: UserAuthState) => state.auth.user;
export const selectIsAuthenticated = (state: UserAuthState) =>
  !!state.auth.user;
export const selectCurrentUserPermissions = (state: UserAuthState) =>
  state.auth.permissions;
