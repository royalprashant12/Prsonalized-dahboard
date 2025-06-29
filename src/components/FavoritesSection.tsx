import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState, AppDispatch } from '../store/store';
import { toggleFavorite } from '../store/slices/contentSlice';
import { removeFavorite } from '../store/slices/userPreferencesSlice';
import ContentCard from './ContentCard';

const FavoritesSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.content);
  const { favorites } = useSelector((state: RootState) => state.userPreferences);

  const favoriteItems = items.filter(item => favorites.includes(item.id));

  const handleRemoveFavorite = (itemId: string) => {
    dispatch(toggleFavorite(itemId));
    dispatch(removeFavorite(itemId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          ❤️ My Favorites
        </h2>
        <span className="text-gray-600 dark:text-gray-400">
          {favoriteItems.length} favorite items
        </span>
      </div>

      {favoriteItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ContentCard
                item={item}
                onToggleFavorite={() => handleRemoveFavorite(item.id)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start adding content to your favorites to see them here.
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoritesSection; 