import { configureStore } from "@reduxjs/toolkit";
import { processApi } from "./services/process";
import { hopReducer } from "./hop";
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    [processApi.reducerPath]: processApi.reducer,
    hopReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(processApi.middleware).concat(logger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
