import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem, NewsArticle, MovieRecommendation } from '../../types';
import { fetchNewsContent, fetchMovieRecommendations } from '../../services/api';

interface ContentState {
  items: ContentItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async (categories: string[], { getState }: any) => {
    const [newsData, movieData] = await Promise.all([
      fetchNewsContent(categories),
      fetchMovieRecommendations(),
    ]);

    // Get current favorites from state
    const state = getState() as any;
    const currentFavorites = state.userPreferences.favorites || [];

    const newsItems: ContentItem[] = newsData.map((article: NewsArticle) => ({
      id: `news-${article.id}`,
      type: 'news' as const,
      data: article,
      isFavorite: currentFavorites.includes(`news-${article.id}`),
      timestamp: Date.now(),
    }));

    const movieItems: ContentItem[] = movieData.map((movie: MovieRecommendation) => ({
      id: `movie-${movie.id}`,
      type: 'movie' as const,
      data: movie,
      isFavorite: currentFavorites.includes(`movie-${movie.id}`),
      timestamp: Date.now(),
    }));

    return [...newsItems, ...movieItems];
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      console.log('toggleFavorite reducer called with:', action.payload);
      console.log('Current items:', state.items);

      const item = state.items.find(item => item.id === action.payload);
      console.log('Found item to toggle:', item);

      if (item) {
        console.log('Item before toggle:', item.isFavorite);
        item.isFavorite = !item.isFavorite;
        console.log('Item after toggle:', item.isFavorite);
      } else {
        console.log('Item not found in state');
      }
    },
    clearContent: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch content';
      });
  },
});

export const { toggleFavorite, clearContent } = contentSlice.actions;
export default contentSlice.reducer; 