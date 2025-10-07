import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API endpoints
export const bookAPI = {
  // Get popular books
  getPopularBooks: () => api.get('/api/popular'),
  
  // Get all books
  getAllBooks: () => api.get('/api/books'),
  
  // Search books
  searchBooks: (data) => api.post('/api/search_books', data),
  
  // Get search suggestions
  getSearchSuggestions: (query) => api.get(`/api/search_suggestions?q=${encodeURIComponent(query)}`),
  
  // Get book recommendations
  getRecommendations: (bookTitle) => api.post('/api/recommend_books', { user_input: bookTitle }),
  
  // Load more books (pagination)
  loadMoreBooks: (params) => api.get('/api/load_more_books', { params }),
};

export default api;
