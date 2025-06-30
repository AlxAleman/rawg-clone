import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi';
import { gamesAPI } from '../services/api';
import GameCard from '../components/GameCard/GameCard';
import GamesList from '../components/GameCard/GamesList';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    genre: '',
    platform: '',
    ordering: '-relevance'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  // Extract search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q') || '';
    setSearchQuery(query);
    if (query) {
      performSearch(query, 1, filters);
    }
  }, [location.search]);

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [genresResponse, platformsResponse] = await Promise.all([
          gamesAPI.getGenres(),
          gamesAPI.getPlatforms()
        ]);
        setGenres(genresResponse.results || []);
        setPlatforms(platformsResponse.results || []);
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };

    loadFilterOptions();
  }, []);

  const performSearch = async (query, pageNum = 1, currentFilters = filters) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await gamesAPI.searchGames(query, pageNum);
      
      if (pageNum === 1) {
        setGames(response.results || []);
      } else {
        setGames(prev => [...prev, ...(response.results || [])]);
      }
      
      setTotalResults(response.count || 0);
      setHasMore(!!response.next);
      setPage(pageNum);
    } catch (error) {
      console.error('Error searching games:', error);
      setGames([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      performSearch(searchQuery, page + 1, filters);
    }
  };

  const applyFilters = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery, 1, filters);
    }
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      platform: '',
      ordering: '-relevance'
    });
    if (searchQuery.trim()) {
      performSearch(searchQuery, 1, {
        genre: '',
        platform: '',
        ordering: '-relevance'
      });
    }
  };

  const ViewToggle = () => (
    <div className="flex bg-rawg-light-gray rounded-lg p-1">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setViewMode('grid')}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm transition-colors ${
          viewMode === 'grid' 
            ? 'bg-rawg-blue text-white' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <FiGrid />
        <span>Grid</span>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setViewMode('list')}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm transition-colors ${
          viewMode === 'list' 
            ? 'bg-rawg-blue text-white' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <FiList />
        <span>List</span>
      </motion.button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Search Header */}
      <div className="mb-8">
        <motion.h1 
          className="heading-responsive font-bold mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {searchQuery ? `Search results for "${searchQuery}"` : 'Search Games'}
        </motion.h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-2xl">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  navigate('/search');
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FiX />
              </button>
            )}
          </div>
        </form>

        {/* Results Info & Controls */}
        {searchQuery && (
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-400">
              {loading ? 'Searching...' : `${totalResults.toLocaleString()} games found`}
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <FiFilter />
                <span>Filters</span>
              </motion.button>
              
              <ViewToggle />
            </div>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="card p-6 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Genre
                </label>
                <select
                  value={filters.genre}
                  onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
                  className="w-full bg-rawg-light-gray border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platform Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Platform
                </label>
                <select
                  value={filters.platform}
                  onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full bg-rawg-light-gray border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">All Platforms</option>
                  {platforms.slice(0, 20).map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.ordering}
                  onChange={(e) => setFilters(prev => ({ ...prev, ordering: e.target.value }))}
                  className="w-full bg-rawg-light-gray border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="-relevance">Relevance</option>
                  <option value="-rating">Rating</option>
                  <option value="-released">Release Date</option>
                  <option value="-added">Popularity</option>
                  <option value="name">Name A-Z</option>
                  <option value="-name">Name Z-A</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={applyFilters}
                className="btn btn-primary"
              >
                Apply Filters
              </button>
              
              <button
                onClick={clearFilters}
                className="btn btn-ghost"
              >
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div>
          {loading && games.length === 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="skeleton aspect-video rounded-lg" />
              ))}
            </div>
          ) : games.length > 0 ? (
            <div>
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
                  : 'grid-cols-1'
              }`}>
                {games.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {viewMode === 'grid' ? (
                      <GameCard game={game} />
                    ) : (
                      <GamesList game={game} />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadMore}
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? 'Loading...' : 'Load More Games'}
                  </motion.button>
                </div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FiSearch className="text-6xl text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No games found</h2>
              <p className="text-gray-400 mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <FiSearch className="text-8xl text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Discover Amazing Games</h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Search through thousands of games to find your next favorite adventure.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchPage;