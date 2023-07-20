import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getConfig from 'next/config';
import secureLocalStorage from 'react-secure-storage';

const { publicRuntimeConfig } = getConfig();

export const baseQuery = fetchBaseQuery({
  baseUrl: `${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/`,
  prepareHeaders: (headers: any) => {
    const tokens = secureLocalStorage.getItem('tokens') as {
      accessToken: string;
      refreshToken: string;
    };

    if (tokens) {
      const { accessToken } = tokens as any;
      headers.set('AUTHORIZATION', `Bearer ${accessToken}`);
    }

    headers.set('Content-Type', 'application/json');
    return headers;
  },
});
