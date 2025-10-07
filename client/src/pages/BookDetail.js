import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ArrowLeft, Star, User, ExternalLink, BookOpen, Sparkles } from 'lucide-react';

import BookCard from '../components/BookCard';
import { bookAPI } from '../services/api';

const BookDetail = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [showRecommendations, setShowRecommendations] = useState(false);

  const { data: recommendations, isLoading: isRecommending } = useQuery(
    ['recommendations', title],
    () => bookAPI.getRecommendations(decodeURIComponent(title)),
    {
      enabled: showRecommendations,
      select: (response) => response.data.data || [],
    }
  );

  const { data: searchResults, isLoading: isSearching } = useQuery(
    ['bookSearch', title],
    () => bookAPI.searchBooks({ keyword: decodeURIComponent(title) }),
    {
      select: (response) => response.data.data || [],
    }
  );

  const book = searchResults?.[0];

  if (isSearching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Book Not Found</h2>
          <p className="text-gray-400 mb-6">The book you're looking for doesn't exist in our database.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </motion.button>

        {/* Book Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
        >
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="aspect-[3/4] bg-dark-700 rounded-xl overflow-hidden">
              <img
                src={book['Image-URL-M'] || '/api/placeholder/400/600'}
                alt={book['Book-Title']}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x600/1a1a2e/ffffff?text=No+Image';
                }}
              />
            </div>
          </div>

          {/* Book Info */}
          <div className="lg:col-span-2">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              {book['Book-Title']}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center text-gray-400 mb-6"
            >
              <User className="w-5 h-5 mr-2" />
              <span className="text-lg">{book['Book-Author']}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <p className="text-gray-300 text-lg leading-relaxed">
                Discover more about this book and explore similar titles that might interest you. 
                Our AI-powered recommendation system can help you find your next favorite read.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {showRecommendations ? 'Hide' : 'Get'} Recommendations
              </button>
              
              <button
                onClick={() => navigate('/search')}
                className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg font-semibold transition-colors border border-dark-600 flex items-center"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Browse More Books
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Recommendations Section */}
        {showRecommendations && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Similar Books You Might Like
            </h2>
            
            {isRecommending ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Finding similar books...</p>
                </div>
              </div>
            ) : recommendations && recommendations.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {recommendations.map((recBook, index) => (
                  <BookCard
                    key={`${recBook[0]}-${index}`}
                    book={{
                      'Book-Title': recBook[0],
                      'Book-Author': recBook[1],
                      'Image-URL-M': recBook[2]
                    }}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-dark-800/30 rounded-xl">
                <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No recommendations available for this book.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-dark-800/30 rounded-xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">About This Book</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-300 mb-2">Title</h4>
              <p className="text-gray-400">{book['Book-Title']}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-300 mb-2">Author</h4>
              <p className="text-gray-400">{book['Book-Author']}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-300 mb-2">Description</h4>
            <p className="text-gray-400">
              This book is part of our recommendation database. Use our AI-powered system 
              to discover similar books and expand your reading horizons. Our algorithm 
              analyzes book characteristics to provide personalized suggestions.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookDetail;
