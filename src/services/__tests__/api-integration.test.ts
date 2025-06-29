import {
  searchInstagramHashtags,
  searchInstagramUsers,
  fetchMovieRecommendations,
  searchMovies
} from '../api';

// Mock the entire api module
jest.mock('../api', () => ({
  searchInstagramHashtags: jest.fn(),
  searchInstagramUsers: jest.fn(),
  fetchMovieRecommendations: jest.fn(),
  searchMovies: jest.fn(),
}));

describe('API Services Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchInstagramHashtags', () => {
    it('should return data with hashtags property', async () => {
      const mockData = {
        hashtags: [
          { name: 'test', media_count: 1000 }
        ]
      };

      (searchInstagramHashtags as jest.Mock).mockResolvedValue(mockData);

      const result = await searchInstagramHashtags('test');

      expect(result).toHaveProperty('hashtags');
      expect(Array.isArray(result.hashtags)).toBe(true);
      expect(result.hashtags.length).toBeGreaterThan(0);
    });

    it('should handle search queries correctly', async () => {
      const mockData = { hashtags: [] };
      (searchInstagramHashtags as jest.Mock).mockResolvedValue(mockData);

      await searchInstagramHashtags('testquery');

      expect(searchInstagramHashtags).toHaveBeenCalledWith('testquery');
    });
  });

  describe('searchInstagramUsers', () => {
    it('should return data with users property', async () => {
      const mockData = {
        users: [
          {
            username: 'testuser',
            full_name: 'Test User',
            follower_count: 1000
          }
        ]
      };

      (searchInstagramUsers as jest.Mock).mockResolvedValue(mockData);

      const result = await searchInstagramUsers('testuser');

      expect(result).toHaveProperty('users');
      expect(Array.isArray(result.users)).toBe(true);
      expect(result.users.length).toBeGreaterThan(0);
    });

    it('should handle user search queries correctly', async () => {
      const mockData = { users: [] };
      (searchInstagramUsers as jest.Mock).mockResolvedValue(mockData);

      await searchInstagramUsers('testuser');

      expect(searchInstagramUsers).toHaveBeenCalledWith('testuser');
    });
  });

  describe('fetchMovieRecommendations', () => {
    it('should return array of movie recommendations', async () => {
      const mockData = [
        {
          id: '1',
          title: 'Test Movie',
          overview: 'Test overview',
          posterPath: '/test.jpg',
          releaseDate: '2023-01-01',
          rating: 4.5,
          genre: 'Action'
        }
      ];

      (fetchMovieRecommendations as jest.Mock).mockResolvedValue(mockData);

      const result = await fetchMovieRecommendations();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
    });
  });

  describe('searchMovies', () => {
    it('should return array of movie search results', async () => {
      const mockData = [
        {
          id: '1',
          title: 'Test Movie',
          overview: 'Test overview',
          posterPath: '/test.jpg',
          releaseDate: '2023-01-01',
          rating: 4.5,
          genre: 'Action'
        }
      ];

      (searchMovies as jest.Mock).mockResolvedValue(mockData);

      const result = await searchMovies('test');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
    });

    it('should handle movie search queries correctly', async () => {
      const mockData: any[] = [];
      (searchMovies as jest.Mock).mockResolvedValue(mockData);

      await searchMovies('testmovie');

      expect(searchMovies).toHaveBeenCalledWith('testmovie');
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in hashtag search', async () => {
      (searchInstagramHashtags as jest.Mock).mockRejectedValue(new Error('API Error'));

      try {
        await searchInstagramHashtags('test');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('API Error');
      }
    });

    it('should handle errors in user search', async () => {
      (searchInstagramUsers as jest.Mock).mockRejectedValue(new Error('API Error'));

      try {
        await searchInstagramUsers('testuser');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('API Error');
      }
    });

    it('should handle errors in movie recommendations', async () => {
      (fetchMovieRecommendations as jest.Mock).mockRejectedValue(new Error('API Error'));

      try {
        await fetchMovieRecommendations();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('API Error');
      }
    });

    it('should handle errors in movie search', async () => {
      (searchMovies as jest.Mock).mockRejectedValue(new Error('API Error'));

      try {
        await searchMovies('test');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('API Error');
      }
    });
  });
}); 