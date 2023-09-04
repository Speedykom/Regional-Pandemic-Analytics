// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/common/redux/api';
import { Data } from './interface';

export const dataApi = createApi({
  reducerPath: 'dataApi',
  baseQuery,
  endpoints: (builder) => ({
    getUploadedFiles: builder.query<Data[], string>({
      query: (username) => ({
        url: `/data/get-list-of-uploads/`,
        method: 'GET',
        params: { username },
      }),
    }),
  }),
});

export const { useGetUploadedFilesQuery } = dataApi;
