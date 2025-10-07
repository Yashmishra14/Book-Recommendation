export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  RECOMMEND: '/recommend',
  BOOK_DETAIL: '/book/:title',
};

export const QUERY_KEYS = {
  POPULAR_BOOKS: 'popularBooks',
  ALL_BOOKS: 'allBooks',
  SEARCH_BOOKS: 'searchBooks',
  SEARCH_SUGGESTIONS: 'searchSuggestions',
  RECOMMENDATIONS: 'recommendations',
  LOAD_MORE_BOOKS: 'loadMoreBooks',
};

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_DELAY: 300,
  MAX_SUGGESTIONS: 10,
};

export const ANIMATION = {
  DURATION: {
    FAST: 0.2,
    NORMAL: 0.3,
    SLOW: 0.5,
  },
  DELAY: {
    SMALL: 0.1,
    MEDIUM: 0.2,
    LARGE: 0.3,
  },
};

export const THEME = {
  COLORS: {
    PRIMARY: '#0ea5e9',
    ACCENT: '#d946ef',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
  },
};
