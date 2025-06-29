import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MovieRecommendation } from '../types';
import { fetchMovieRecommendations, searchMovies } from '../services/api';
import { MagnifyingGlassIcon, PlayIcon, StarIcon } from '@heroicons/react/24/outline';

const MovieSection: React.FC = () => {
  const [movies, setMovies] = useState<MovieRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MovieRecommendation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const movieData = await fetchMovieRecommendations();
      setMovies(movieData);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMovies(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching movies:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMovieClick = (movie: MovieRecommendation) => {
    if (movie.streamingInfo?.url) {
      window.open(movie.streamingInfo.url, '_blank');
    } else {
      // Open IMDB page as fallback
      window.open(`https://www.imdb.com/title/${movie.id}`, '_blank');
    }
  };

  const displayMovies = searchQuery ? searchResults : movies;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6" data-testid="movie-section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Movie Recommendations
        </h2>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && displayMovies.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No movies found for your search.' : 'No movies available at the moment.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayMovies.map((movie) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleMovieClick(movie)}
          >
            <div className="relative">
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                }}
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center">
                <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                {movie.rating.toFixed(1)}
              </div>
              {movie.streamingInfo && (
                <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs">
                  {movie.streamingInfo.platform}
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                {movie.title}
              </h3>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {movie.releaseDate}
                </span>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {movie.genre}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                {movie.overview}
              </p>

              <div className="flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMovieClick(movie);
                  }}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  <PlayIcon className="h-4 w-4 mr-1" />
                  {movie.streamingInfo ? 'Watch Now' : 'View Details'}
                </button>

                {movie.streamingInfo && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Available on {movie.streamingInfo.platform}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {isSearching && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Searching...</span>
        </div>
      )}
    </div>
  );
};

export default MovieSection; 