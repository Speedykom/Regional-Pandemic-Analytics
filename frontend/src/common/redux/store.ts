import { configureStore } from "@reduxjs/toolkit";
import { DashboardApi, ChartApi } from "../../modules/superset/superset";
import { processApi } from "../../modules/process/process";
import authReducer, { AuthApi } from "../../modules/auth/auth";
import { pipelineApi } from "@/modules/pipeline/pipeline";
import { UserApi } from "@/modules/user/user";
import { RoleApi } from "@/modules/roles/role";

export const store = configureStore({
  reducer: {
    [DashboardApi.reducerPath]: DashboardApi.reducer,
    [ChartApi.reducerPath]: ChartApi.reducer,
    [processApi.reducerPath]: processApi.reducer,
    [pipelineApi.reducerPath]: pipelineApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
<<<<<<< HEAD
    [UserApi.reducerPath]: UserApi.reducer,
    [RoleApi.reducerPath]: RoleApi.reducer,
    auth: authReducer,
=======
    [LogoutApi.reducerPath]: LogoutApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [RoleApi.reducerPath]: RoleApi.reducer
>>>>>>> cf5e802 (manage client roles instead of realm, role list refactor, role update redux mutation, tremor update fix errors)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(DashboardApi.middleware)
      .concat(ChartApi.middleware)
      .concat(processApi.middleware)
      .concat(AuthApi.middleware)
      .concat(pipelineApi.middleware)
      .concat(UserApi.middleware)
      .concat(RoleApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
