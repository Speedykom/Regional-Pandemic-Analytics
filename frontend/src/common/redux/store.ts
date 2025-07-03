import { configureStore } from '@reduxjs/toolkit';
import {
  dashboardApi,
  chartApi,
  thumbnailApi,
} from '@/modules/superset/superset';
import { processApi } from '@/modules/process/process';
import authReducer, { authApi, hopAuthApi } from '@/modules/auth/auth';
import { pipelineApi } from '@/modules/pipeline/pipeline';
import { userApi } from '@/modules/user/user';
import { roleApi } from '@/modules/roles/role';
import { dataApi } from '@/modules/data/data';
import { tokensApi } from '@/modules/tokens/tokens';
import sidebarSlice from '../components/Dashboard/SidebarSlice';

export const store = configureStore({
  reducer: {
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [thumbnailApi.reducerPath]: thumbnailApi.reducer,
    [chartApi.reducerPath]: chartApi.reducer,
    [processApi.reducerPath]: processApi.reducer,
    [dataApi.reducerPath]: dataApi.reducer,
    [pipelineApi.reducerPath]: pipelineApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [hopAuthApi.reducerPath]: hopAuthApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [tokensApi.reducerPath]: tokensApi.reducer,
    auth: authReducer,
    sidebar: sidebarSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(dashboardApi.middleware)
      .concat(thumbnailApi.middleware)
      .concat(chartApi.middleware)
      .concat(processApi.middleware)
      .concat(dataApi.middleware)
      .concat(authApi.middleware)
      .concat(hopAuthApi.middleware)
      .concat(pipelineApi.middleware)
      .concat(userApi.middleware)
      .concat(roleApi.middleware)
      .concat(tokensApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
