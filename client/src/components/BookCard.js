import React from 'react';
import { motion } from 'framer-motion';
import { Star, User, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookCard = ({ book, index = 0, showRating = false, showVotes = false }) => {
  const {
    'Book-Title': title,
    'Book-Author': author,
    'Image-URL-M': imageUrl,
    rating,
    votes,
    avg_ratings
  } = book;

  const displayRating = rating || avg_ratings || 0;
  const displayVotes = votes || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative bg-dark-700/50 backdrop-blur-sm rounded-xl overflow-hidden border border-dark-600 hover:border-primary-500/50 transition-all duration-300"
    >
      <Link to={`/book/${encodeURIComponent(title)}`}>
        <div className="aspect-[3/4] relative overflow-hidden">
          <img
            src={imageUrl || '/api/placeholder/300/400'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x400/1a1a2e/ffffff?text=No+Image';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-primary-500/90 text-white p-2 rounded-full">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center text-gray-400 text-xs mb-3">
            <User className="w-3 h-3 mr-1" />
            <span className="truncate">{author}</span>
          </div>

          {(showRating || showVotes) && (
            <div className="flex items-center justify-between text-xs">
              {showRating && (
                <div className="flex items-center text-yellow-400">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  <span>{displayRating.toFixed(1)}</span>
                </div>
              )}
              {showVotes && (
                <span className="text-gray-400">
                  {displayVotes.toLocaleString()} votes
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default BookCard;
