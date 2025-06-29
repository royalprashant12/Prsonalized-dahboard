import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState, AppDispatch } from '../store/store';
import { setCurrentSection, closeSidebar } from '../store/slices/uiSlice';
import { toggleDarkMode } from '../store/slices/userPreferencesSlice';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { darkMode } = useSelector((state: RootState) => state.userPreferences);

  const menuItems = [
    { id: 'feed', label: 'Personalized Feed', icon: '📰' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'instagram', label: 'Instagram', icon: '📸' },
    { id: 'movies', label: 'Movies', icon: '🎬' },
    { id: 'favorites', label: 'Favorites', icon: '❤️' },
  ];

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-40 cursor-pointer"
            onClick={() => dispatch(closeSidebar())}
          />
          {/* Sidebar */}
          <motion.div
            key="sidebar-panel"
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3 }}
            className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            data-testid="sidebar"
          >
            {/* Close button */}
            <button
              onClick={() => dispatch(closeSidebar())}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl focus:outline-none"
              aria-label="Close sidebar"
            >
              &times;
            </button>
            <div className="p-6 pt-2">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 mt-4">
                Dashboard
              </h1>

              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      dispatch(setCurrentSection(item.id as any));
                      dispatch(closeSidebar());
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => dispatch(toggleDarkMode())}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar; 