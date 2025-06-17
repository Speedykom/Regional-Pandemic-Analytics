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
  prepareHeaders: (headers, { endpoint }) => {
    const tokens = secureLocalStorage.getItem('tokens') as {
      accessToken: string;
      refreshToken: string;
    };

    if (tokens) {
      headers.set(
        'AUTHORIZATION',
        `Bearer ${
          endpoint === 'logout' ? tokens.refreshToken : tokens.accessToken
        }`
      );
    }

    return headers;
  },
});

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQueryWithAuthHeader(args, api, extraOptions);

  // Handle non-JSON responses specifically
  if (
    result.error &&
    result.error.status === 'PARSING_ERROR' &&
    result.error.originalStatus === 200
  ) {
    try {
      const blob = new Blob([result.error.data], {
        type: 'application/octet-stream',
      });
      const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to convert blob to base64'));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };
      const dataUrl = `data:${blob.type};base64,${await blobToBase64(blob)}`;
      return { data: dataUrl };
    } catch (e) {
      return {
        error: {
          status: 'CUSTOM_ERROR',
          error: 'Failed to process binary data.',
        },
      };
    }
  }

  if (result.error) {
    if (result.error.status === 401) {
      api.dispatch({
        payload: undefined,
        type: 'auth/clearCredentials',
      });
      router.push('/');
    }
  }

  return result;
};
