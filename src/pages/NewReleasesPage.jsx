import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { fetchGames } from '../services/api';
import GamesList from '../components/GameCard/GamesList';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const NewReleasesPage = ({ period }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const periodConfig = {
    'last-30-days': {
      title: 'New Releases - Last 30 Days',
      description: 'Recently released games that are making waves',
      dateFilter: getLast30DaysFilter(),
      icon: <FiCalendar className="text-2xl" />
    },
    'this-week': {
      title: 'New Releases - This Week',
      description: 'Brand new games released this week',
      dateFilter: getThisWeekFilter(),
      icon: <FiTrendingUp className="text-2xl" />
    },
    'next-week': {
      title: 'Coming Next Week',
      description: 'Upcoming games releasing in the next 7 days',
      dateFilter: getNextWeekFilter(),
      icon: <FiCalendar className="text-2xl" />
    }
  };

  function getLast30DaysFilter() {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    return {
      dates: `${thirtyDaysAgo.toISOString().split('T')[0]},${today.toISOString().split('T')[0]}`,
      ordering: '-released'
    };
  }

  function getThisWeekFilter() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    return {
      dates: `${startOfWeek.toISOString().split('T')[0]},${today.toISOString().split('T')[0]}`,
      ordering: '-released'
    };
  }

  function getNextWeekFilter() {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return {
      dates: `${today.toISOString().split('T')[0]},${nextWeek.toISOString().split('T')[0]}`,
      ordering: 'released'
    };
  }

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const config = periodConfig[period];
        const params = {
          page_size: 20,
          ...config.dateFilter
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
  }, [period]);

  const config = periodConfig[period] || periodConfig['last-30-days'];

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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-rawg-blue">
            {config.icon}
          </div>
          <h1 className="text-4xl font-bold text-white">
            {config.title}
          </h1>
        </div>
        <p className="text-gray-400 text-lg">
          {config.description}
        </p>
        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
          <span>{games.length} games found</span>
          <span>•</span>
          <span>Updated daily</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-rawg-gray rounded-lg p-1">
          {Object.entries(periodConfig).map(([key, config]) => (
            <button
              key={key}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                period === key
                  ? 'bg-rawg-blue text-white'
                  : 'text-gray-400 hover:text-white hover:bg-rawg-light-gray'
              }`}
              onClick={() => window.location.href = `/new-releases/${key}`}
            >
              {config.title.split(' - ')[1] || config.title}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      {games.length > 0 ? (
        <GamesList games={games} />
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">
            No games found for this period
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default NewReleasesPage;