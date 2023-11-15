// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/common/redux/api';
import { ChartList, DashboardStatus } from './interface';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery,
  endpoints: (builder) => ({
    getDashboards: builder.query<any, string>({
      query: (query) => `superset/list/${query}`,
    }),
    getFavoriteDashboards: builder.query<any, void>({
      query: () => `/superset/dashboard/favorite-status`,
    }),
    enableDashboard: builder.mutation<DashboardStatus, string>({
      query: (uid) => ({
        url: `/superset/dashboard/enable-embed`,
        method: 'POST',
        body: { uid },
      }),
    }),
    generateGuestToken: builder.mutation<{ token: string }, string>({
      query: (id) => ({
        url: `/superset/guest/token`,
        method: 'POST',
        body: { id },
      }),
    }),
  }),
});

export const chartApi = createApi({
  reducerPath: 'chartApi',
  baseQuery,
  endpoints: (builder) => ({
    getCharts: builder.query<ChartList, string>({
      query: (query) => `superset/list/charts/${query}`,
    }),
  }),
});

export const {
  useGetDashboardsQuery,
  useGetFavoriteDashboardsQuery,
  useEnableDashboardMutation,
  useGenerateGuestTokenMutation,
} = dashboardApi;

export const { useGetChartsQuery } = chartApi;
