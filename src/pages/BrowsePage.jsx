import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import { fetchGames, fetchGenres, fetchPlatforms } from '../services/api';
import GamesList from '../components/GameCard/GamesList';
import AdvancedFilters from '../Filters/AdvancedFilters';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const BrowsePage = () => {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    platform: '',
    ordering: '-added',
    page_size: 20
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [gamesData, genresData, platformsData] = await Promise.all([
          fetchGames(filters),
          fetchGenres(),
          fetchPlatforms()
        ]);
        
        setGames(gamesData.results || []);
        setGenres(genresData.results || []);
        setPlatforms(platformsData.results || []);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const loadGames = async () => {
      if (!loading) { // Evitar cargar en el primer render
        setLoading(true);
        try {
          const data = await fetchGames(filters);
          setGames(data.results || []);
        } catch (err) {
          console.error('Error loading games:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadGames();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const sortOptions = [
    { value: '-added', label: 'Recently Added' },
    { value: '-released', label: 'Release Date' },
    { value: '-rating', label: 'Rating' },
    { value: '-metacritic', label: 'Metacritic Score' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: '-name', label: 'Name (Z-A)' }
  ];

  if (loading && games.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <FiSearch className="text-2xl text-rawg-blue" />
          <h1 className="text-4xl font-bold text-white">Browse Games</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Discover your next favorite game with advanced filtering
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search games..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-rawg-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-rawg-blue focus:ring-1 focus:ring-rawg-blue"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <select
              value={filters.ordering}
              onChange={(e) => handleFilterChange({ ordering: e.target.value })}
              className="px-4 py-2 bg-rawg-gray border border-gray-600 rounded-lg text-white focus:border-rawg-blue"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters ? 'bg-rawg-blue text-white' : 'bg-rawg-gray text-gray-300 hover:bg-rawg-light-gray'
              }`}
            >
              <FiFilter />
              <span>Filters</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex bg-rawg-gray rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-rawg-blue text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-rawg-blue text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <AdvancedFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            genres={genres}
            platforms={platforms}
          />
        </motion.div>
      )}

      {/* Quick Filter Tags */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {filters.genre && (
            <span className="flex items-center space-x-2 bg-rawg-blue px-3 py-1 rounded-full text-sm">
              <span>Genre: {genres.find(g => g.id.toString() === filters.genre)?.name}</span>
              <button
                onClick={() => handleFilterChange({ genre: '' })}
                className="text-white hover:text-red-300"
              >
                ×
              </button>
            </span>
          )}
          {filters.platform && (
            <span className="flex items-center space-x-2 bg-rawg-blue px-3 py-1 rounded-full text-sm">
              <span>Platform: {platforms.find(p => p.id.toString() === filters.platform)?.name}</span>
              <button
                onClick={() => handleFilterChange({ platform: '' })}
                className="text-white hover:text-red-300"
              >
                ×
              </button>
            </span>
          )}
          {filters.search && (
            <span className="flex items-center space-x-2 bg-rawg-blue px-3 py-1 rounded-full text-sm">
              <span>Search: "{filters.search}"</span>
              <button
                onClick={() => handleFilterChange({ search: '' })}
                className="text-white hover:text-red-300"
              >
                ×
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <div className="text-gray-400">
          {loading ? 'Loading...' : `${games.length} games found`}
        </div>
      </div>

      {/* Games Display */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : games.length > 0 ? (
        <GamesList games={games} viewMode={viewMode} />
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            No games found matching your criteria
          </div>
          <button
            onClick={() => setFilters({ search: '', genre: '', platform: '', ordering: '-added', page_size: 20 })}
            className="bg-rawg-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default BrowsePage;