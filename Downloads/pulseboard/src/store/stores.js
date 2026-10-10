import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./favoritesSlice";
import preferencesReducer from "./preferencesSlice";
import { contentApi } from "./api/contentApi";

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    preferences: preferencesReducer,
    [contentApi.reducerPath]: contentApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(contentApi.middleware),
});