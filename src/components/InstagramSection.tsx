import React, { useState } from 'react';
import { MagnifyingGlassIcon, HashtagIcon, UserIcon } from '@heroicons/react/24/outline';
import { searchInstagramHashtags, searchInstagramUsers } from '../services/api';

const InstagramSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hashtag' | 'users'>('hashtag');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      let searchResults;
      if (activeTab === 'hashtag') {
        searchResults = await searchInstagramHashtags(searchQuery);
      } else {
        searchResults = await searchInstagramUsers(searchQuery);
      }

      if (searchResults && (searchResults.users || searchResults.hashtags || Array.isArray(searchResults))) {
        const data = searchResults.users || searchResults.hashtags || searchResults;
        setResults(Array.isArray(data) ? data : []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to fetch results. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const openInstagramProfile = (username: string) => {
    window.open(`https://www.instagram.com/${username}/`, '_blank');
  };

  const formatNumber = (num: number | undefined | null) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6" data-testid="instagram-section">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Instagram Search
        </h2>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab('hashtag')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${activeTab === 'hashtag'
              ? 'bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            <HashtagIcon className="w-4 h-4 mr-2" />
            Hashtags
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${activeTab === 'users'
              ? 'bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Users
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={
                activeTab === 'hashtag'
                  ? 'Search hashtags (e.g., summer, travel, food)...'
                  : 'Search users (e.g., mrbeast, therock)...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 dark:text-red-400 mb-2">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you're seeing this message, the RapidAPI Instagram endpoints might not be working as expected.
            Check the browser console for more details.
          </p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {activeTab === 'hashtag' ? 'Hashtag Results' : 'User Results'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  if (activeTab === 'hashtag') {
                    const hashtagName = item.name || item.hashtag || searchQuery;
                    window.open(`https://www.instagram.com/explore/tags/${hashtagName}/`, '_blank');
                  } else {
                    const username = item.username || item.screen_name || item.name;
                    openInstagramProfile(username);
                  }
                }}
              >
                {activeTab === 'hashtag' ? (
                  <div className="text-center">
                    <div className="text-2xl mb-2">#{item.name || item.hashtag || searchQuery}</div>
                    {item.media_count && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatNumber(item.media_count)} posts
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.profile_pic_url || item.image || 'https://via.placeholder.com/50x50?text=No+Image'}
                      alt={item.full_name || item.name}
                      className="w-12 h-12 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/50x50?text=No+Image';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                          {item.full_name || item.name}
                        </h4>
                        {item.is_verified && (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        @{item.username || item.screen_name || item.name}
                      </p>
                      {item.follower_count && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatNumber(item.follower_count)} followers
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && results.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No results found for "{searchQuery}". Try a different search term.
          </p>
        </div>
      )}

      {!loading && !error && results.length === 0 && !searchQuery && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            {activeTab === 'hashtag'
              ? 'Search for popular hashtags to see trending content'
              : 'Search for Instagram users to discover new profiles'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default InstagramSection; 