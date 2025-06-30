import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi';
import { gamesAPI } from '../services/api';
import GamesList from '../components/GameCard/GamesList';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const ReleaseCalendarPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');

  const periods = {
    'last-month': {
      title: 'Last Month',
      description: 'Games released in the previous month',
      getDates: () => {
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        return {
          start: lastMonth.toISOString().split('T')[0],
          end: lastMonthEnd.toISOString().split('T')[0]
        };
      }
    },
    'this-month': {
      title: 'This Month',
      description: 'Games released this month',
      getDates: () => {
        const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const thisMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        return {
          start: thisMonthStart.toISOString().split('T')[0],
          end: thisMonthEnd.toISOString().split('T')[0]
        };
      }
    },
    'next-month': {
      title: 'Next Month',
      description: 'Upcoming games next month',
      getDates: () => {
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        const nextMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);
        return {
          start: nextMonth.toISOString().split('T')[0],
          end: nextMonthEnd.toISOString().split('T')[0]
        };
      }
    }
  };

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const period = periods[selectedPeriod];
        const dates = period.getDates();
        
        const data = await gamesAPI.getGamesWithParams({
          dates: `${dates.start},${dates.end}`,
          ordering: '-released',
          page_size: 20
        });
        
        setGames(data.results || []);
      } catch (err) {
        console.error('Error loading games:', err);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [selectedPeriod, currentDate]);

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getUpcomingHighlights = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return games.filter(game => {
      if (!game.released) return false;
      const releaseDate = new Date(game.released);
      return releaseDate >= today && releaseDate <= nextWeek;
    }).slice(0, 3);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const upcomingHighlights = getUpcomingHighlights();

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
          <FiCalendar className="text-2xl text-rawg-blue" />
          <h1 className="text-4xl font-bold text-white">Release Calendar</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Track game releases and plan your gaming schedule
        </p>
      </div>

      {/* Month Navigator */}
      <div className="mb-8">
        <div className="flex items-center justify-between bg-rawg-gray p-4 rounded-lg">
          <button
            onClick={() => navigateMonth(-1)}
            className="flex items-center space-x-2 px-3 py-2 bg-rawg-light-gray rounded hover:bg-rawg-blue transition-colors"
          >
            <FiChevronLeft />
            <span>Previous</span>
          </button>
          
          <h2 className="text-xl font-bold text-white">
            {formatMonth(currentDate)}
          </h2>
          
          <button
            onClick={() => navigateMonth(1)}
            className="flex items-center space-x-2 px-3 py-2 bg-rawg-light-gray rounded hover:bg-rawg-blue transition-colors"
          >
            <span>Next</span>
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Period Selection */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-rawg-gray rounded-lg p-1">
          {Object.entries(periods).map(([key, period]) => (
            <button
              key={key}
              onClick={() => setSelectedPeriod(key)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === key
                  ? 'bg-rawg-blue text-white'
                  : 'text-gray-400 hover:text-white hover:bg-rawg-light-gray'
              }`}
            >
              {period.title}
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Highlights */}
      {upcomingHighlights.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <FiClock className="text-rawg-blue" />
            <span>Coming This Week</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingHighlights.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-rawg-blue/20 to-purple-600/20 border border-rawg-blue/30 p-4 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={game.background_image}
                    alt={game.name}
                    className="w-16 h-16 rounded object-cover"
                    onError={(e) => e.target.src = '/placeholder-game.jpg'}
                  />
                  <div>
                    <h4 className="font-semibold text-white">{game.name}</h4>
                    <p className="text-sm text-gray-400">
                      {new Date(game.released).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Current Period Info */}
      <div className="mb-6">
        <div className="bg-rawg-gray p-4 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-2">
            {periods[selectedPeriod].title}
          </h3>
          <p className="text-gray-400 mb-2">
            {periods[selectedPeriod].description}
          </p>
          <div className="text-sm text-gray-500">
            {games.length} games found
          </div>
        </div>
      </div>

      {/* Games List */}
      {games.length > 0 ? (
        <GamesList games={games} />
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            No games found for this period
          </div>
          <p className="text-gray-500">
            Try selecting a different time period or check back later for updates
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-rawg-gray p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-white">{games.length}</div>
          <div className="text-sm text-gray-400">Games This Period</div>
        </div>
        <div className="bg-rawg-gray p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-white">{upcomingHighlights.length}</div>
          <div className="text-sm text-gray-400">Coming This Week</div>
        </div>
        <div className="bg-rawg-gray p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-white">
            {games.filter(g => g.metacritic >= 80).length}
          </div>
          <div className="text-sm text-gray-400">Highly Rated (80+)</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReleaseCalendarPage;