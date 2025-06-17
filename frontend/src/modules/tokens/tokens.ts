import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CreateTokenRequest,
  CreateTokenResponse,
  TokenListResponse,
  DatasetListResponse,
} from './interface';
import {
  getMockDatasets,
  getMockTokens,
  createMockToken,
  mockTokens,
} from './mockData';

// Create a mock base query that simulates API calls
const mockBaseQuery = fetchBaseQuery({
  baseUrl: '/mock-api/',
  fetchFn: async () => {
    // This will never actually be called, we override all endpoints
    throw new Error('Mock API should not make real HTTP requests');
  },
});

export const tokensApi = createApi({
  reducerPath: 'tokensApi',
  baseQuery: mockBaseQuery,
  tagTypes: ['Token', 'Dataset'],
  endpoints: (builder) => ({
    // Get all datasets for the authenticated user
    getDatasets: builder.query<DatasetListResponse, void>({
      queryFn: async () => {
        try {
          const data = await getMockDatasets();
          return { data: data as DatasetListResponse };
        } catch (error) {
          return { error: { status: 500, data: 'Failed to fetch datasets' } };
        }
      },
      providesTags: ['Dataset'],
    }),

    // Get all tokens for the authenticated user
    getTokens: builder.query<TokenListResponse, void>({
      queryFn: async () => {
        try {
          const data = await getMockTokens();
          return { data: data as TokenListResponse };
        } catch (error) {
          return { error: { status: 500, data: 'Failed to fetch tokens' } };
        }
      },
      providesTags: ['Token'],
    }),

    // Create a new token
    createToken: builder.mutation<CreateTokenResponse, CreateTokenRequest>({
      queryFn: async (body) => {
        try {
          const data = await createMockToken(body);
          return { data: data as CreateTokenResponse };
        } catch (error) {
          return { error: { status: 500, data: 'Failed to create token' } };
        }
      },
      invalidatesTags: ['Token'],
    }),

    // Delete a token
    deleteToken: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          // Simulate deletion by removing from mock data
          const index = mockTokens.findIndex((token) => token.id === id);
          if (index > -1) {
            mockTokens.splice(index, 1);
          }
          return { data: undefined };
        } catch (error) {
          return { error: { status: 500, data: 'Failed to delete token' } };
        }
      },
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
