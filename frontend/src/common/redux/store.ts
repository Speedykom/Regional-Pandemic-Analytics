import { configureStore } from "@reduxjs/toolkit";
import { DashboardApi, ChartApi } from "../../modules/superset/superset";
import { processApi } from "../../modules/process/process";
import authReducer, { AuthApi } from "../../modules/auth/auth";
import { pipelineApi } from "@/modules/pipeline/pipeline";
import { UserApi } from "@/modules/user/user";

export const store = configureStore({
  reducer: {
    [DashboardApi.reducerPath]: DashboardApi.reducer,
    [ChartApi.reducerPath]: ChartApi.reducer,
    [processApi.reducerPath]: processApi.reducer,
    [pipelineApi.reducerPath]: pipelineApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(DashboardApi.middleware)
      .concat(ChartApi.middleware)
      .concat(processApi.middleware)
      .concat(AuthApi.middleware)
      .concat(pipelineApi.middleware)
      .concat(UserApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
