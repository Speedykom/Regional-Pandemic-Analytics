import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import getConfig from 'next/config';
import router from 'next/router';
import secureLocalStorage from 'react-secure-storage';

const { publicRuntimeConfig } = getConfig();

export const baseQueryWithAuthHeader = fetchBaseQuery({
  baseUrl: `${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/`,
  prepareHeaders: (headers: any, { endpoint }) => {
    const tokens = secureLocalStorage.getItem('tokens') as {
      accessToken: string;
      refreshToken: string;
    };

    if (tokens) {
      const { accessToken, refreshToken } = tokens as any;

      headers.set(
        'AUTHORIZATION',
        `Bearer ${endpoint === 'logout' ? refreshToken : accessToken}`
      );
    }

    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQueryWithAuthHeader(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    api.dispatch({
      payload: undefined,
      type: 'auth/clearCredentials',
    });
    router.push('/');
  }
  if (result.error) {
    throw result.error;
  }
  return result;
};
