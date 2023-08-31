import { configureStore } from '@reduxjs/toolkit';
import { DashboardApi, ChartApi } from '@/modules/superset/superset';
import { processApi } from '@/modules/process/process';
import authReducer, { AuthApi, HopAuthApi } from '@/modules/auth/auth';
import { PipelineApi } from '@/modules/pipeline/pipeline';
import { UserApi } from '@/modules/user/user';
import { RoleApi } from '@/modules/roles/role';
import { DataApi } from '@/modules/data/data';
import sidebarSlice from '../components/Dashboard/SidebarSlice';

export const store = configureStore({
  reducer: {
    [DashboardApi.reducerPath]: DashboardApi.reducer,
    [ChartApi.reducerPath]: ChartApi.reducer,
    [processApi.reducerPath]: processApi.reducer,
    [DataApi.reducerPath]: DataApi.reducer,
    [PipelineApi.reducerPath]: PipelineApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [HopAuthApi.reducerPath]: HopAuthApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [RoleApi.reducerPath]: RoleApi.reducer,
    auth: authReducer,
    sidebar: sidebarSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(DashboardApi.middleware)
      .concat(ChartApi.middleware)
      .concat(processApi.middleware)
      .concat(DataApi.middleware)
      .concat(AuthApi.middleware)
      .concat(HopAuthApi.middleware)
      .concat(PipelineApi.middleware)
      .concat(UserApi.middleware)
      .concat(RoleApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
