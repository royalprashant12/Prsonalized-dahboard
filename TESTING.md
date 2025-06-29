# Testing Documentation

This document provides comprehensive information about the testing setup for the Personalized Dashboard application.

## Testing Overview

The application uses a multi-layered testing approach:

1. **Unit Tests**: Test individual components and functions in isolation
2. **Integration Tests**: Test component interactions and Redux store integration
3. **E2E Tests**: Test complete user workflows using Cypress

## Test Structure

```
src/
├── components/
│   ├── __tests__/
│   │   ├── InstagramSection.test.tsx      # Unit tests for Instagram component
│   │   ├── MovieSection.test.tsx          # Unit tests for Movie component
│   │   └── ContentFeed.integration.test.tsx # Integration tests for ContentFeed
├── test-utils.tsx                         # Custom test utilities
└── setupTests.ts                          # Global test configuration

cypress/
├── e2e/
│   ├── search-functionality.cy.ts         # E2E tests for search features
│   └── drag-and-drop.cy.ts                # E2E tests for drag-and-drop
└── cypress.config.ts                      # Cypress configuration
```

## Running Tests

### Unit and Integration Tests

```bash
# Run all tests in watch mode
npm test

# Run tests with coverage
npm run test:coverage

# Run tests once (CI mode)
npm test -- --watchAll=false
```

### E2E Tests

```bash
# Run E2E tests in headless mode
npm run test:e2e

# Open Cypress test runner
npm run test:e2e:open
```

## Test Types

### 1. Unit Tests

Unit tests focus on testing individual components and functions in isolation.

#### InstagramSection Tests
- **Initial Render**: Verifies component renders correctly with proper title, tabs, and placeholder text
- **Tab Navigation**: Tests switching between hashtag and user search tabs
- **Hashtag Search**: Tests hashtag search functionality, API calls, and result display
- **User Search**: Tests user search functionality and result rendering
- **Search Input Validation**: Tests input validation and button state management
- **Click Handlers**: Tests external link opening and user interactions
- **Edge Cases**: Tests error handling, network timeouts, and rapid searches

#### MovieSection Tests
- **Initial Render**: Verifies component renders with proper title and search input
- **Movie Recommendations**: Tests loading and displaying movie recommendations
- **Movie Search**: Tests search functionality and result filtering
- **Movie Interactions**: Tests clicking on movies and opening external links
- **Image Error Handling**: Tests fallback images when posters fail to load
- **Edge Cases**: Tests missing data, rapid searches, and network errors

### 2. Integration Tests

Integration tests verify how components work together and interact with the Redux store.

#### ContentFeed Integration Tests
- **Content Rendering**: Tests rendering content items from Redux store
- **Drag and Drop Functionality**: Tests drag-and-drop context, droppable areas, and draggable items
- **Content Interactions**: Tests clicking content, adding/removing favorites
- **Content Filtering**: Tests category-based filtering
- **Content Search Integration**: Tests search result filtering
- **Edge Cases**: Tests missing data, large datasets, and rapid state changes

### 3. E2E Tests

E2E tests simulate real user interactions and test complete workflows.

#### Search Functionality E2E Tests
- **Instagram Search**: Tests hashtag and user search workflows
- **Movie Search**: Tests movie search and filtering
- **Content Feed Search**: Tests content filtering based on search
- **Search Error Handling**: Tests network errors and timeouts
- **Search Performance**: Tests rapid searches and input debouncing

#### Drag and Drop E2E Tests
- **Content Feed Drag and Drop**: Tests drag-and-drop functionality
- **Content Reordering**: Tests maintaining order after operations
- **Edge Cases**: Tests various drag scenarios
- **Performance**: Tests drag operations with large datasets

## Test Utilities

### Custom Test Utils (`src/test-utils.tsx`)

Provides a custom render function that wraps components with Redux Provider and other necessary providers.

```typescript
import { render, screen } from '../test-utils';

// Renders component with Redux store
render(<MyComponent />);

// Renders component with custom store state
render(<MyComponent />, { 
  preloadedState: { 
    content: { items: [] } 
  } 
});
```

### Test Store Creation

```typescript
import { createTestStore } from '../test-utils';

const store = createTestStore({
  content: {
    items: mockContentItems,
    loading: false,
    error: null
  }
});
```

## Mocking Strategy

### API Mocks

API functions are mocked using Jest:

```typescript
jest.mock('../../services/api');
const mockedApi = api as jest.Mocked<typeof api>;

mockedApi.searchInstagramHashtags.mockResolvedValue(mockData);
```

### React Beautiful DnD Mocks

Drag and drop functionality is mocked for testing:

```typescript
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children, onDragEnd }) => (
    <div data-testid="drag-drop-context" onClick={() => onDragEnd(mockDragEnd)}>
      {children}
    </div>
  ),
  // ... other mocks
}));
```

### Browser APIs

Browser APIs are mocked in `setupTests.ts`:
- `window.matchMedia`
- `IntersectionObserver`
- `ResizeObserver`
- `localStorage`/`sessionStorage`
- `window.open`

## Test Data

### Mock Content Items

```typescript
const mockContentItems = [
  {
    id: 'item-1',
    type: 'news' as const,
    data: {
      id: 'news-1',
      title: 'Test Content',
      description: 'Test description',
      category: 'technology',
      url: 'https://example.com/1',
      urlToImage: 'https://example.com/image1.jpg',
      publishedAt: '2023-01-01T00:00:00Z',
      source: { name: 'Test Source' }
    },
    isFavorite: false,
    timestamp: Date.now()
  }
];
```

### Mock API Responses

```typescript
const mockHashtagData = {
  hashtags: [
    { name: 'summer', media_count: 1000000 },
    { name: 'travel', media_count: 500000 }
  ]
};
```

## Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain the expected behavior
- Test both success and failure scenarios

### 2. Assertions
- Use specific assertions (`toBeInTheDocument`, `toHaveClass`)
- Test user interactions, not implementation details
- Verify error states and loading states

### 3. Mocking
- Mock external dependencies (APIs, browser APIs)
- Use realistic mock data
- Test error scenarios with mock failures

### 4. E2E Testing
- Test complete user workflows
- Use data-testid attributes for reliable element selection
- Test error handling and edge cases

## Coverage Goals

- **Unit Tests**: 80%+ coverage for all components
- **Integration Tests**: Cover all major component interactions
- **E2E Tests**: Cover critical user workflows

## Continuous Integration

Tests are configured to run in CI environments:

```yaml
# Example CI configuration
- name: Run Unit Tests
  run: npm run test:coverage

- name: Run E2E Tests
  run: npm run test:e2e
```

## Troubleshooting

### Common Issues

1. **Test Timeouts**: Increase timeout in test configuration
2. **Mock Issues**: Ensure mocks are properly configured in setupTests.ts
3. **Async Tests**: Use `waitFor` for asynchronous operations
4. **Redux Store**: Use `createTestStore` for consistent store setup

### Debugging

- Use `console.log` in tests for debugging
- Run tests in watch mode for immediate feedback
- Use Cypress test runner for E2E test debugging

## Future Improvements

1. **Visual Regression Testing**: Add visual regression tests
2. **Performance Testing**: Add performance benchmarks
3. **Accessibility Testing**: Add accessibility testing with axe-core
4. **Contract Testing**: Add API contract testing
5. **Load Testing**: Add load testing for critical paths 