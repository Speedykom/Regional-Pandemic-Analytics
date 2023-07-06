import { configureStore } from "@reduxjs/toolkit";
import { processApi } from "../../modules/process/process";
import { AuthApi } from "../../modules/login/login";
import { pipelineApi } from "@/modules/pipeline/pipeline";

export const store = configureStore({
  reducer: {
    [processApi.reducerPath]: processApi.reducer,
    [pipelineApi.reducerPath]: pipelineApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(processApi.middleware)
      .concat(AuthApi.middleware)
      .concat(pipelineApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
