import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem, MovieRecommendation } from '../../types';

interface SearchState {
  query: string;
  results: ContentItem[];
  movieResults: MovieRecommendation[];
}

const initialState: SearchState = {
  query: '',
  results: [],
  movieResults: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<ContentItem[]>) => {
      state.results = action.payload;
    },
    setMovieResults: (state, action: PayloadAction<MovieRecommendation[]>) => {
      state.movieResults = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.movieResults = [];
    },
  },
});

export const { setSearchQuery, setSearchResults, setMovieResults, clearSearch } = searchSlice.actions;
export default searchSlice.reducer; 