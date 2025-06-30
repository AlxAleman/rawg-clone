import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGrid, FiList, FiTrendingUp, FiStar, FiCalendar, FiClock } from 'react-icons/fi';
import GameCard from '../components/GameCard/GameCard';
import GamesList from '../components/GameCard/GamesList';
import { gamesAPI } from '../services/api';

const HomePage = () => {
  const [newAndTrending, setNewAndTrending] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [thisWeekReleases, setThisWeekReleases] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [activeSection, setActiveSection] = useState('trending');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        
        const [newTrendingResponse, topGamesResponse] = await Promise.all([
          gamesAPI.getNewAndTrending(),
          gamesAPI.getTopGames()
        ]);

        setNewAndTrending(newTrendingResponse.results || []);
        setTopGames(topGamesResponse.results || []);
        
        try {
          const thisWeekResponse = await gamesAPI.getThisWeekReleases();
          setThisWeekReleases(thisWeekResponse.results || []);
        } catch (error) {
          console.log('This week releases not available:', error);
          setThisWeekReleases([]);
        }

        try {
          const upcomingResponse = await gamesAPI.getUpcomingReleases();
          setUpcomingGames(upcomingResponse.results || []);
        } catch (error) {
          console.log('Upcoming releases not available:', error);
          setUpcomingGames([]);
        }
        
      } catch (error) {
        console.error('Error fetching games:', error);
        setNewAndTrending([]);
        setTopGames([]);
        setThisWeekReleases([]);
        setUpcomingGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

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
        <span className="hidden sm:inline">Grid</span>
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
        <span className="hidden sm:inline">List</span>
      </motion.button>
    </div>
  );

  const SectionHeader = ({ title, icon: Icon, description, isActive, onClick, count = 0 }) => (
    <motion.div 
      className={`cursor-pointer p-3 sm:p-4 rounded-lg transition-colors relative ${
        isActive ? 'bg-rawg-blue/20 border border-rawg-blue' : 'hover:bg-rawg-light-gray'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
        <Icon className={`text-xl sm:text-2xl ${isActive ? 'text-rawg-blue' : 'text-gray-400'}`} />
        <h2 className={`text-lg sm:text-xl font-bold ${isActive ? 'text-white' : 'text-gray-300'}`}>
          {title}
        </h2>
      </div>
      {description && (
        <p className="text-gray-400 text-xs sm:text-sm">{description}</p>
      )}
      {count > 0 && (
        <div className="absolute top-2 right-2 bg-rawg-blue text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
          {count}
        </div>
      )}
    </motion.div>
  );

  const GameGrid = ({ games }) => {
    if (!games || games.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400">No games available in this section</p>
        </div>
      );
    }

    return (
      <div className={`grid gap-4 sm:gap-6 ${
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
    );
  };

  const LoadingSkeleton = () => (
    <div className={`grid gap-4 sm:gap-6 ${
      viewMode === 'grid' 
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
        : 'grid-cols-1'
    }`}>
      {[...Array(10)].map((_, index) => (
        <div key={index} className="bg-rawg-gray rounded-lg overflow-hidden animate-pulse">
          <div className="aspect-video bg-rawg-light-gray"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-rawg-light-gray rounded w-3/4"></div>
            <div className="h-3 bg-rawg-light-gray rounded w-1/2"></div>
            <div className="flex space-x-2">
              <div className="h-6 bg-rawg-light-gray rounded w-16"></div>
              <div className="h-6 bg-rawg-light-gray rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const getCurrentGames = () => {
    switch (activeSection) {
      case 'trending':
        return newAndTrending;
      case 'top':
        return topGames;
      case 'week':
        return thisWeekReleases;
      case 'upcoming':
        return upcomingGames;
      default:
        return newAndTrending;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'trending':
        return 'New and trending';
      case 'top':
        return 'Top rated games';
      case 'week':
        return 'This week releases';
      case 'upcoming':
        return 'Coming soon';
      default:
        return 'New and trending';
    }
  };

  const getSectionDescription = () => {
    switch (activeSection) {
      case 'trending':
        return 'Based on player counts and release date';
      case 'top':
        return 'Best rated games of all time';
      case 'week':
        return 'Games released this week';
      case 'upcoming':
        return 'Upcoming releases to watch';
      default:
        return 'Based on player counts and release date';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 sm:space-y-12">
        <div className="bg-gradient-to-r from-rawg-blue/20 to-rawg-purple/20 rounded-lg p-6 sm:p-8">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-rawg-light-gray rounded w-full max-w-md mb-4" />
            <div className="h-3 sm:h-4 bg-rawg-light-gray rounded w-full max-w-sm" />
          </div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 sm:space-y-12"
    >
      {/* Hero Banner */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-rawg-blue/20 to-rawg-purple/20 rounded-lg p-6 sm:p-8 mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">New and trending</h1>
        <p className="text-gray-300 text-base sm:text-lg mb-6">
          Based on player counts and release date
        </p>
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0"
        >
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">
              Jump-start your library with games from Steam, PlayStation, Xbox or GOG.
            </h3>
            <p className="text-pink-100 text-sm">
              The more complete your profile is, the better it shows your interests.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            Import games
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Section Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <SectionHeader
          title="New & Trending"
          icon={FiTrendingUp}
          description="Based on player counts and release date"
          isActive={activeSection === 'trending'}
          onClick={() => setActiveSection('trending')}
          count={newAndTrending.length}
        />
        <SectionHeader
          title="Top Rated"
          icon={FiStar}
          description="Best rated games of all time"
          isActive={activeSection === 'top'}
          onClick={() => setActiveSection('top')}
          count={topGames.length}
        />
        <SectionHeader
          title="This Week"
          icon={FiCalendar}
          description="Games released this week"
          isActive={activeSection === 'week'}
          onClick={() => setActiveSection('week')}
          count={thisWeekReleases.length}
        />
        <SectionHeader
          title="Coming Soon"
          icon={FiClock}
          description="Upcoming releases"
          isActive={activeSection === 'upcoming'}
          onClick={() => setActiveSection('upcoming')}
          count={upcomingGames.length}
        />
      </div>

      {/* View Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {getSectionTitle()}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            {getSectionDescription()} • {getCurrentGames().length} games
          </p>
        </div>
        
        <ViewToggle />
      </div>

      {/* Games Section */}
      <section>
        <GameGrid games={getCurrentGames()} />
      </section>

      {/* Stats Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12"
      >
        <div className="bg-rawg-gray rounded-lg p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-rawg-blue mb-2">
            {newAndTrending.length}
          </div>
          <div className="text-gray-400 text-sm">Trending Games</div>
        </div>
        
        <div className="bg-rawg-gray rounded-lg p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-rawg-green mb-2">
            {topGames.length}
          </div>
          <div className="text-gray-400 text-sm">Top Rated</div>
        </div>
        
        <div className="bg-rawg-gray rounded-lg p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-rawg-yellow mb-2">
            {thisWeekReleases.length}
          </div>
          <div className="text-gray-400 text-sm">This Week</div>
        </div>
        
        <div className="bg-rawg-gray rounded-lg p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-rawg-purple mb-2">
            {upcomingGames.length}
          </div>
          <div className="text-gray-400 text-sm">Coming Soon</div>
        </div>
      </motion.div>

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-rawg-blue hover:bg-rawg-blue/80 text-white font-medium py-2 px-6 sm:px-8 rounded-lg transition-colors"
        >
          Load more games
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HomePage;