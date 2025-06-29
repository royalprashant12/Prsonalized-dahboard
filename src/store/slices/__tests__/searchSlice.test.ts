import searchSlice, {
  setSearchQuery,
  setSearchResults,
  setMovieResults,
  clearSearch,
} from '../searchSlice';
import { ContentItem, MovieRecommendation } from '../../../types';

describe('searchSlice', () => {
  const initialState = {
    query: '',
    results: [],
    movieResults: [],
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(searchSlice(undefined, { type: undefined })).toEqual(initialState);
    });
  });

  describe('setSearchQuery', () => {
    it('should update search query', () => {
      const query = 'test search';
      const action = setSearchQuery(query);
      const state = searchSlice(initialState, action);

      expect(state.query).toBe(query);
    });

    it('should handle empty search query', () => {
      const action = setSearchQuery('');
      const state = searchSlice(initialState, action);

      expect(state.query).toBe('');
    });

    it('should handle special characters in search query', () => {
      const query = 'test@#$%^&*()';
      const action = setSearchQuery(query);
      const state = searchSlice(initialState, action);

      expect(state.query).toBe(query);
    });
  });

  describe('setSearchResults', () => {
    it('should update search results', () => {
      const mockResults: ContentItem[] = [
        {
          id: '1',
          type: 'news',
          data: {
            id: '1',
            title: 'Test News',
            overview: 'Test overview',
            posterPath: 'test.jpg',
            releaseDate: '2023-01-01',
            rating: 4.5,
            genre: 'Technology',
          },
          isFavorite: false,
          timestamp: Date.now(),
        },
      ];

      const action = setSearchResults(mockResults);
      const state = searchSlice(initialState, action);

      expect(state.results).toEqual(mockResults);
    });

    it('should handle empty search results', () => {
      const action = setSearchResults([]);
      const state = searchSlice(initialState, action);

      expect(state.results).toEqual([]);
    });

    it('should replace existing results with new ones', () => {
      const existingResults: ContentItem[] = [
        {
          id: '1',
          type: 'news',
          data: {
            id: '1',
            title: 'Old News',
            overview: 'Old overview',
            posterPath: 'old.jpg',
            releaseDate: '2023-01-01',
            rating: 3.0,
            genre: 'Technology',
          },
          isFavorite: false,
          timestamp: Date.now(),
        },
      ];

      const newResults: ContentItem[] = [
        {
          id: '2',
          type: 'instagram',
          data: {
            id: '2',
            title: 'New Post',
            overview: 'New overview',
            posterPath: 'new.jpg',
            releaseDate: '2023-01-02',
            rating: 4.5,
            genre: 'Social',
          },
          isFavorite: true,
          timestamp: Date.now(),
        },
      ];

      let state = searchSlice(initialState, setSearchResults(existingResults));
      state = searchSlice(state, setSearchResults(newResults));

      expect(state.results).toEqual(newResults);
      expect(state.results).not.toEqual(existingResults);
    });
  });

  describe('setMovieResults', () => {
    it('should update movie results', () => {
      const mockMovieResults: MovieRecommendation[] = [
        {
          id: '1',
          title: 'Test Movie',
          overview: 'Test movie overview',
          posterPath: 'movie.jpg',
          releaseDate: '2023-01-01',
          rating: 4.5,
          genre: 'Action',
          streamingInfo: {
            platform: 'Netflix',
            url: 'https://netflix.com/movie',
          },
        },
      ];

      const action = setMovieResults(mockMovieResults);
      const state = searchSlice(initialState, action);

      expect(state.movieResults).toEqual(mockMovieResults);
    });

    it('should handle empty movie results', () => {
      const action = setMovieResults([]);
      const state = searchSlice(initialState, action);

      expect(state.movieResults).toEqual([]);
    });

    it('should replace existing movie results with new ones', () => {
      const existingMovies: MovieRecommendation[] = [
        {
          id: '1',
          title: 'Old Movie',
          overview: 'Old movie overview',
          posterPath: 'old.jpg',
          releaseDate: '2023-01-01',
          rating: 3.0,
          genre: 'Drama',
        },
      ];

      const newMovies: MovieRecommendation[] = [
        {
          id: '2',
          title: 'New Movie',
          overview: 'New movie overview',
          posterPath: 'new.jpg',
          releaseDate: '2023-01-02',
          rating: 4.5,
          genre: 'Comedy',
        },
      ];

      let state = searchSlice(initialState, setMovieResults(existingMovies));
      state = searchSlice(state, setMovieResults(newMovies));

      expect(state.movieResults).toEqual(newMovies);
      expect(state.movieResults).not.toEqual(existingMovies);
    });
  });

  describe('clearSearch', () => {
    it('should clear all search state', () => {
      const stateWithData = {
        query: 'test query',
        results: [
          {
            id: '1',
            type: 'news',
            data: {
              id: '1',
              title: 'Test News',
              overview: 'Test overview',
              posterPath: 'test.jpg',
              releaseDate: '2023-01-01',
              rating: 4.5,
              genre: 'Technology',
            },
            isFavorite: false,
            timestamp: Date.now(),
          },
        ],
        movieResults: [
          {
            id: '1',
            title: 'Test Movie',
            overview: 'Test movie overview',
            posterPath: 'movie.jpg',
            releaseDate: '2023-01-01',
            rating: 4.5,
            genre: 'Action',
          },
        ],
      };

      const action = clearSearch();
      const state = searchSlice(stateWithData, action);

      expect(state.query).toBe('');
      expect(state.results).toEqual([]);
      expect(state.movieResults).toEqual([]);
    });

    it('should handle clearing already empty state', () => {
      const action = clearSearch();
      const state = searchSlice(initialState, action);

      expect(state.query).toBe('');
      expect(state.results).toEqual([]);
      expect(state.movieResults).toEqual([]);
    });
  });

  describe('state isolation', () => {
    it('should not affect other state properties when updating query', () => {
      const stateWithResults = {
        ...initialState,
        results: [{
          id: '1',
          type: 'news' as const,
          data: {
            id: '1',
            title: 'Test News',
            overview: 'Test overview',
            posterPath: 'test.jpg',
            releaseDate: '2023-01-01',
            rating: 4.5,
            genre: 'Technology',
          },
          isFavorite: false,
          timestamp: Date.now()
        }],
        movieResults: [{ id: '1', title: 'Movie', overview: '', posterPath: '', releaseDate: '', rating: 4, genre: '' }],
      };

      const action = setSearchQuery('new query');
      const state = searchSlice(stateWithResults, action);

      expect(state.query).toBe('new query');
      expect(state.results).toEqual(stateWithResults.results);
      expect(state.movieResults).toEqual(stateWithResults.movieResults);
    });

    it('should not affect other state properties when updating results', () => {
      const stateWithQuery = {
        ...initialState,
        query: 'test query',
        movieResults: [{ id: '1', title: 'Movie', overview: '', posterPath: '', releaseDate: '', rating: 4, genre: '' }],
      };

      const newResults: ContentItem[] = [
        {
          id: '2',
          type: 'instagram',
          data: {
            id: '2',
            title: 'New Post',
            overview: 'New overview',
            posterPath: 'new.jpg',
            releaseDate: '2023-01-02',
            rating: 4.5,
            genre: 'Social',
          },
          isFavorite: true,
          timestamp: Date.now(),
        },
      ];

      const action = setSearchResults(newResults);
      const state = searchSlice(stateWithQuery, action);

      expect(state.results).toEqual(newResults);
      expect(state.query).toBe(stateWithQuery.query);
      expect(state.movieResults).toEqual(stateWithQuery.movieResults);
    });
  });
}); 