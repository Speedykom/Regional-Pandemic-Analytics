import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/common/redux/api';
import {
  CreateTokenRequest,
  CreateTokenResponse,
  TokenListResponse,
  DatasetListResponse,
} from './interface';

export const tokensApi = createApi({
  reducerPath: 'tokensApi',
  baseQuery,
  tagTypes: ['Token', 'Dataset'],
  endpoints: (builder) => ({
    // Get all datasets for the authenticated user
    getDatasets: builder.query<DatasetListResponse, void>({
      query: () => '/datasets/list/',
      transformResponse: (response: string[]) => ({
        datasets: response,
      }),
      providesTags: ['Dataset'],
    }),

    // Get all tokens for the authenticated user
    getTokens: builder.query<TokenListResponse, void>({
      query: () => '/datasets/tokens/',
      transformResponse: (response: any[]) => ({
        tokens: response,
      }),
      providesTags: ['Token'],
    }),

    // Create a new token
    createToken: builder.mutation<CreateTokenResponse, CreateTokenRequest>({
      query: (body: CreateTokenRequest) => ({
        url: '/datasets/tokens/create/',
        method: 'POST',
        body: {
          allowed_objects: body.allowed_objects,
          description: body.description,
        },
      }),
      transformResponse: (response: { token: string }) => ({
        token: response.token,
      }),
      invalidatesTags: ['Token'],
    }),

    // Delete a token - we need to use the actual token value as the ID
    deleteToken: builder.mutation<void, string>({
      query: (tokenId: string) => ({
        url: `/datasets/tokens/${tokenId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Token'],
    }),
  }),
});

export const {
  useGetDatasetsQuery,
  useGetTokensQuery,
  useCreateTokenMutation,
  useDeleteTokenMutation,
} = tokensApi;
