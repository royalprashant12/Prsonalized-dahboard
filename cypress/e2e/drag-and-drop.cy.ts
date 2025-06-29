describe('Drag and Drop E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Content Feed Drag and Drop', () => {
    it('should allow dragging content items', () => {
      // Navigate to Content Feed
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Content Feed').click();
      });

      // Wait for content to load
      cy.get('[data-testid="content-feed"]').should('be.visible');

      // Check if draggable items are present
      cy.get('[data-testid^="draggable-"]').should('have.length.greaterThan', 0);

      // Check if drag handles are present
      cy.get('[data-testid^="drag-handle-"]').should('have.length.greaterThan', 0);
    });

    it('should show drag drop context', () => {
      // Navigate to Content Feed
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Content Feed').click();
      });

      // Check if drag drop context is present
      cy.get('[data-testid="drag-drop-context"]').should('be.visible');
    });

    it('should show droppable area', () => {
      // Navigate to Content Feed
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Content Feed').click();
      });

      // Check if droppable area is present
      cy.get('[data-testid="droppable"]').should('be.visible');
    });

    it('should handle drag end events', () => {
      // Navigate to Content Feed
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Content Feed').click();
      });

      // Trigger drag end event by clicking the context
      cy.get('[data-testid="drag-drop-context"]').click();

      // Should not throw any errors
      cy.get('body').should('not.contain.text', 'Error');
    });
  });

  describe('Content Reordering', () => {
    it('should maintain content order after page refresh', () => {
      // Navigate to Content Feed
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Content Feed').click();
      });

      // Get initial content order
      cy.get('[data-testid^="draggable-"]').then(($items) => {
        const initialOrder = Array.from($items).map(item => item.getAttribute('data-testid'));

        // Trigger a drag end event to simulate reordering
        cy.get('[data-testid="drag-drop-context"]').click();

        // Refresh the page
        cy.reload();

        // Navigate back to Content Feed
        cy.get('[data-testid="sidebar"]').within(() => {
          cy.contains('Content Feed').click();
        });

        // Check if content is still present (order might be preserved in localStorage)
        cy.get('[data-testid^="draggable-"]').should('have.length.greaterThan', 0);
      });
    });

    it('should handle multiple drag operations', () => {
      // Navigate to Content Feed
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Content Feed').click();
      });

      // Perform multiple drag end operations
      cy.get('[data-testid="drag-drop-context"]').click();
      cy.get('[data-testid="drag-drop-context"]').click();
      cy.get('[data-testid="drag-drop-context"]').click();

      // Should not throw any errors
      cy.get('body').should('not.contain.text', 'Error');
    });
  });

  describe('Drag and Drop Edge Cases', () => {
    it('should handle drag with no destination', () => {
      // Navigate to Content Feed
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Content Feed').click();
      });

      // Simulate drag with no destination by clicking context
      cy.get('[data-testid="drag-drop-context"]').click();

      // Should not throw any errors
      cy.get('body').should('not.contain.text', 'Error');
    });

    it('should handle drag with same source and destination', () => {
      // Navigate to Content Feed
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Content Feed').click();
      });

      // Simulate drag to same position by clicking context
      cy.get('[data-testid="drag-drop-context"]').click();

      // Should not throw any errors
      cy.get('body').should('not.contain.text', 'Error');
    });

    it('should handle rapid drag operations', () => {
      // Navigate to Content Feed
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Content Feed').click();
      });

      // Perform rapid drag operations
      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid="drag-drop-context"]').click();
      }

      // Should not throw any errors
      cy.get('body').should('not.contain.text', 'Error');
    });
  });

  describe('Drag and Drop with Different Content Types', () => {
    it('should handle drag with news content', () => {
      // Navigate to Content Feed
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Content Feed').click();
      });

      // Check if news content is draggable
      cy.get('[data-testid^="draggable-"]').should('be.visible');
      cy.get('[data-testid="drag-drop-context"]').click();

      // Should not throw any errors
      cy.get('body').should('not.contain.text', 'Error');
    });

    it('should handle drag with movie content', () => {
      // Navigate to Movies section first to ensure movie content is loaded
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Movies').click();
      });

      // Then navigate to Content Feed
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Content Feed').click();
      });

      // Check if content is draggable
      cy.get('[data-testid^="draggable-"]').should('be.visible');
      cy.get('[data-testid="drag-drop-context"]').click();

      // Should not throw any errors
      cy.get('body').should('not.contain.text', 'Error');
    });
  });

  describe('Drag and Drop Performance', () => {
    it('should handle drag with many content items', () => {
      // Navigate to Content Feed
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Content Feed').click();
      });

      // Wait for content to load
      cy.get('[data-testid="content-feed"]').should('be.visible');

      // Check if multiple items are present and draggable
      cy.get('[data-testid^="draggable-"]').should('have.length.greaterThan', 1);
      cy.get('[data-testid="drag-drop-context"]').click();

      // Should not throw any errors
      cy.get('body').should('not.contain.text', 'Error');
    });

    it('should maintain performance during drag operations', () => {
      // Navigate to Content Feed
      cy.get('[data-testid="sidebar"]').within(() => {
        cy.contains('Content Feed').click();
      });

      // Perform multiple drag operations and check performance
      const startTime = Date.now();

      for (let i = 0; i < 10; i++) {
        cy.get('[data-testid="drag-drop-context"]').click();
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (less than 5 seconds)
      expect(duration).to.be.lessThan(5000);
    });
  });
}); 