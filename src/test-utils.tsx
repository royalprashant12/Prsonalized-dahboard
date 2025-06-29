import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import contentSlice from './store/slices/contentSlice';
import searchSlice from './store/slices/searchSlice';
import uiSlice from './store/slices/uiSlice';
import userPreferencesSlice from './store/slices/userPreferencesSlice';

// Create a test store
const createTestStore = (preloadedState = {}) => {
  const store = configureStore({
    reducer: {
      content: contentSlice,
      search: searchSlice,
      ui: uiSlice,
      userPreferences: userPreferencesSlice,
    },
    preloadedState: {
      content: {
        items: [],
        loading: false,
        error: null,
      },
      search: {
        query: '',
        results: [],
        movieResults: [],
      },
      ui: {
        sidebarOpen: false,
        currentSection: 'feed',
      },
      userPreferences: {
        categories: ['technology', 'sports', 'finance'],
        darkMode: false,
        favorites: [],
      },
      ...preloadedState,
    },
  });

  const persistor = persistStore(store);
  return { store, persistor };
};

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const { store, persistor } = createTestStore();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing library
export * from '@testing-library/react';
export { customRender as render, createTestStore }; 