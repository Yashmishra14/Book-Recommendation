import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import { Sparkles, Search, BookOpen, AlertCircle, Loader2 } from 'lucide-react';

import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import { bookAPI } from '../services/api';

const Recommend = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  const { data: searchResults, isLoading: isSearching } = useQuery(
    ['searchSuggestions', searchQuery],
    () => bookAPI.getSearchSuggestions(searchQuery),
    {
      enabled: searchQuery.length >= 2,
      select: (response) => response.data.books || [],
    }
  );

  const { data: recommendations, isLoading: isRecommending, error } = useQuery(
    ['recommendations', selectedBook],
    () => bookAPI.getRecommendations(selectedBook),
    {
      enabled: !!selectedBook,
      select: (response) => response.data.data || [],
    }
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedBook(null);
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book.title);
    setSearchQuery(book.title);
  };

  const handleRecommendation = () => {
    if (searchQuery.trim()) {
      setSelectedBook(searchQuery.trim());
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Recommendations
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Get personalized book recommendations based on your favorite books. 
            Our AI analyzes your preferences to suggest similar titles you'll love.
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Enter a book title to get recommendations..."
            />
            
            {/* Search Suggestions */}
            <AnimatePresence>
              {searchQuery.length >= 2 && searchResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 w-full mt-2 bg-dark-700 border border-dark-600 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                >
                  {searchResults.map((book, index) => (
                    <motion.div
                      key={`${book.title}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      onClick={() => handleBookSelect(book)}
                      className="flex items-center p-3 hover:bg-dark-600 cursor-pointer transition-colors border-b border-dark-600 last:border-b-0"
                    >
                      <div className="w-10 h-14 bg-dark-600 rounded flex-shrink-0 mr-3 overflow-hidden">
                        <img
                          src={book.image || '/api/placeholder/40/56'}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/40x56/1a1a2e/ffffff?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {book.title}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          {book.author}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleRecommendation}
              disabled={!searchQuery.trim() || isRecommending}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center mx-auto"
            >
              {isRecommending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Getting Recommendations...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Recommendations
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {selectedBook && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Recommendations for "{selectedBook}"
              </h2>
            </div>
          )}

          {isRecommending ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Analyzing your preferences...</p>
                <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <div className="text-red-400 text-xl mb-2">Error getting recommendations</div>
              <p className="text-gray-400 mb-4">
                {error.response?.data?.error || 'Please try again later'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : recommendations && recommendations.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {recommendations.map((book, index) => (
                <BookCard
                  key={`${book[0]}-${index}`}
                  book={{
                    'Book-Title': book[0],
                    'Book-Author': book[1],
                    'Image-URL-M': book[2]
                  }}
                  index={index}
                />
              ))}
            </div>
          ) : selectedBook && recommendations && recommendations.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <div className="text-gray-400 text-xl mb-2">No recommendations found</div>
              <p className="text-gray-500">
                We couldn't find similar books for "{selectedBook}". Try a different book.
              </p>
            </div>
          ) : (
            <div className="text-center py-20">
              <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <div className="text-gray-400 text-xl mb-2">Ready to discover new books?</div>
              <p className="text-gray-500">
                Enter a book title above to get personalized recommendations
              </p>
            </div>
          )}
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 bg-dark-800/30 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            How Our AI Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-400 font-bold text-lg">1</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Enter a Book</h4>
              <p className="text-gray-400">
                Tell us about a book you enjoyed reading
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-400 font-bold text-lg">2</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">AI Analysis</h4>
              <p className="text-gray-400">
                Our AI analyzes the book's characteristics and patterns
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-400 font-bold text-lg">3</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Get Recommendations</h4>
              <p className="text-gray-400">
                Receive personalized book suggestions you'll love
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Recommend;
