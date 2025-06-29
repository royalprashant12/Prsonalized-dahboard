import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, AppDispatch } from './store/store';
import { RootState } from './store/store';
import { fetchContent } from './store/slices/contentSlice';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ContentFeed from './components/ContentFeed';
import TrendingSection from './components/TrendingSection';
import InstagramSection from './components/InstagramSection';
import MovieSection from './components/MovieSection';
import FavoritesSection from './components/FavoritesSection';
import SettingsPanel from './components/SettingsPanel';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.userPreferences);
  const { currentSection } = useSelector((state: RootState) => state.ui);
  const { darkMode } = useSelector((state: RootState) => state.userPreferences);

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Fetch content when categories change
    dispatch(fetchContent(categories));
  }, [dispatch, categories]);

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'feed':
        return <ContentFeed />;
      case 'trending':
        return <TrendingSection />;
      case 'instagram':
        return <InstagramSection />;
      case 'movies':
        return <MovieSection />;
      case 'favorites':
        return <FavoritesSection />;
      default:
        return <ContentFeed />;
    }
  };

  return (
    <PersistGate loading={null} persistor={persistor}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6">
              {renderCurrentSection()}
            </main>
          </div>
        </div>
        <SettingsPanel />
      </div>
    </PersistGate>
  );
};

export default App; 