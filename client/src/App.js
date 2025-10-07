import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { motion } from 'framer-motion';

// Pages
import Home from './pages/Home';
import Search from './pages/Search';
import Recommend from './pages/Recommend';
import BookDetail from './pages/BookDetail';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          <Navbar />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/recommend" element={<Recommend />} />
              <Route path="/book/:title" element={<BookDetail />} />
            </Routes>
          </motion.main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
