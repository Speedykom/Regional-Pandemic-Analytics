import { configureStore } from "@reduxjs/toolkit";
import { DashboardApi, ChartApi } from "@/modules/superset/superset";
import { ProcessApi } from "@/modules/process/process";
import authReducer, { AuthApi } from "@/modules/auth/auth";
import { PipelineApi } from "@/modules/pipeline/pipeline";
import { UserApi } from "@/modules/user/user";
import { DataApi } from "@/modules/data/data";

export const store = configureStore({
  reducer: {
    [DashboardApi.reducerPath]: DashboardApi.reducer,
    [ChartApi.reducerPath]: ChartApi.reducer,
    [ProcessApi.reducerPath]: ProcessApi.reducer,
    [DataApi.reducerPath]: DataApi.reducer,
    [PipelineApi.reducerPath]: PipelineApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(DashboardApi.middleware)
      .concat(ChartApi.middleware)
      .concat(ProcessApi.middleware)
      .concat(DataApi.middleware)
      .concat(AuthApi.middleware)
      .concat(PipelineApi.middleware)
      .concat(UserApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
