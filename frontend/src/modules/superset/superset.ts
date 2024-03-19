// Need to use the React-specific entry point to import createApi
import { createApi, retry } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/common/redux/api';
import { ChartList, DashboardStatus } from './interface';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery,
  endpoints: (builder) => ({
    getDashboards: builder.query<any, string>({
      query: (query) => `superset/list/${query}`,
    }),
    getFavoriteDashboards: builder.query<any, number[]>({
      query: (query) => ({
        url: '/superset/dashboard/favorite-status/' + JSON.stringify(query),
      }),
    }),
    enableDashboard: builder.mutation<DashboardStatus, string>({
      query: (uid) => ({
        url: `/superset/dashboard/enable-embed`,
        method: 'POST',
        body: { uid },
      }),
    }),
    addDashboardToFavorites: builder.mutation<any, number>({
      query: (id) => ({
        url: `/superset/dashboard/add-favorite`,
        method: 'POST',
        body: { id },
      }),
    }),

    removeDashboardFromFavorites: builder.mutation<any, number>({
      query: (id) => ({
        url: `/superset/dashboard/remove-favorite`,
        method: 'DELETE',
        body: { id },
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

export const thumbnailApi = createApi({
  reducerPath: 'thumbnailApi',
  baseQuery: retry(baseQuery),
  endpoints: (builder) => ({
    getDashboardThumbnail: builder.query<string, string>({
      query: (id) => ({
        url: `/superset/dashboard/${id}/thumbnail`,
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
  useAddDashboardToFavoritesMutation,
  useRemoveDashboardFromFavoritesMutation,
} = dashboardApi;

export const { useGetChartsQuery } = chartApi;

export const { useGetDashboardThumbnailQuery } = thumbnailApi;
