import axios from 'axios';
import {
  searchInstagramHashtags,
  searchInstagramUsers,
  fetchMovieRecommendations,
  searchMovies
} from '../api';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchInstagramHashtags', () => {
    it('should make correct API call for hashtag search', async () => {
      const mockResponse = {
        data: {
          hashtags: [
            { name: 'test', media_count: 1000 }
          ]
        }
      };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await searchInstagramHashtags('test');

      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://instagram-social-api.p.rapidapi.com/v1/search_hashtags',
        params: { search_query: 'test' },
        headers: {
          'x-rapidapi-key': expect.any(String),
          'x-rapidapi-host': 'instagram-social-api.p.rapidapi.com'
        }
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should return mock data when API call fails', async () => {
      mockedAxios.request.mockRejectedValue(new Error('API Error'));

      const result = await searchInstagramHashtags('test');

      expect(result).toHaveProperty('hashtags');
      expect(Array.isArray(result.hashtags)).toBe(true);
      expect(result.hashtags.length).toBeGreaterThan(0);
    });

    it('should handle empty API response', async () => {
      mockedAxios.request.mockResolvedValue({ data: null });

      const result = await searchInstagramHashtags('test');

      expect(result).toHaveProperty('hashtags');
      expect(Array.isArray(result.hashtags)).toBe(true);
    });
  });

  describe('searchInstagramUsers', () => {
    it('should make correct API call for user search', async () => {
      const mockResponse = {
        data: {
          users: [
            {
              username: 'testuser',
              full_name: 'Test User',
              follower_count: 1000
            }
          ]
        }
      };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await searchInstagramUsers('testuser');

      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://instagram-social-api.p.rapidapi.com/v1/search_users',
        params: { search_query: 'testuser' },
        headers: {
          'x-rapidapi-key': expect.any(String),
          'x-rapidapi-host': 'instagram-social-api.p.rapidapi.com'
        }
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should return mock data when API call fails', async () => {
      mockedAxios.request.mockRejectedValue(new Error('API Error'));

      const result = await searchInstagramUsers('testuser');

      expect(result).toHaveProperty('users');
      expect(Array.isArray(result.users)).toBe(true);
      expect(result.users.length).toBeGreaterThan(0);
    });

    it('should handle different response formats', async () => {
      const mockResponse = {
        data: [
          { username: 'testuser', full_name: 'Test User' }
        ]
      };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await searchInstagramUsers('testuser');

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('fetchMovieRecommendations', () => {
    it('should make correct API call for movie recommendations', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              id: '1',
              title: 'Test Movie',
              overview: 'Test overview',
              poster_path: '/test.jpg',
              release_date: '2023-01-01',
              vote_average: 4.5,
              genre_ids: [28]
            }
          ]
        }
      };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await fetchMovieRecommendations();

      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/popular',
        params: {
          api_key: expect.any(String),
          language: 'en-US',
          page: 1
        }
      });
      expect(result).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.request.mockRejectedValue(new Error('API Error'));

      const result = await fetchMovieRecommendations();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should transform movie data correctly', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              id: '1',
              title: 'Test Movie',
              overview: 'Test overview',
              poster_path: '/test.jpg',
              release_date: '2023-01-01',
              vote_average: 4.5,
              genre_ids: [28]
            }
          ]
        }
      };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await fetchMovieRecommendations();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('overview');
      expect(result[0]).toHaveProperty('posterPath');
      expect(result[0]).toHaveProperty('releaseDate');
      expect(result[0]).toHaveProperty('rating');
      expect(result[0]).toHaveProperty('genre');
    });
  });

  describe('searchMovies', () => {
    it('should make correct API call for movie search', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              id: '1',
              title: 'Test Movie',
              overview: 'Test overview',
              poster_path: '/test.jpg',
              release_date: '2023-01-01',
              vote_average: 4.5,
              genre_ids: [28]
            }
          ]
        }
      };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await searchMovies('test');

      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.themoviedb.org/3/search/movie',
        params: {
          api_key: expect.any(String),
          query: 'test',
          language: 'en-US',
          page: 1,
          include_adult: false
        }
      });
      expect(result).toBeDefined();
    });

    it('should handle empty search results', async () => {
      const mockResponse = {
        data: {
          results: []
        }
      };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const result = await searchMovies('nonexistent');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should handle API errors in movie search', async () => {
      mockedAxios.request.mockRejectedValue(new Error('API Error'));

      const result = await searchMovies('test');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockedAxios.request.mockRejectedValue(new Error('Network Error'));

      const result = await searchInstagramHashtags('test');

      expect(result).toHaveProperty('hashtags');
      expect(Array.isArray(result.hashtags)).toBe(true);
    });

    it('should handle timeout errors', async () => {
      mockedAxios.request.mockRejectedValue(new Error('Request timeout'));

      const result = await searchInstagramUsers('test');

      expect(result).toHaveProperty('users');
      expect(Array.isArray(result.users)).toBe(true);
    });

    it('should handle malformed API responses', async () => {
      mockedAxios.request.mockResolvedValue({
        data: { invalid: 'response' }
      });

      const result = await searchInstagramHashtags('test');

      expect(result).toHaveProperty('hashtags');
      expect(Array.isArray(result.hashtags)).toBe(true);
    });
  });

  describe('API Key Configuration', () => {
    it('should use environment variables for API keys', async () => {
      const mockResponse = { data: { hashtags: [] } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      await searchInstagramHashtags('test');

      const call = mockedAxios.request.mock.calls[0][0];
      expect(call.headers?.['x-rapidapi-key']).toBeDefined();
    });

    it('should handle missing API keys gracefully', async () => {
      // Temporarily remove API key
      const originalKey = process.env.REACT_APP_RAPIDAPI_KEY;
      delete process.env.REACT_APP_RAPIDAPI_KEY;

      const result = await searchInstagramHashtags('test');

      expect(result).toHaveProperty('hashtags');
      expect(Array.isArray(result.hashtags)).toBe(true);

      // Restore API key
      if (originalKey) {
        process.env.REACT_APP_RAPIDAPI_KEY = originalKey;
      }
    });
  });
}); 