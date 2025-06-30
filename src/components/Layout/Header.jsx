import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiBell, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { gamesAPI } from '../../services/api';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      setLoading(true);
      const response = await gamesAPI.searchGames(query, 1);
      setSearchResults(response.results?.slice(0, 5) || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };

  const handleGameSelect = (gameId) => {
    navigate(`/game/${gameId}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <motion.header 
      className="bg-rawg-gray border-b border-rawg-light-gray sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </motion.button>

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
            onClick={() => navigate('/')}
          >
            <h1 className="text-xl sm:text-2xl font-bold gradient-text">RAWG</h1>
          </motion.div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4 sm:mx-8 relative" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <FiSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowResults(true)}
                className="w-full bg-rawg-light-gray/80 backdrop-blur-sm border border-gray-600/50 rounded-full py-2.5 sm:py-3 pl-10 sm:pl-12 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-rawg-blue focus:ring-1 focus:ring-rawg-blue transition-all duration-200 text-sm sm:text-base"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="text-sm sm:text-base" />
                </button>
              )}
            </div>
          </form>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 glass rounded-lg border border-rawg-light-gray max-h-96 overflow-y-auto z-50 shadow-xl"
              >
                {loading ? (
                  <div className="p-4 text-center">
                    <div className="spinner mx-auto mb-2"></div>
                    <div className="text-gray-400 text-sm">Searching...</div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    {searchResults.map((game) => (
                      <motion.div
                        key={game.id}
                        whileHover={{ backgroundColor: 'rgba(22, 33, 62, 0.8)' }}
                        className="flex items-center space-x-3 p-3 cursor-pointer border-b border-rawg-light-gray/30 last:border-b-0"
                        onClick={() => handleGameSelect(game.id)}
                      >
                        <img
                          src={game.background_image}
                          alt={game.name}
                          className="w-10 sm:w-12 h-6 sm:h-8 object-cover rounded"
                          onError={(e) => {
                            e.target.src = '/placeholder-game.jpg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white truncate text-sm sm:text-base">
                            {game.name}
                          </div>
                          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400">
                            {game.released && (
                              <span>{new Date(game.released).getFullYear()}</span>
                            )}
                            {game.genres?.slice(0, 2).map((genre, index) => (
                              <span key={genre.id}>
                                {index > 0 && '•'} {genre.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        {game.rating > 0 && (
                          <div className="flex items-center space-x-1 text-yellow-400">
                            <span className="text-xs sm:text-sm">★</span>
                            <span className="text-xs sm:text-sm font-medium">
                              {game.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    
                    {searchQuery && (
                      <motion.div
                        whileHover={{ backgroundColor: 'rgba(14, 75, 153, 0.2)' }}
                        className="p-3 text-center border-t border-rawg-light-gray/30 cursor-pointer text-rawg-blue hover:text-blue-400 text-sm"
                        onClick={() => {
                          navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                          setShowResults(false);
                        }}
                      >
                        See all results for "{searchQuery}"
                      </motion.div>
                    )}
                  </div>
                ) : searchQuery ? (
                  <div className="p-4 text-center text-gray-400 text-sm">
                    No games found for "{searchQuery}"
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-white transition-colors relative"
          >
            <FiBell className="text-lg sm:text-xl" />
            <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:block p-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiUser className="text-xl" />
          </motion.button>

          <div className="flex items-center space-x-2 cursor-pointer group">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-rawg-blue rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <span className="text-xs sm:text-sm font-bold">AA</span>
            </div>
            <span className="hidden sm:block text-sm text-gray-300 group-hover:text-white transition-colors">
              My library
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </motion.header>
  );
};

export default Header;