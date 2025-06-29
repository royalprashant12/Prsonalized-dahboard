import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userPreferencesReducer from './slices/userPreferencesSlice';
import contentReducer from './slices/contentSlice';
import searchReducer from './slices/searchSlice';
import uiReducer from './slices/uiSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userPreferences']
};

const persistedUserPreferences = persistReducer(persistConfig, userPreferencesReducer);

export const store = configureStore({
  reducer: {
    userPreferences: persistedUserPreferences,
    content: contentReducer,
    search: searchReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 