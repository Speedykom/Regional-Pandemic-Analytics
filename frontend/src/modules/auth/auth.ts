// Need to use the React-specific entry point to import createApi
import { baseQuery } from '@/common/redux/api';
import { createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import secureLocalStorage from 'react-secure-storage';
import jwt_decode from 'jwt-decode';
import {
  Credentials,
  UserProfile,
  Permissions,
  Jwt,
  OAuthParams,
} from './interface';

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<Credentials, OAuthParams>({
      query: (body) => ({
        url: '/auth/key-auth',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    me: builder.query({
      query: () => `/auth/me`,
    }),
  }),
});

export const hopAuthApi = createApi({
  reducerPath: 'hopAuthApi',
  baseQuery: fetchBaseQuery({ baseUrl: `/hop/` }),
  endpoints: (builder) => ({
    logoutFromHop: builder.mutation<void, void>({
      query: () => ({
        url: '/?logout=true',
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi;
export const { useLogoutFromHopMutation } = hopAuthApi;

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
    return tokens?.accessToken;
  }
  return null;
};

const loadPermissions = () => {
  if (typeof window !== undefined) {
    const permissions = secureLocalStorage.getItem(
      'permissions'
    ) as Permissions;
    return permissions || [];
  }
  return [];
};

const initialState: UserAuth = {
  user: parseAccessToken(loadAccessToken()), // for user object
  permissions: loadPermissions(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
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
