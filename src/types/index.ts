export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  category: string;
}

export interface MovieRecommendation {
  id: string;
  title: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  rating: number;
  genre: string;
  streamingInfo?: {
    platform: string;
    url: string;
  } | null;
}

// New simplified Instagram types
export interface InstagramUser {
  username: string;
  full_name: string;
  profile_pic_url?: string;
  is_verified?: boolean;
  follower_count?: number;
  following_count?: number;
  media_count?: number;
}

export interface InstagramHashtag {
  name: string;
  media_count?: number;
  top_posts?: any[];
}

export interface InstagramSimilarAccount {
  username: string;
  full_name: string;
  profile_pic_url?: string;
  is_verified?: boolean;
  follower_count?: number;
  following_count?: number;
  media_count?: number;
}

// Keep the old InstagramProfile type for backward compatibility but mark as deprecated
/**
 * @deprecated Use InstagramUser, InstagramHashtag, or InstagramSimilarAccount instead
 */
export interface InstagramProfile {
  cid: string;
  socialType: string;
  groupID: string;
  url: string;
  name: string;
  image: string;
  description: string;
  screenName: string;
  usersCount: number;
  communityStatus: string;
  isBlocked: boolean;
  isClosed: boolean;
  verified: boolean;
  tags: string[];
  suggestedTags: string[];
  avgER: number;
  avgInteractions: number;
  avgViews: number;
  ratingIndex: number;
  ratingTags: Array<{
    tagID: string;
    name: string;
  }>;
  similar: any[];
  qualityScore: number;
  timeStatistics: string;
  timePostsLoaded: string;
  timeShortLoop: string;
  timeLongLoop: string;
  startDate: string;
  membersCities: Array<{
    category: string;
    name: string;
    value: number;
  }>;
  membersCountries: Array<{
    category: string;
    name: string;
    value: number;
  }>;
  membersGendersAges: {
    data: Array<{
      category: string;
      m: number;
      f: number;
    }>;
    summary: {
      m: number;
      f: number;
      avgAges: string;
    };
  };
  avgLikes: number;
  avgComments: number;
  country: string;
  countryCode: string;
  city: string;
  type: string;
  gender: string;
  age: string;
  categories: string[];
  lastPosts: InstagramPost[];
  lastFromMentions: Array<{
    cid: string;
    image: string;
    url: string;
    name: string;
  }>;
  membersTypes: Array<{
    name: string;
    percent: number;
  }>;
  membersReachability: Array<{
    name: string;
    percent: number;
  }>;
  countries: Array<{
    name: string;
    percent: number;
  }>;
  cities: Array<{
    name: string;
    percent: number;
  }>;
  genders: Array<{
    name: string;
    percent: number;
  }>;
  ages: Array<{
    name: string;
    percent: number;
  }>;
  interests: any[];
  brandSafety: {
    ad: number;
    not_marked_ad: number;
    alcohol: number;
    toxic: number;
    religious: number;
    negative: number;
    offensive: number;
    political: number;
    crime: number;
    adult: number;
    pranks: number;
    totalScore: number;
  };
  toMentions180d: number;
  toMentionsCommunities180d: number;
  toMentionsViews180d: number;
  fromMentions180d: number;
  fromMentionsCommunities180d: number;
  fromMentionsViews180d: number;
  pctUsersCount180d: number;
  contactEmail: string;
  pctFakeFollowers: number;
  audienceSeverity: number;
}

/**
 * @deprecated Use InstagramUser, InstagramHashtag, or InstagramSimilarAccount instead
 */
export interface InstagramPost {
  url: string;
  date: string;
  type: 'carousel_album' | 'REELS' | 'image' | 'video';
  image?: string;
  likes: number;
  comments: number;
  text: string;
}

/**
 * @deprecated Use InstagramUser, InstagramHashtag, or InstagramSimilarAccount instead
 */
export interface InstagramApiResponse {
  meta: {
    code: number;
    message: string;
  };
  data: InstagramProfile;
}

export interface ContentItem {
  id: string;
  type: 'news' | 'movie' | 'instagram';
  data: NewsArticle | MovieRecommendation | InstagramProfile;
  isFavorite: boolean;
  timestamp: number;
}

export interface UserPreferences {
  categories: string[];
  darkMode: boolean;
  favorites: string[];
}

export interface AppState {
  userPreferences: UserPreferences;
  content: {
    items: ContentItem[];
    loading: boolean;
    error: string | null;
  };
  search: {
    query: string;
    results: ContentItem[];
  };
  ui: {
    sidebarOpen: boolean;
    currentSection: 'feed' | 'trending' | 'favorites';
  };
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface MovieApiResponse {
  results: MovieRecommendation[];
} 