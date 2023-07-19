import { configureStore } from "@reduxjs/toolkit";
import { processApi } from "../../modules/process/process";
import { AuthApi } from "../../modules/auth/auth";
import { pipelineApi } from "@/modules/pipeline/pipeline";
import { LogoutApi } from "@/modules/auth/logout";
import { UserApi } from "@/modules/user/user";

console.log('>>>>>', UserApi)

export const store = configureStore({
  reducer: {
    [processApi.reducerPath]: processApi.reducer,
    [pipelineApi.reducerPath]: pipelineApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [LogoutApi.reducerPath]: LogoutApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(processApi.middleware)
      .concat(AuthApi.middleware)
      .concat(LogoutApi.middleware)
      .concat(pipelineApi.middleware)
      .concat(UserApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
