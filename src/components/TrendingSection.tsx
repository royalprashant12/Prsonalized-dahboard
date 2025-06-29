import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../store/store';
import ContentCard from './ContentCard';

const TrendingSection: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.content);

  // Mock trending items - in a real app, this would come from an API
  const trendingItems = items.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          🔥 Trending Now
        </h2>
        <span className="text-gray-600 dark:text-gray-400">
          {trendingItems.length} trending items
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ContentCard
              item={item}
              onToggleFavorite={() => { }}
            />
          </motion.div>
        ))}
      </div>

      {trendingItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No trending content available.
          </p>
        </div>
      )}
    </div>
  );
};

export default TrendingSection; 