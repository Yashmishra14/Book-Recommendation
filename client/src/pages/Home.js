import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, Sparkles, BookOpen, Search } from 'lucide-react';

import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import { bookAPI } from '../services/api';

const Home = () => {
  const { data: popularBooks, isLoading, error } = useQuery(
    'popularBooks',
    () => bookAPI.getPopularBooks(),
    {
      select: (response) => response.data.data || [],
    }
  );

  const handleSearch = (query) => {
    // Navigate to search page with query
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI Recommendations',
      description: 'Get personalized book suggestions based on your preferences',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find books by title, author, or any keyword instantly',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Popular Books',
      description: 'Discover trending and highly-rated books from our community',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading books</div>
          <p className="text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent">
                Discover Amazing Books
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Find your next favorite read with our intelligent book recommendation system. 
              Search, explore, and get personalized suggestions.
            </p>
            
            <div className="max-w-2xl mx-auto mb-12">
              <SearchBar onSearch={handleSearch} />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/search"
                className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
              >
                Browse All Books
              </Link>
              <Link
                to="/recommend"
                className="px-8 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg font-semibold transition-colors border border-dark-600"
              >
                Get Recommendations
              </Link>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="text-center p-6 bg-dark-700/30 rounded-xl border border-dark-600 hover:border-primary-500/50 transition-all duration-300"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-primary-400 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Popular Books
              </h2>
            </div>
            <p className="text-gray-400 text-lg">
              Discover the most loved books in our community
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className="bg-dark-700/50 rounded-xl aspect-[3/4] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {popularBooks?.slice(0, 12).map((book, index) => (
                <BookCard
                  key={`${book.book_name}-${index}`}
                  book={{
                    'Book-Title': book.book_name,
                    'Book-Author': book.author,
                    'Image-URL-M': book.image,
                    rating: book.rating,
                    votes: book.votes
                  }}
                  index={index}
                  showRating={true}
                  showVotes={true}
                />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              to="/search"
              className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              View All Books
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
