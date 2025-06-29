import React from 'react';
import { motion } from 'framer-motion';
import { ContentItem } from '../types';

interface ContentCardProps {
  item: ContentItem;
  onToggleFavorite: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onToggleFavorite }) => {
  const isNews = item.type === 'news';
  const isMovie = item.type === 'movie';
  const data = item.data;

  const handleReadMore = () => {
    if (isNews) {
      window.open((data as any).url, '_blank');
    } else if (isMovie) {
      const movieData = data as any;
      if (movieData.streamingInfo?.url) {
        window.open(movieData.streamingInfo.url, '_blank');
      }
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Favorite button clicked for item:', item.id, 'Current favorite status:', item.isFavorite);
    onToggleFavorite();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number) => {
    return `${(num * 100).toFixed(1)}%`;
  };

  // News and Movie layout
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card overflow-hidden"
    >
      <div className="relative">
        <img
          src={isNews ? (data as any).urlToImage : (data as any).posterPath}
          alt={isNews ? (data as any).title : (data as any).title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 z-10"
        >
          <svg
            className={`w-5 h-5 ${item.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {!isNews && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-primary-500 text-white text-xs rounded">
            {(data as any).rating}/10
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {isNews ? (data as any).source.name : (data as any).genre}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(isNews ? (data as any).publishedAt : (data as any).releaseDate).toLocaleDateString()}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
          {(data as any).title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {isNews ? (data as any).description : (data as any).overview}
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={handleReadMore}
            className="btn-primary text-sm"
          >
            {isNews ? 'Read More' : 'Watch Now'}
          </button>

          {!isNews && (data as any).streamingInfo && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Available on {(data as any).streamingInfo.platform}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ContentCard; 