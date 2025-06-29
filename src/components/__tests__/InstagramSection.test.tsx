import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import InstagramSection from '../InstagramSection';
import * as api from '../../services/api';

// Mock the API functions
jest.mock('../../services/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('InstagramSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('renders the component with correct title', () => {
      render(<InstagramSection />);
      expect(screen.getByText('Instagram Search')).toBeInTheDocument();
    });

    it('shows hashtag tab as active by default', () => {
      render(<InstagramSection />);
      const hashtagTab = screen.getByText('Hashtags');
      expect(hashtagTab).toHaveClass('bg-white');
    });

    it('shows correct placeholder text for hashtag search', () => {
      render(<InstagramSection />);
      const searchInput = screen.getByPlaceholderText(/Search hashtags/);
      expect(searchInput).toBeInTheDocument();
    });

    it('shows initial message when no search is performed', () => {
      render(<InstagramSection />);
      expect(screen.getByText(/Search for popular hashtags/)).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('switches to users tab when clicked', () => {
      render(<InstagramSection />);

      const usersTab = screen.getByText('Users');
      fireEvent.click(usersTab);

      expect(usersTab).toHaveClass('bg-white');
      expect(screen.getByPlaceholderText(/Search users/)).toBeInTheDocument();
    });

    it('shows correct placeholder text for user search', () => {
      render(<InstagramSection />);

      const usersTab = screen.getByText('Users');
      fireEvent.click(usersTab);

      expect(screen.getByPlaceholderText(/Search users/)).toBeInTheDocument();
    });
  });

  describe('Hashtag Search', () => {
    it('performs hashtag search when search button is clicked', async () => {
      const mockHashtagData = {
        hashtags: [
          { name: 'summer', media_count: 1000000 },
          { name: 'travel', media_count: 500000 }
        ]
      };
      mockedApi.searchInstagramHashtags.mockResolvedValue(mockHashtagData);

      render(<InstagramSection />);

      const searchInput = screen.getByPlaceholderText(/Search hashtags/);
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'summer' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(mockedApi.searchInstagramHashtags).toHaveBeenCalledWith('summer');
      });
    });

    it('performs hashtag search when Enter key is pressed', async () => {
      const mockHashtagData = {
        hashtags: [{ name: 'travel', media_count: 500000 }]
      };
      mockedApi.searchInstagramHashtags.mockResolvedValue(mockHashtagData);

      render(<InstagramSection />);

      const searchInput = screen.getByPlaceholderText(/Search hashtags/);
      fireEvent.change(searchInput, { target: { value: 'travel' } });
      fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(mockedApi.searchInstagramHashtags).toHaveBeenCalledWith('travel');
      });
    });

    it('displays hashtag results correctly', async () => {
      const mockHashtagData = {
        hashtags: [
          { name: 'summer', media_count: 1000000 },
          { name: 'travel', media_count: 500000 }
        ]
      };
      mockedApi.searchInstagramHashtags.mockResolvedValue(mockHashtagData);

      render(<InstagramSection />);

      const searchInput = screen.getByPlaceholderText(/Search hashtags/);
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'summer' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('#summer')).toBeInTheDocument();
        expect(screen.getByText('#travel')).toBeInTheDocument();
        expect(screen.getByText('1.0M posts')).toBeInTheDocument();
        expect(screen.getByText('500.0K posts')).toBeInTheDocument();
      });
    });

    it('shows loading state during search', async () => {
      mockedApi.searchInstagramHashtags.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ hashtags: [] }), 100))
      );

      render(<InstagramSection />);

      const searchInput = screen.getByPlaceholderText(/Search hashtags/);
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);

      expect(screen.getByText('Searching...')).toBeInTheDocument();
    });

    it('handles empty hashtag results', async () => {
      mockedApi.searchInstagramHashtags.mockResolvedValue({ hashtags: [] });

      render(<InstagramSection />);

      const searchInput = screen.getByPlaceholderText(/Search hashtags/);
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/No results found/)).toBeInTheDocument();
      });
    });

    it('handles API errors gracefully', async () => {
      mockedApi.searchInstagramHashtags.mockRejectedValue(new Error('API Error'));

      render(<InstagramSection />);

      const searchInput = screen.getByPlaceholderText(/Search hashtags/);
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'error' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch results/)).toBeInTheDocument();
      });
    });
  });

  describe('User Search', () => {
    it('performs user search when users tab is active', async () => {
      const mockUserData = {
        users: [
          {
            username: 'testuser',
            full_name: 'Test User',
            profile_pic_url: 'https://example.com/pic.jpg',
            follower_count: 10000
          }
        ]
      };
      mockedApi.searchInstagramUsers.mockResolvedValue(mockUserData);

      render(<InstagramSection />);

      // Switch to users tab
      const usersTab = screen.getByText('Users');
      fireEvent.click(usersTab);

      const searchInput = screen.getByPlaceholderText(/Search users/);
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'testuser' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(mockedApi.searchInstagramUsers).toHaveBeenCalledWith('testuser');
      });
    });

    it('displays user results correctly', async () => {
      const mockUserData = {
        users: [
          {
            username: 'testuser',
            full_name: 'Test User',
            profile_pic_url: 'https://example.com/pic.jpg',
            follower_count: 10000,
            is_verified: true
          }
        ]
      };
      mockedApi.searchInstagramUsers.mockResolvedValue(mockUserData);

      render(<InstagramSection />);

      // Switch to users tab
      const usersTab = screen.getByText('Users');
      fireEvent.click(usersTab);

      const searchInput = screen.getByPlaceholderText(/Search users/);
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'testuser' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('@testuser')).toBeInTheDocument();
        expect(screen.getByText('10.0K followers')).toBeInTheDocument();
      });
    });

    it('handles user search with no results', async () => {
      mockedApi.searchInstagramUsers.mockResolvedValue({ users: [] });

      render(<InstagramSection />);

      // Switch to users tab
      const usersTab = screen.getByText('Users');
      fireEvent.click(usersTab);

      const searchInput = screen.getByPlaceholderText(/Search users/);
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/No results found/)).toBeInTheDocument();
      });
    });
  });

  describe('Search Input Validation', () => {
    it('disables search button when input is empty', () => {
      render(<InstagramSection />);

      const searchButton = screen.getByText('Search');
      expect(searchButton).toBeDisabled();
    });

    it('enables search button when input has content', () => {
      render(<InstagramSection />);

      const searchInput = screen.getByPlaceholderText(/Search hashtags/);
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'test' } });
      expect(searchButton).not.toBeDisabled();
    });

    it('does not perform search with empty input', () => {
      render(<InstagramSection />);

      const searchButton = screen.getByText('Search');
      fireEvent.click(searchButton);

      expect(mockedApi.searchInstagramHashtags).not.toHaveBeenCalled();
    });
  });

  describe('Click Handlers', () => {
    it('opens hashtag page when hashtag result is clicked', async () => {
      const mockHashtagData = {
        hashtags: [{ name: 'summer', media_count: 1000000 }]
      };
      mockedApi.searchInstagramHashtags.mockResolvedValue(mockHashtagData);

      const mockOpen = jest.fn();
      Object.defineProperty(window, 'open', {
        value: mockOpen,
        writable: true
      });

      render(<InstagramSection />);

      const searchInput = screen.getByPlaceholderText(/Search hashtags/);
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'summer' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        const hashtagResult = screen.getByText('#summer');
        fireEvent.click(hashtagResult);
        expect(mockOpen).toHaveBeenCalledWith('https://www.instagram.com/explore/tags/summer/', '_blank');
      });
    });

    it('opens user profile when user result is clicked', async () => {
      const mockUserData = {
        users: [
          {
            username: 'testuser',
            full_name: 'Test User',
            profile_pic_url: 'https://example.com/pic.jpg',
            follower_count: 10000
          }
        ]
      };
      mockedApi.searchInstagramUsers.mockResolvedValue(mockUserData);

      const mockOpen = jest.fn();
      Object.defineProperty(window, 'open', {
        value: mockOpen,
        writable: true
      });

      render(<InstagramSection />);

      // Switch to users tab
      const usersTab = screen.getByText('Users');
      fireEvent.click(usersTab);

      const searchInput = screen.getByPlaceholderText(/Search users/);
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'testuser' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        const userResult = screen.getByText('Test User');
        fireEvent.click(userResult);
        expect(mockOpen).toHaveBeenCalledWith('https://www.instagram.com/testuser/', '_blank');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles API response with unexpected data structure', async () => {
      mockedApi.searchInstagramHashtags.mockResolvedValue({ unexpected: 'data' });

      render(<InstagramSection />);

      const searchInput = screen.getByPlaceholderText(/Search hashtags/);
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/No results found/)).toBeInTheDocument();
      });
    });

    it('handles network timeout', async () => {
      mockedApi.searchInstagramHashtags.mockRejectedValue(new Error('Network timeout'));

      render(<InstagramSection />);

      const searchInput = screen.getByPlaceholderText(/Search hashtags/);
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'timeout' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch results/)).toBeInTheDocument();
      });
    });

    it('handles rapid successive searches', async () => {
      const mockData = { hashtags: [{ name: 'test', media_count: 100 }] };
      mockedApi.searchInstagramHashtags.mockResolvedValue(mockData);

      render(<InstagramSection />);

      const searchInput = screen.getByPlaceholderText(/Search hashtags/);
      const searchButton = screen.getByText('Search');

      // Perform multiple rapid searches
      fireEvent.change(searchInput, { target: { value: 'search1' } });
      fireEvent.click(searchButton);

      fireEvent.change(searchInput, { target: { value: 'search2' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(mockedApi.searchInstagramHashtags).toHaveBeenCalledTimes(2);
      });
    });
  });
}); 