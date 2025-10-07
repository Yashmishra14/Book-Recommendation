import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, User } from 'lucide-react';
import { bookAPI } from '../services/api';

const SearchBar = ({ onSearch, placeholder = "Search for books or authors...", className = "" }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 2) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery) => {
    try {
      setIsLoading(true);
      const response = await bookAPI.getSearchSuggestions(searchQuery);
      setSuggestions(response.data.books || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    handleSearch(suggestion.title);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-dark-700 border border-dark-600 rounded-lg shadow-xl max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={`${suggestion.title}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center p-3 hover:bg-dark-600 cursor-pointer transition-colors border-b border-dark-600 last:border-b-0"
              >
                <div className="w-10 h-14 bg-dark-600 rounded flex-shrink-0 mr-3 overflow-hidden">
                  <img
                    src={suggestion.image || '/api/placeholder/40/56'}
                    alt={suggestion.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/40x56/1a1a2e/ffffff?text=No+Image';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {suggestion.title}
                  </p>
                  <div className="flex items-center text-gray-400 text-xs mt-1">
                    <User className="w-3 h-3 mr-1" />
                    <span className="truncate">{suggestion.author}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
