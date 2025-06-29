import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPreferences } from '../../types';

const initialState: UserPreferences = {
  categories: ['technology', 'sports', 'finance'],
  darkMode: false,
  favorites: [],
};

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    addFavorite: (state, action: PayloadAction<string>) => {
      console.log('addFavorite reducer called with:', action.payload);
      console.log('Current favorites:', state.favorites);

      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
        console.log('Added to favorites. New favorites:', state.favorites);
      } else {
        console.log('Item already in favorites');
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      console.log('removeFavorite reducer called with:', action.payload);
      console.log('Current favorites:', state.favorites);

      state.favorites = state.favorites.filter(id => id !== action.payload);
      console.log('Removed from favorites. New favorites:', state.favorites);
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
});

export const {
  setCategories,
  toggleDarkMode,
  addFavorite,
  removeFavorite,
  clearFavorites,
} = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer; 