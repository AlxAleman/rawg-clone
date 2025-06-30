import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiList, FiTrendingUp } from 'react-icons/fi';
import { gamesAPI } from '../services/api';
import GameCard from '../components/GameCard/GameCard';
import GamesList from '../components/GameCard/GamesList';

const GenrePage = () => {
  const { id } = useParams();
  const [games, setGames] = useState([]);
  const [genre, setGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [ordering, setOrdering] = useState('-added');

  useEffect(() => {
    if (id) {
      loadGenreGames(id, 1, ordering);
      loadGenreInfo();
    }
  }, [id, ordering]);

  const loadGenreInfo = async () => {
    try {
      const genresResponse = await gamesAPI.getGenres();
      const genreInfo = genresResponse.results.find(g => g.id === parseInt(id));
      setGenre(genreInfo);
    } catch (error) {
      console.error('Error loading genre info:', error);
    }
  };

  const loadGenreGames = async (genreId, pageNum = 1, order = ordering) => {
    try {
      setLoading(true);
      const response = await gamesAPI.getGamesByGenre(genreId, pageNum);
      
      if (pageNum === 1) {
        setGames(response.results || []);
      } else {
        setGames(prev => [...prev, ...(response.results || [])]);
      }
      
      setHasMore(!!response.next);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading genre games:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadGenreGames(id, page + 1, ordering);
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
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center space-x-4 mb-6"
        >
          {genre?.color && (
            <div 
              className="w-6 h-6 rounded-lg"
              style={{ backgroundColor: genre.color }}
            />
          )}
          <h1 className="heading-responsive font-bold">
            {genre?.name || 'Loading...'} Games
          </h1>
        </motion.div>

        {genre?.description && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-3xl mb-6"
          >
            {genre.description}
          </motion.p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FiTrendingUp className="text-rawg-blue text-xl" />
            <span className="text-gray-400">
              {games.length > 0 && `${games.length} games`}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              className="bg-rawg-light-gray border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="-added">Most Popular</option>
              <option value="-rating">Highest Rated</option>
              <option value="-released">Newest</option>
              <option value="released">Oldest</option>
              <option value="name">Name A-Z</option>
              <option value="-name">Name Z-A</option>
            </select>
            
            <ViewToggle />
          </div>
        </div>
      </div>

      {/* Games Grid */}
      {loading && games.length === 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="skeleton aspect-video rounded-lg" />
          ))}
        </div>
      ) : (
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
      )}
    </motion.div>
  );
};

export default GenrePage;