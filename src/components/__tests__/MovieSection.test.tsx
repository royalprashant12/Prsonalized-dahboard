import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import MovieSection from '../MovieSection';
import * as api from '../../services/api';

// Mock the API functions
jest.mock('../../services/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('MovieSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('renders the component with correct title', () => {
      render(<MovieSection />);
      expect(screen.getByText('Movie Recommendations')).toBeInTheDocument();
    });

    it('shows search input with correct placeholder', () => {
      render(<MovieSection />);
      expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
      mockedApi.fetchMovieRecommendations.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve([]), 100))
      );

      render(<MovieSection />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Movie Recommendations', () => {
    it('displays movie recommendations on load', async () => {
      const mockMovies = [
        {
          id: '1',
          title: 'Test Movie 1',
          overview: 'A test movie description',
          posterPath: 'https://example.com/poster1.jpg',
          releaseDate: '2023-01-01',
          rating: 8.5,
          genre: 'Action',
          streamingInfo: {
            platform: 'Netflix',
            url: 'https://netflix.com/movie1'
          }
        },
        {
          id: '2',
          title: 'Test Movie 2',
          overview: 'Another test movie description',
          posterPath: 'https://example.com/poster2.jpg',
          releaseDate: '2023-02-01',
          rating: 7.8,
          genre: 'Comedy',
          streamingInfo: null
        }
      ];

      mockedApi.fetchMovieRecommendations.mockResolvedValue(mockMovies);

      render(<MovieSection />);

      await waitFor(() => {
        expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
        expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
        expect(screen.getByText('A test movie description')).toBeInTheDocument();
        expect(screen.getByText('Another test movie description')).toBeInTheDocument();
      });
    });

    it('displays movie ratings correctly', async () => {
      const mockMovies = [
        {
          id: '1',
          title: 'Test Movie',
          overview: 'Test description',
          posterPath: 'https://example.com/poster.jpg',
          releaseDate: '2023-01-01',
          rating: 8.5,
          genre: 'Action',
          streamingInfo: null
        }
      ];

      mockedApi.fetchMovieRecommendations.mockResolvedValue(mockMovies);

      render(<MovieSection />);

      await waitFor(() => {
        expect(screen.getByText('8.5')).toBeInTheDocument();
      });
    });

    it('displays streaming platform when available', async () => {
      const mockMovies = [
        {
          id: '1',
          title: 'Test Movie',
          overview: 'Test description',
          posterPath: 'https://example.com/poster.jpg',
          releaseDate: '2023-01-01',
          rating: 8.5,
          genre: 'Action',
          streamingInfo: {
            platform: 'Netflix',
            url: 'https://netflix.com/movie1'
          }
        }
      ];

      mockedApi.fetchMovieRecommendations.mockResolvedValue(mockMovies);

      render(<MovieSection />);

      await waitFor(() => {
        expect(screen.getByText('Netflix')).toBeInTheDocument();
        expect(screen.getByText('Available on Netflix')).toBeInTheDocument();
      });
    });

    it('shows "View Details" when no streaming info is available', async () => {
      const mockMovies = [
        {
          id: '1',
          title: 'Test Movie',
          overview: 'Test description',
          posterPath: 'https://example.com/poster.jpg',
          releaseDate: '2023-01-01',
          rating: 8.5,
          genre: 'Action',
          streamingInfo: null
        }
      ];

      mockedApi.fetchMovieRecommendations.mockResolvedValue(mockMovies);

      render(<MovieSection />);

      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
      });
    });

    it('handles empty movie recommendations', async () => {
      mockedApi.fetchMovieRecommendations.mockResolvedValue([]);

      render(<MovieSection />);

      await waitFor(() => {
        expect(screen.getByText('No movies available at the moment.')).toBeInTheDocument();
      });
    });

    it('handles API error for recommendations', async () => {
      mockedApi.fetchMovieRecommendations.mockRejectedValue(new Error('API Error'));

      render(<MovieSection />);

      await waitFor(() => {
        expect(screen.getByText('No movies available at the moment.')).toBeInTheDocument();
      });
    });
  });

  describe('Movie Search', () => {
    it('performs search when search button is clicked', async () => {
      const mockSearchResults = [
        {
          id: '1',
          title: 'Search Result Movie',
          overview: 'Search result description',
          posterPath: 'https://example.com/search-poster.jpg',
          releaseDate: '2023-01-01',
          rating: 8.0,
          genre: 'Drama',
          streamingInfo: null
        }
      ];

      mockedApi.fetchMovieRecommendations.mockResolvedValue([]);
      mockedApi.searchMovies.mockResolvedValue(mockSearchResults);

      render(<MovieSection />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search movies...');
        fireEvent.change(searchInput, { target: { value: 'test' } });
      });

      await waitFor(() => {
        expect(screen.getByText('Search Result Movie')).toBeInTheDocument();
      });
    });

    it('performs search when Enter key is pressed', async () => {
      const mockSearchResults = [
        {
          id: '1',
          title: 'Enter Search Movie',
          overview: 'Enter search description',
          posterPath: 'https://example.com/enter-poster.jpg',
          releaseDate: '2023-01-01',
          rating: 7.5,
          genre: 'Thriller',
          streamingInfo: null
        }
      ];

      mockedApi.fetchMovieRecommendations.mockResolvedValue([]);
      mockedApi.searchMovies.mockResolvedValue(mockSearchResults);

      render(<MovieSection />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search movies...');
        fireEvent.change(searchInput, { target: { value: 'enter' } });
        fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter' });
      });

      await waitFor(() => {
        expect(screen.getByText('Enter Search Movie')).toBeInTheDocument();
      });
    });

    it('shows loading state during search', async () => {
      mockedApi.fetchMovieRecommendations.mockResolvedValue([]);
      mockedApi.searchMovies.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve([]), 100))
      );

      render(<MovieSection />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search movies...');
        fireEvent.change(searchInput, { target: { value: 'loading' } });
      });

      await waitFor(() => {
        expect(screen.getByText('Searching...')).toBeInTheDocument();
      });
    });

    it('handles empty search results', async () => {
      mockedApi.fetchMovieRecommendations.mockResolvedValue([]);
      mockedApi.searchMovies.mockResolvedValue([]);

      render(<MovieSection />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search movies...');
        fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      });

      await waitFor(() => {
        expect(screen.getByText('No movies found for your search.')).toBeInTheDocument();
      });
    });

    it('handles search API errors', async () => {
      mockedApi.fetchMovieRecommendations.mockResolvedValue([]);
      mockedApi.searchMovies.mockRejectedValue(new Error('Search API Error'));

      render(<MovieSection />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search movies...');
        fireEvent.change(searchInput, { target: { value: 'error' } });
      });

      await waitFor(() => {
        expect(screen.getByText('No movies found for your search.')).toBeInTheDocument();
      });
    });

    it('clears search results when query is too short', async () => {
      const mockMovies = [
        {
          id: '1',
          title: 'Original Movie',
          overview: 'Original description',
          posterPath: 'https://example.com/original.jpg',
          releaseDate: '2023-01-01',
          rating: 8.0,
          genre: 'Action',
          streamingInfo: null
        }
      ];

      mockedApi.fetchMovieRecommendations.mockResolvedValue(mockMovies);

      render(<MovieSection />);

      await waitFor(() => {
        expect(screen.getByText('Original Movie')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search movies...');
      fireEvent.change(searchInput, { target: { value: 'a' } });

      await waitFor(() => {
        expect(screen.getByText('Original Movie')).toBeInTheDocument();
      });
    });
  });

  describe('Movie Interactions', () => {
    it('opens streaming URL when movie with streaming info is clicked', async () => {
      const mockMovies = [
        {
          id: '1',
          title: 'Streaming Movie',
          overview: 'Streaming description',
          posterPath: 'https://example.com/streaming.jpg',
          releaseDate: '2023-01-01',
          rating: 8.0,
          genre: 'Action',
          streamingInfo: {
            platform: 'Netflix',
            url: 'https://netflix.com/streaming-movie'
          }
        }
      ];

      mockedApi.fetchMovieRecommendations.mockResolvedValue(mockMovies);

      const mockOpen = jest.fn();
      Object.defineProperty(window, 'open', {
        value: mockOpen,
        writable: true
      });

      render(<MovieSection />);

      await waitFor(() => {
        const movieCard = screen.getByText('Streaming Movie');
        fireEvent.click(movieCard);
        expect(mockOpen).toHaveBeenCalledWith('https://netflix.com/streaming-movie', '_blank');
      });
    });

    it('opens IMDB page when movie without streaming info is clicked', async () => {
      const mockMovies = [
        {
          id: 'tt1234567',
          title: 'IMDB Movie',
          overview: 'IMDB description',
          posterPath: 'https://example.com/imdb.jpg',
          releaseDate: '2023-01-01',
          rating: 8.0,
          genre: 'Action',
          streamingInfo: null
        }
      ];

      mockedApi.fetchMovieRecommendations.mockResolvedValue(mockMovies);

      const mockOpen = jest.fn();
      Object.defineProperty(window, 'open', {
        value: mockOpen,
        writable: true
      });

      render(<MovieSection />);

      await waitFor(() => {
        const movieCard = screen.getByText('IMDB Movie');
        fireEvent.click(movieCard);
        expect(mockOpen).toHaveBeenCalledWith('https://www.imdb.com/title/tt1234567', '_blank');
      });
    });

    it('opens streaming URL when Watch Now button is clicked', async () => {
      const mockMovies = [
        {
          id: '1',
          title: 'Button Movie',
          overview: 'Button description',
          posterPath: 'https://example.com/button.jpg',
          releaseDate: '2023-01-01',
          rating: 8.0,
          genre: 'Action',
          streamingInfo: {
            platform: 'Netflix',
            url: 'https://netflix.com/button-movie'
          }
        }
      ];

      mockedApi.fetchMovieRecommendations.mockResolvedValue(mockMovies);

      const mockOpen = jest.fn();
      Object.defineProperty(window, 'open', {
        value: mockOpen,
        writable: true
      });

      render(<MovieSection />);

      await waitFor(() => {
        const watchButton = screen.getByText('Watch Now');
        fireEvent.click(watchButton);
        expect(mockOpen).toHaveBeenCalledWith('https://netflix.com/button-movie', '_blank');
      });
    });

    it('opens IMDB page when View Details button is clicked', async () => {
      const mockMovies = [
        {
          id: 'tt7654321',
          title: 'Details Movie',
          overview: 'Details description',
          posterPath: 'https://example.com/details.jpg',
          releaseDate: '2023-01-01',
          rating: 8.0,
          genre: 'Action',
          streamingInfo: null
        }
      ];

      mockedApi.fetchMovieRecommendations.mockResolvedValue(mockMovies);

      const mockOpen = jest.fn();
      Object.defineProperty(window, 'open', {
        value: mockOpen,
        writable: true
      });

      render(<MovieSection />);

      await waitFor(() => {
        const detailsButton = screen.getByText('View Details');
        fireEvent.click(detailsButton);
        expect(mockOpen).toHaveBeenCalledWith('https://www.imdb.com/title/tt7654321', '_blank');
      });
    });
  });

  describe('Image Error Handling', () => {
    it('shows placeholder image when poster fails to load', async () => {
      const mockMovies = [
        {
          id: '1',
          title: 'Broken Image Movie',
          overview: 'Broken image description',
          posterPath: 'https://invalid-url.com/poster.jpg',
          releaseDate: '2023-01-01',
          rating: 8.0,
          genre: 'Action',
          streamingInfo: null
        }
      ];

      mockedApi.fetchMovieRecommendations.mockResolvedValue(mockMovies);

      render(<MovieSection />);

      await waitFor(() => {
        const movieImage = screen.getByAltText('Broken Image Movie');
        fireEvent.error(movieImage);
        expect(movieImage).toHaveAttribute('src', 'https://via.placeholder.com/300x450?text=No+Poster');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles movies with missing data gracefully', async () => {
      const mockMovies = [
        {
          id: '1',
          title: 'Incomplete Movie',
          overview: null,
          posterPath: null,
          releaseDate: null,
          rating: null,
          genre: null,
          streamingInfo: null
        }
      ];

      mockedApi.fetchMovieRecommendations.mockResolvedValue(mockMovies);

      render(<MovieSection />);

      await waitFor(() => {
        expect(screen.getByText('Incomplete Movie')).toBeInTheDocument();
      });
    });

    it('handles rapid search queries', async () => {
      mockedApi.fetchMovieRecommendations.mockResolvedValue([]);
      mockedApi.searchMovies.mockResolvedValue([]);

      render(<MovieSection />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search movies...');

        // Rapidly change search query
        fireEvent.change(searchInput, { target: { value: 'query1' } });
        fireEvent.change(searchInput, { target: { value: 'query2' } });
        fireEvent.change(searchInput, { target: { value: 'query3' } });
      });

      // Should handle rapid changes without errors
      await waitFor(() => {
        expect(mockedApi.searchMovies).toHaveBeenCalled();
      });
    });

    it('handles network timeout during search', async () => {
      mockedApi.fetchMovieRecommendations.mockResolvedValue([]);
      mockedApi.searchMovies.mockRejectedValue(new Error('Network timeout'));

      render(<MovieSection />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search movies...');
        fireEvent.change(searchInput, { target: { value: 'timeout' } });
      });

      await waitFor(() => {
        expect(screen.getByText('No movies found for your search.')).toBeInTheDocument();
      });
    });
  });
}); 