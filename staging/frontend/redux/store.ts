import { configureStore } from "@reduxjs/toolkit";
import { processApi } from "../src/modules/process/process";

export const store = configureStore({
  reducer: {
    [processApi.reducerPath]: processApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(processApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
