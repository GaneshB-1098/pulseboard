import { createSlice } from "@reduxjs/toolkit";

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: {
    categories: ["Technology", "Business", "Entertainment"],
    darkMode: true,
  },
  reducers: {
    toggleCategory: (state, action) => {
      const category = action.payload;

      if (state.categories.includes(category)) {
        state.categories = state.categories.filter(
          (item) => item !== category
        );
      } else {
        state.categories.push(category);
      }
    },

    setCategories: (state, action) => {
      state.categories = action.payload;
    },

    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },

    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const {
  toggleCategory,
  setCategories,
  setDarkMode,
  toggleDarkMode,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;