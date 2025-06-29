import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  currentSection: 'feed' | 'trending' | 'favorites' | 'instagram' | 'movies';
}

const initialState: UIState = {
  sidebarOpen: false,
  currentSection: 'feed',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setCurrentSection: (state, action: PayloadAction<'feed' | 'trending' | 'favorites' | 'instagram' | 'movies'>) => {
      state.currentSection = action.payload;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
  },
});

export const { toggleSidebar, setCurrentSection, closeSidebar } = uiSlice.actions;
export default uiSlice.reducer; 