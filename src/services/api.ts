import axios from 'axios';
import { NewsArticle, MovieRecommendation } from '../types';

const NEWS_API_KEY = '2e4e3a1ca34e4179a5e52faa10383af7';
const RAPIDAPI_KEY = '583684257emsh2a6c2e0da99f595p19c65cjsn888dbc9e48b2';

// Fetch top 100 movies from RapidAPI
export const fetchMovieRecommendations = async (): Promise<MovieRecommendation[]> => {
  try {
    const response = await axios.get('https://imdb-top-100-movies.p.rapidapi.com/', {
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com',
      },
    });
    return response.data.map((movie: any) => ({
      id: movie.imdbid || movie.id,
      title: movie.title,
      overview: movie.description,
      posterPath: movie.image,
      releaseDate: movie.year ? movie.year.toString() : '',
      rating: parseFloat(movie.rating),
      genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre,
      streamingInfo: {
        platform: 'IMDB',
        url: movie.imdb_link,
      },
    }));
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

// Fetch trending movies (simulate by taking the first 10 from top 100)
export const fetchTrendingMovies = async (): Promise<MovieRecommendation[]> => {
  try {
    const response = await axios.get('https://imdb-top-100-movies.p.rapidapi.com/', {
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com',
      },
    });
    return response.data.slice(0, 10).map((movie: any) => ({
      id: movie.imdbid || movie.id,
      title: movie.title,
      overview: movie.description,
      posterPath: movie.image,
      releaseDate: movie.year ? movie.year.toString() : '',
      rating: parseFloat(movie.rating),
      genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre,
      streamingInfo: {
        platform: 'IMDB',
        url: movie.imdb_link,
      },
    }));
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

const newsApi = axios.create({
  baseURL: 'https://newsapi.org/v2',
});

export const fetchNewsContent = async (categories: string[]): Promise<NewsArticle[]> => {
  try {
    const promises = categories.map(async (category) => {
      const response = await newsApi.get('/top-headlines', {
        params: {
          country: 'us',
          category: category,
          apiKey: NEWS_API_KEY,
          pageSize: 5,
        },
      });
      return response.data.articles.map((article: any, index: number) => ({
        ...article,
        id: `${category}-${index}`,
        category,
      }));
    });

    const results = await Promise.all(promises);
    return results.flat();
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

// Search movies by title
export const searchMovies = async (query: string): Promise<MovieRecommendation[]> => {
  try {
    const response = await axios.get(`https://imdb236.p.rapidapi.com/api/imdb/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'imdb236.p.rapidapi.com'
      }
    });

    if (!response.data || !Array.isArray(response.data)) {
      return [];
    }

    return response.data.slice(0, 10).map((movie: any) => ({
      id: movie.id || movie.imdb_id,
      title: movie.title || 'Unknown Title',
      overview: movie.plot || 'No description available',
      posterPath: movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster',
      releaseDate: movie.release_date || 'Unknown',
      rating: parseFloat(movie.rating || '0'),
      genre: movie.genre || 'Unknown',
      streamingInfo: null
    }));

  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

// Get movie details by ID
export const getMovieDetails = async (movieId: string): Promise<MovieRecommendation | null> => {
  try {
    const response = await axios.get(`https://imdb236.p.rapidapi.com/api/imdb/${movieId}`, {
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'imdb236.p.rapidapi.com'
      }
    });
    const movie = response.data;

    if (!movie) {
      return null;
    }

    // Get streaming availability
    let streamingInfo = null;
    try {
      const streamingResponse = await axios.get(`https://imdb236.p.rapidapi.com/api/imdb/${movieId}/streaming`, {
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'imdb236.p.rapidapi.com'
        }
      });
      if (streamingResponse.data && streamingResponse.data.length > 0) {
        streamingInfo = {
          platform: streamingResponse.data[0].platform || 'Multiple Platforms',
          url: streamingResponse.data[0].url || 'https://www.imdb.com'
        };
      }
    } catch (streamingError) {
      console.log('Streaming info not available for:', movieId);
    }

    return {
      id: movie.id || movie.imdb_id,
      title: movie.title || 'Unknown Title',
      overview: movie.plot || 'No description available',
      posterPath: movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster',
      releaseDate: movie.release_date || 'Unknown',
      rating: parseFloat(movie.rating || '0'),
      genre: movie.genre || 'Unknown',
      streamingInfo: streamingInfo
    };

  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export const searchContent = async (query: string): Promise<NewsArticle[]> => {
  try {
    const response = await newsApi.get('/everything', {
      params: {
        q: query,
        apiKey: NEWS_API_KEY,
        pageSize: 10,
        sortBy: 'relevancy',
      },
    });
    return response.data.articles.map((article: any, index: number) => ({
      ...article,
      id: `search-${index}`,
      category: 'search',
    }));
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
};

export const searchAllContent = async (query: string) => {
  try {
    const [newsResults, movieResults] = await Promise.all([
      searchContent(query),
      searchMovies(query),
    ]);

    return {
      news: newsResults,
      movies: movieResults,
    };
  } catch (error) {
    console.error('Error searching all content:', error);
    return {
      news: [],
      movies: [],
    };
  }
};

// Instagram API functions using RapidAPI
export const searchInstagramHashtags = async (hashtag: string): Promise<any> => {
  try {
    console.log('Searching hashtag:', hashtag);

    const options = {
      method: 'GET',
      url: 'https://instagram-social-api.p.rapidapi.com/v1/hashtag',
      params: { hashtag },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'instagram-social-api.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    console.log('Hashtag API response:', response.data);

    // If the API returns data, use it; otherwise return mock data
    if (response.data && (response.data.name || response.data.hashtag)) {
      return response.data;
    } else {
      // Return mock data for testing
      return {
        name: hashtag,
        media_count: Math.floor(Math.random() * 1000000) + 1000,
        top_posts: []
      };
    }
  } catch (error) {
    console.error('Error searching Instagram hashtags:', error);
    // Return mock data on error
    return {
      name: hashtag,
      media_count: Math.floor(Math.random() * 1000000) + 1000,
      top_posts: []
    };
  }
};

export const searchInstagramUsers = async (searchQuery: string): Promise<any> => {
  try {
    console.log('Searching users:', searchQuery);

    const options = {
      method: 'GET',
      url: 'https://instagram-social-api.p.rapidapi.com/v1/search_users',
      params: { search_query: searchQuery },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'instagram-social-api.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    console.log('Users API response:', response.data);

    // If the API returns data, use it; otherwise return mock data
    if (response.data && (response.data.users || Array.isArray(response.data))) {
      return response.data;
    } else {
      // Return mock data for testing
      return {
        users: [
          {
            username: searchQuery,
            full_name: `${searchQuery} User`,
            profile_pic_url: 'https://via.placeholder.com/150x150?text=User',
            is_verified: false,
            follower_count: Math.floor(Math.random() * 1000000) + 1000,
            following_count: Math.floor(Math.random() * 1000) + 100,
            media_count: Math.floor(Math.random() * 100) + 10
          },
          {
            username: `${searchQuery}_official`,
            full_name: `${searchQuery} Official`,
            profile_pic_url: 'https://via.placeholder.com/150x150?text=Official',
            is_verified: true,
            follower_count: Math.floor(Math.random() * 5000000) + 100000,
            following_count: Math.floor(Math.random() * 1000) + 100,
            media_count: Math.floor(Math.random() * 500) + 50
          }
        ]
      };
    }
  } catch (error) {
    console.error('Error searching Instagram users:', error);
    // Return mock data on error
    return {
      users: [
        {
          username: searchQuery,
          full_name: `${searchQuery} User`,
          profile_pic_url: 'https://via.placeholder.com/150x150?text=User',
          is_verified: false,
          follower_count: Math.floor(Math.random() * 1000000) + 1000,
          following_count: Math.floor(Math.random() * 1000) + 100,
          media_count: Math.floor(Math.random() * 100) + 10
        },
        {
          username: `${searchQuery}_official`,
          full_name: `${searchQuery} Official`,
          profile_pic_url: 'https://via.placeholder.com/150x150?text=Official',
          is_verified: true,
          follower_count: Math.floor(Math.random() * 5000000) + 100000,
          following_count: Math.floor(Math.random() * 1000) + 100,
          media_count: Math.floor(Math.random() * 500) + 50
        }
      ]
    };
  }
}; 