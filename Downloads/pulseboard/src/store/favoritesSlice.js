import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    ids: [],
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const id = action.payload;

      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((item) => item !== id);
      } else {
        state.ids.push(id);
      }
    },

    setFavorites: (state, action) => {
      state.ids = action.payload;
    },
  },
});

export const { toggleFavorite, setFavorites } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;