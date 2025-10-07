import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-dark-800 border-t border-dark-700 mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                BookWorld
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Discover amazing books with our intelligent recommendation system. 
              Find your next favorite read with AI-powered suggestions.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/search" className="text-gray-400 hover:text-white transition-colors">
                  Search Books
                </a>
              </li>
              <li>
                <a href="/recommend" className="text-gray-400 hover:text-white transition-colors">
                  Get Recommendations
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">AI Recommendations</li>
              <li className="text-gray-400">Smart Search</li>
              <li className="text-gray-400">Popular Books</li>
              <li className="text-gray-400">Book Details</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 BookWorld. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-gray-400 text-sm mt-4 sm:mt-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for book lovers</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
