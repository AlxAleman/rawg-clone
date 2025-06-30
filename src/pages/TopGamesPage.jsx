import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiStar, FiTrendingUp, FiTarget } from 'react-icons/fi';
import { fetchGames } from '../services/api';
import GamesList from '../components/GameCard/GamesList';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const TopGamesPage = ({ category }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryConfig = {
    'best-of-year': {
      title: 'Best of the Year',
      description: 'The highest-rated games of 2024',
      params: {
        dates: '2024-01-01,2024-12-31',
        ordering: '-metacritic',
        metacritic: '80,100'
      },
      icon: <FiTarget className="text-2xl" />,
      gradient: 'from-yellow-500 to-orange-500'
    },
    'popular-2024': {
      title: 'Most Popular in 2024',
      description: 'Games with the highest player engagement this year',
      params: {
        dates: '2024-01-01,2024-12-31',
        ordering: '-added'
      },
      icon: <FiTrendingUp className="text-2xl" />,
      gradient: 'from-blue-500 to-purple-500'
    },
    'all-time-250': {
      title: 'Top 250 Games of All Time',
      description: 'The greatest games ever made, ranked by community',
      params: {
        ordering: '-rating',
        page_size: 40
      },
      icon: <FiAward className="text-2xl" />,
      gradient: 'from-purple-500 to-pink-500'
    }
  };

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const config = categoryConfig[category];
        const params = {
          page_size: 20,
          ...config.params
        };
        
        const data = await fetchGames(params);
        setGames(data.results || []);
      } catch (err) {
        setError('Failed to load games');
        console.error('Error loading games:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [category]);

  const config = categoryConfig[category] || categoryConfig['best-of-year'];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-400">{error}</p>
        </div>
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
      {/* Header with gradient */}
      <div className="mb-8">
        <div className={`bg-gradient-to-r ${config.gradient} p-6 rounded-xl mb-6`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-white">
              {config.icon}
            </div>
            <h1 className="text-4xl font-bold text-white">
              {config.title}
            </h1>
          </div>
          <p className="text-white/90 text-lg">
            {config.description}
          </p>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{games.length} games loaded</span>
          <span>•</span>
          <span>Ranked by community rating</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-rawg-gray rounded-lg p-1">
          {Object.entries(categoryConfig).map(([key, config]) => (
            <button
              key={key}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                category === key
                  ? 'bg-rawg-blue text-white'
                  : 'text-gray-400 hover:text-white hover:bg-rawg-light-gray'
              }`}
              onClick={() => window.location.href = `/top/${key}`}
            >
              {config.title}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      {category === 'all-time-250' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-rawg-gray p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <FiStar className="text-yellow-400" />
              <span className="text-sm text-gray-400">Average Rating</span>
            </div>
            <div className="text-2xl font-bold text-white mt-1">4.2+</div>
          </div>
          <div className="bg-rawg-gray p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <FiAward className="text-yellow-400" />
              <span className="text-sm text-gray-400">Metacritic Score</span>
            </div>
            <div className="text-2xl font-bold text-white mt-1">85+</div>
          </div>
          <div className="bg-rawg-gray p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <FiTrendingUp className="text-green-400" />
              <span className="text-sm text-gray-400">Total Reviews</span>
            </div>
            <div className="text-2xl font-bold text-white mt-1">10M+</div>
          </div>
        </div>
      )}

      {/* Games Grid with Rankings */}
      {games.length > 0 ? (
        <div className="space-y-6">
          {category === 'all-time-250' ? (
            <div className="grid gap-4">
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 bg-rawg-gray p-4 rounded-lg hover:bg-rawg-light-gray transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-rawg-blue rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="w-full">
                      <GamesList games={[game]} showRanking={false} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <GamesList games={games} />
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">
            No games found for this category
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TopGamesPage;