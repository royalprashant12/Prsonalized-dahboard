import userPreferencesSlice, {
  setCategories,
  toggleDarkMode,
  addFavorite,
  removeFavorite,
  clearFavorites,
} from '../userPreferencesSlice';

describe('userPreferencesSlice', () => {
  const initialState = {
    categories: ['technology', 'sports', 'finance'],
    darkMode: false,
    favorites: [],
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(userPreferencesSlice(undefined, { type: undefined })).toEqual(initialState);
    });
  });

  describe('setCategories', () => {
    it('should update categories', () => {
      const newCategories = ['news', 'entertainment'];
      const action = setCategories(newCategories);
      const state = userPreferencesSlice(initialState, action);

      expect(state.categories).toEqual(newCategories);
    });
  });

  describe('toggleDarkMode', () => {
    it('should toggle dark mode from false to true', () => {
      const action = toggleDarkMode();
      const state = userPreferencesSlice(initialState, action);

      expect(state.darkMode).toBe(true);
    });

    it('should toggle dark mode from true to false', () => {
      const stateWithDarkMode = { ...initialState, darkMode: true };
      const action = toggleDarkMode();
      const state = userPreferencesSlice(stateWithDarkMode, action);

      expect(state.darkMode).toBe(false);
    });
  });

  describe('addFavorite', () => {
    it('should add a new favorite item', () => {
      const itemId = 'item123';
      const action = addFavorite(itemId);
      const state = userPreferencesSlice(initialState, action);

      expect(state.favorites).toContain(itemId);
    });

    it('should not add duplicate favorite items', () => {
      const itemId = 'item123';
      const stateWithFavorites = { ...initialState, favorites: [itemId] };
      const action = addFavorite(itemId);
      const state = userPreferencesSlice(stateWithFavorites, action);

      expect(state.favorites).toEqual([itemId]);
      expect(state.favorites.length).toBe(1);
    });

    it('should add multiple different favorite items', () => {
      const itemId1 = 'item123';
      const itemId2 = 'item456';

      let state = userPreferencesSlice(initialState, addFavorite(itemId1));
      state = userPreferencesSlice(state, addFavorite(itemId2));

      expect(state.favorites).toContain(itemId1);
      expect(state.favorites).toContain(itemId2);
      expect(state.favorites.length).toBe(2);
    });
  });

  describe('removeFavorite', () => {
    it('should remove an existing favorite item', () => {
      const itemId = 'item123';
      const stateWithFavorites = { ...initialState, favorites: [itemId, 'item456'] };
      const action = removeFavorite(itemId);
      const state = userPreferencesSlice(stateWithFavorites, action);

      expect(state.favorites).not.toContain(itemId);
      expect(state.favorites).toContain('item456');
    });

    it('should handle removing non-existent favorite item', () => {
      const itemId = 'item123';
      const stateWithFavorites = { ...initialState, favorites: ['item456'] };
      const action = removeFavorite(itemId);
      const state = userPreferencesSlice(stateWithFavorites, action);

      expect(state.favorites).toEqual(['item456']);
    });

    it('should handle removing from empty favorites list', () => {
      const itemId = 'item123';
      const action = removeFavorite(itemId);
      const state = userPreferencesSlice(initialState, action);

      expect(state.favorites).toEqual([]);
    });
  });

  describe('clearFavorites', () => {
    it('should clear all favorite items', () => {
      const stateWithFavorites = {
        ...initialState,
        favorites: ['item123', 'item456', 'item789']
      };
      const action = clearFavorites();
      const state = userPreferencesSlice(stateWithFavorites, action);

      expect(state.favorites).toEqual([]);
    });

    it('should handle clearing empty favorites list', () => {
      const action = clearFavorites();
      const state = userPreferencesSlice(initialState, action);

      expect(state.favorites).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string as favorite item', () => {
      const action = addFavorite('');
      const state = userPreferencesSlice(initialState, action);

      expect(state.favorites).toContain('');
    });

    it('should handle special characters in favorite item IDs', () => {
      const itemId = 'item#123@test';
      const action = addFavorite(itemId);
      const state = userPreferencesSlice(initialState, action);

      expect(state.favorites).toContain(itemId);
    });

    it('should preserve other state properties when modifying favorites', () => {
      const itemId = 'item123';
      const action = addFavorite(itemId);
      const state = userPreferencesSlice(initialState, action);

      expect(state.categories).toEqual(initialState.categories);
      expect(state.darkMode).toBe(initialState.darkMode);
    });
  });
}); 