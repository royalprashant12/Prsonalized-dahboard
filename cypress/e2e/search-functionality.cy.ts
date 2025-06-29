describe('Search Functionality E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Instagram Search', () => {
    it('should search for hashtags successfully', () => {
      // Navigate to Instagram section
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Instagram').click();
      });

      // Wait for Instagram section to load
      cy.get('[data-testid="instagram-section"]').should('be.visible');

      // Search for a hashtag
      cy.get('input[placeholder*="Search hashtags"]').type('summer');
      cy.get('button').contains('Search').click();

      // Should show loading state
      cy.get('button').contains('Searching...').should('be.visible');

      // Should show results or no results message
      cy.get('body').then(($body) => {
        if ($body.text().includes('Hashtag Results')) {
          cy.get('body').should('contain.text', 'Hashtag Results');
        } else {
          cy.get('body').should('contain.text', 'No results found');
        }
      });
    });

    it('should search for users successfully', () => {
      // Navigate to Instagram section
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Instagram').click();
      });

      // Switch to users tab
      cy.contains('Users').click();

      // Search for a user
      cy.get('input[placeholder*="Search users"]').type('testuser');
      cy.get('button').contains('Search').click();

      // Should show loading state
      cy.get('button').contains('Searching...').should('be.visible');

      // Should show results or no results message
      cy.get('body').then(($body) => {
        if ($body.text().includes('User Results')) {
          cy.get('body').should('contain.text', 'User Results');
        } else {
          cy.get('body').should('contain.text', 'No results found');
        }
      });
    });

    it('should handle empty search gracefully', () => {
      // Navigate to Instagram section
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Instagram').click();
      });

      // Try to search with empty input
      cy.get('button').contains('Search').should('be.disabled');

      // Type and clear input
      cy.get('input[placeholder*="Search hashtags"]').type('test').clear();
      cy.get('button').contains('Search').should('be.disabled');
    });

    it('should handle search with Enter key', () => {
      // Navigate to Instagram section
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Instagram').click();
      });

      // Search using Enter key
      cy.get('input[placeholder*="Search hashtags"]').type('travel{enter}');

      // Should show loading state
      cy.get('button').contains('Searching...').should('be.visible');
    });
  });

  describe('Movie Search', () => {
    it('should search for movies successfully', () => {
      // Navigate to Movies section
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Movies').click();
      });

      // Wait for movie section to load
      cy.get('[data-testid="movie-section"]').should('be.visible');

      // Search for a movie
      cy.get('input[placeholder="Search movies..."]').type('action');
      cy.get('button').contains('Search').click();

      // Should show loading state
      cy.get('button').contains('Searching...').should('be.visible');

      // Should show results or no results message
      cy.get('body').then(($body) => {
        if ($body.text().includes('Movie Recommendations')) {
          cy.get('body').should('contain.text', 'Movie Recommendations');
        } else {
          cy.get('body').should('contain.text', 'No movies found');
        }
      });
    });

    it('should handle movie search with Enter key', () => {
      // Navigate to Movies section
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Movies').click();
      });

      // Search using Enter key
      cy.get('input[placeholder="Search movies..."]').type('comedy{enter}');

      // Should show loading state
      cy.get('button').contains('Searching...').should('be.visible');
    });

    it('should clear search results when query is too short', () => {
      // Navigate to Movies section
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Movies').click();
      });

      // Search for a short query
      cy.get('input[placeholder="Search movies..."]').type('a');

      // Should not trigger search for single character
      cy.get('button').contains('Searching...').should('not.exist');
    });
  });

  describe('Content Feed Search', () => {
    it('should filter content based on search', () => {
      // Navigate to Content Feed
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Content Feed').click();
      });

      // Wait for content to load
      cy.get('[data-testid="content-feed"]').should('be.visible');

      // Search for content
      cy.get('input[placeholder*="Search"]').type('technology');
      cy.get('button').contains('Search').click();

      // Should show filtered results
      cy.get('body').should('contain.text', 'Search Results');
    });

    it('should handle no search results', () => {
      // Navigate to Content Feed
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Content Feed').click();
      });

      // Search for non-existent content
      cy.get('input[placeholder*="Search"]').type('nonexistentcontent123');
      cy.get('button').contains('Search').click();

      // Should show no results message
      cy.get('body').should('contain.text', 'No results found');
    });
  });

  describe('Search Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Intercept API calls and force them to fail
      cy.intercept('GET', '**/search_hashtags**', { statusCode: 500 }).as('hashtagSearch');
      cy.intercept('GET', '**/search_users**', { statusCode: 500 }).as('userSearch');
      cy.intercept('GET', '**/search**', { statusCode: 500 }).as('movieSearch');

      // Navigate to Instagram section
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Instagram').click();
      });

      // Search for hashtags
      cy.get('input[placeholder*="Search hashtags"]').type('test');
      cy.get('button').contains('Search').click();

      // Should show error message
      cy.get('body').should('contain.text', 'Failed to fetch results');
    });

    it('should handle timeout errors', () => {
      // Intercept API calls and delay them
      cy.intercept('GET', '**/search_hashtags**', (req) => {
        req.reply({ delay: 15000 }); // 15 second delay
      }).as('hashtagSearch');

      // Navigate to Instagram section
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Instagram').click();
      });

      // Search for hashtags
      cy.get('input[placeholder*="Search hashtags"]').type('test');
      cy.get('button').contains('Search').click();

      // Should show loading state
      cy.get('button').contains('Searching...').should('be.visible');
    });
  });

  describe('Search Performance', () => {
    it('should handle rapid successive searches', () => {
      // Navigate to Instagram section
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Instagram').click();
      });

      const searchInput = cy.get('input[placeholder*="Search hashtags"]');
      const searchButton = cy.get('button').contains('Search');

      // Perform rapid searches
      searchInput.type('search1');
      searchButton.click();

      searchInput.clear().type('search2');
      searchButton.click();

      searchInput.clear().type('search3');
      searchButton.click();

      // Should handle all searches without errors
      cy.get('body').should('not.contain.text', 'Error');
    });

    it('should debounce search input', () => {
      // Navigate to Instagram section
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Instagram').click();
      });

      const searchInput = cy.get('input[placeholder*="Search hashtags"]');

      // Type rapidly
      searchInput.type('r');
      searchInput.type('a');
      searchInput.type('p');
      searchInput.type('i');
      searchInput.type('d');

      // Should not trigger multiple searches for each keystroke
      cy.get('button').contains('Searching...').should('not.exist');
    });
  });
}); 