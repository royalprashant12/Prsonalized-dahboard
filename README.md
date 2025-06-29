# Personalized Dashboard

A modern React dashboard with personalized content feeds, news articles, and movie recommendations.

## Features

- 📰 Personalized news feed based on user preferences
- 🎬 Movie recommendations with streaming info
- 🐦 Twitter social media integration with hashtag and user search
- 🔍 Debounced search functionality
- 🌙 Dark mode toggle
- ❤️ Favorites system
- 🎨 Drag & drop content organization
- 📱 Responsive design

## Tech Stack

- React 18 + TypeScript
- Redux Toolkit + Redux Persist
- Tailwind CSS
- Framer Motion
- React Beautiful DnD
- Axios
- Heroicons

## Installation

```bash
npm install
npm start
```

## APIs

- News API for articles
- RapidAPI for movie recommendations
- Twitter API (mock implementation with provided credentials)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personalized-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Environment Variables

The application uses the following API keys (already configured):

- **News API Key**: `2e4e3a1ca34e4179a5e52faa10383af7`
- **RapidAPI Key**: `583684257emsh2a6c2e0da99f595p19c65cjsn888dbc9e48b2`
- **Twitter API Key**: `KVd6luwa1mA9PVGhy6cxyMKri`
- **Twitter API Secret**: `KVd6luwa1mA9PVGhy6cxyMKri`

## Project Structure

```
src/
├── components/          # React components
│   ├── ContentCard.tsx
│   ├── ContentFeed.tsx
│   ├── FavoritesSection.tsx
│   ├── Header.tsx
│   ├── SettingsPanel.tsx
│   ├── Sidebar.tsx
│   ├── TrendingSection.tsx
│   └── TwitterSection.tsx
├── store/              # Redux store and slices
│   ├── slices/
│   │   ├── contentSlice.ts
│   │   ├── searchSlice.ts
│   │   ├── uiSlice.ts
│   │   └── userPreferencesSlice.ts
│   └── store.ts
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Features in Detail

### Content Management
- **News Articles**: Fetched from News API based on user categories
- **Movie Recommendations**: Curated movie suggestions with ratings and streaming info
- **Twitter Posts**: Social media posts with hashtag and user search functionality
- **Favorites System**: Save and manage favorite content across all types
- **Content Filtering**: Filter by type, category, and search terms

### User Experience
- **Responsive Grid Layout**: Adaptive grid system for different screen sizes
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: Graceful error handling with user-friendly messages
- **Accessibility**: Keyboard navigation and screen reader support

### Performance
- **Debounced Search**: Prevents excessive API calls during typing
- **Lazy Loading**: Efficient content loading and rendering
- **Optimized Images**: Image optimization and fallback handling
- **Memoization**: React.memo and useMemo for performance optimization

### Twitter Integration
- **Hashtag Search**: Search for posts by specific hashtags
- **User Search**: Find posts from specific Twitter users
- **Trending Topics**: Browse popular hashtags and users
- **Interactive Posts**: Like, retweet, reply, and share functionality
- **Media Support**: Display images and videos in posts
- **Real-time Updates**: Simulated real-time post updates

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- News API for providing news content
- RapidAPI for streaming availability data
- Tailwind CSS for the beautiful design system
- Framer Motion for smooth animations 