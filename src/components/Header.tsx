import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { AppDispatch } from '../store/store';
import { toggleSidebar } from '../store/slices/uiSlice';
import { setSearchQuery, setSearchResults, setMovieResults } from '../store/slices/searchSlice';
import { searchAllContent } from '../services/api';

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchInput.trim()) {
        setIsSearching(true);
        try {
          const results = await searchAllContent(searchInput);
          dispatch(setSearchResults(results.news.map((article, index) => ({
            id: `search-${index}`,
            type: 'news' as const,
            data: article,
            isFavorite: false,
            timestamp: Date.now(),
          }))));
          dispatch(setMovieResults(results.movies));
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        dispatch(setSearchResults([]));
        dispatch(setMovieResults([]));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for content..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-96 px-4 py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
            <div className="absolute left-3 top-2.5">
              {isSearching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h6v-2H4v2zM4 11h6V9H4v2zM4 7h6V5H4v2z" />
            </svg>
          </motion.button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">U</span>
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 