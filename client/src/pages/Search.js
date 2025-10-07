import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, Grid, List, Loader2 } from 'lucide-react';

import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import { bookAPI } from '../services/api';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [letter, setLetter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [offset, setOffset] = useState(0);
  const [allBooks, setAllBooks] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const letters = ['all', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  const { data: searchResults, isLoading, error, refetch } = useQuery(
    ['searchBooks', query, letter],
    () => bookAPI.searchBooks({ keyword: query, letter }),
    {
      enabled: false,
      select: (response) => response.data.data || [],
    }
  );

  const { data: loadMoreData, isLoading: isLoadingMore } = useQuery(
    ['loadMoreBooks', offset, letter],
    () => bookAPI.loadMoreBooks({ offset, limit: 20, letter }),
    {
      enabled: false,
      select: (response) => response.data,
    }
  );

  useEffect(() => {
    if (query || letter !== 'all') {
      setOffset(0);
      setAllBooks([]);
      refetch();
    }
  }, [query, letter, refetch]);

  useEffect(() => {
    if (searchResults) {
      setAllBooks(searchResults);
    }
  }, [searchResults]);

  useEffect(() => {
    if (loadMoreData) {
      setAllBooks(prev => [...prev, ...loadMoreData.data]);
      setHasMore(loadMoreData.has_more);
    }
  }, [loadMoreData]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    setSearchParams({ q: searchQuery });
  };

  const handleLetterFilter = (selectedLetter) => {
    setLetter(selectedLetter);
    setSearchParams({ q: query, letter: selectedLetter });
  };

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      setOffset(prev => prev + 20);
    }
  };

  const clearFilters = () => {
    setQuery('');
    setLetter('all');
    setSearchParams({});
    setAllBooks([]);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Search Books
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Find your next favorite read from our extensive collection
          </p>
          
          <div className="max-w-2xl">
            <SearchBar onSearch={handleSearch} />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300 font-medium">Filter by letter:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {letters.map((l) => (
                <button
                  key={l}
                  onClick={() => handleLetterFilter(l)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    letter === l
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  {l === 'all' ? 'All' : l}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">
                {isLoading ? 'Searching...' : `${allBooks.length} books found`}
              </span>
              {(query || letter !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Searching books...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-400 text-xl mb-4">Error loading books</div>
              <p className="text-gray-400">Please try again later</p>
            </div>
          ) : allBooks.length === 0 ? (
            <div className="text-center py-20">
              <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <div className="text-gray-400 text-xl mb-2">No books found</div>
              <p className="text-gray-500">
                {query ? `No results for "${query}"` : 'Try searching for a book or author'}
              </p>
            </div>
          ) : (
            <>
              <AnimatePresence>
                <div className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {allBooks.map((book, index) => (
                    <BookCard
                      key={`${book['Book-Title']}-${index}`}
                      book={book}
                      index={index}
                    />
                  ))}
                </div>
              </AnimatePresence>

              {/* Load More Button */}
              {hasMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mt-12"
                >
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 text-white rounded-lg font-semibold transition-colors flex items-center mx-auto"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More Books'
                    )}
                  </button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Search;
