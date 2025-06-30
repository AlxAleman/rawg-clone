import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiStar, 
  FiTrendingUp, 
  FiCalendar, 
  FiMonitor,
  FiSmartphone,
  FiChevronDown,
  FiChevronRight,
  FiGrid
} from 'react-icons/fi';
import { gamesAPI } from '../../services/api';

const Sidebar = () => {
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [showAllGenres, setShowAllGenres] = useState(false);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresResponse, platformsResponse] = await Promise.all([
          gamesAPI.getGenres(),
          gamesAPI.getPlatforms()
        ]);
        setGenres(genresResponse.results || []);
        setPlatforms(platformsResponse.results || []);
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      }
    };

    fetchData();
  }, []);

  const mainMenuItems = [
    { name: 'Home', icon: FiHome, path: '/' },
    { name: 'Reviews', icon: FiStar, path: '/reviews' },
  ];

  const newReleasesItems = [
    { name: 'Last 30 days', path: '/new-releases/last-30-days' },
    { name: 'This week', path: '/new-releases/this-week' },
    { name: 'Next week', path: '/new-releases/next-week' },
    { name: 'Release calendar', path: '/release-calendar', icon: FiCalendar },
  ];

  const topItems = [
    { name: 'Best of the year', path: '/top/best-of-year' },
    { name: 'Popular in 2024', path: '/top/popular-2024' },
    { name: 'All time top 250', path: '/top/all-time-250' },
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const MenuItem = ({ item, isActive = false }) => (
    <motion.div
      whileHover={{ x: 4 }}
      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${
        isActive 
          ? 'bg-rawg-blue text-white shadow-glow' 
          : 'text-gray-300 hover:text-white hover:bg-rawg-light-gray'
      }`}
      onClick={() => navigate(item.path)}
    >
      {item.icon && <item.icon className="text-lg flex-shrink-0" />}
      <span className="text-sm truncate">{item.name}</span>
    </motion.div>
  );

  const GenreItem = ({ genre }) => (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer text-gray-300 hover:text-white hover:bg-rawg-light-gray transition-colors"
      onClick={() => navigate(`/genre/${genre.id}`)}
    >
      <div 
        className="w-3 h-3 rounded-sm flex-shrink-0"
        style={{ backgroundColor: genre.color || '#666' }}
      />
      <span className="text-sm truncate">{genre.name}</span>
    </motion.div>
  );

  const PlatformItem = ({ platform }) => (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer text-gray-300 hover:text-white hover:bg-rawg-light-gray transition-colors"
      onClick={() => navigate(`/platform/${platform.id}`)}
    >
      <FiGrid className="text-lg flex-shrink-0" />
      <span className="text-sm truncate">{platform.name}</span>
    </motion.div>
  );

  return (
    <motion.aside 
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-rawg-gray border-r border-rawg-light-gray overflow-y-auto z-40 hidden lg:block"
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#16213e transparent'
      }}
    >
      <div className="p-4 space-y-6">
        {/* User Profile */}
        <div>
          <div className="flex items-center space-x-3 mb-4 p-3 bg-rawg-light-gray/50 rounded-lg">
            <div className="w-10 h-10 bg-rawg-blue rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold">AA</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-white truncate">AlexCorpses</div>
              <div className="text-xs text-gray-400">My library</div>
            </div>
          </div>
          
          <div className="space-y-1">
            {mainMenuItems.map((item) => (
              <MenuItem 
                key={item.name} 
                item={item} 
                isActive={isActiveRoute(item.path)}
              />
            ))}
          </div>
        </div>

        {/* New Releases */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3 px-4">New Releases</h3>
          <div className="space-y-1">
            {newReleasesItems.map((item) => (
              <MenuItem 
                key={item.name} 
                item={item} 
                isActive={isActiveRoute(item.path)}
              />
            ))}
          </div>
        </div>

        {/* Top */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3 px-4">Top</h3>
          <div className="space-y-1">
            {topItems.map((item) => (
              <MenuItem 
                key={item.name} 
                item={item} 
                isActive={isActiveRoute(item.path)}
              />
            ))}
          </div>
        </div>

        {/* Browse */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3 px-4">Browse</h3>
          <div className="space-y-1">
            <MenuItem item={{ name: 'All Games', path: '/browse' }} />
            <MenuItem item={{ name: 'Platforms', path: '/platforms' }} />
            <MenuItem item={{ name: 'Stores', path: '/stores' }} />
            <MenuItem item={{ name: 'Collections', path: '/collections' }} />
          </div>
        </div>

        {/* Platforms */}
        <div>
          <motion.div
            className="flex items-center justify-between px-4 py-2 cursor-pointer text-gray-400 hover:text-white transition-colors"
            onClick={() => setShowAllPlatforms(!showAllPlatforms)}
          >
            <h3 className="text-sm font-medium">Platforms</h3>
            {showAllPlatforms ? <FiChevronDown className="flex-shrink-0" /> : <FiChevronRight className="flex-shrink-0" />}
          </motion.div>
          
          <div className="space-y-1">
            {platforms.slice(0, showAllPlatforms ? platforms.length : 5).map((platform) => (
              <PlatformItem key={platform.id} platform={platform} />
            ))}
          </div>
          
          {platforms.length > 5 && (
            <motion.button
              className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowAllPlatforms(!showAllPlatforms)}
            >
              {showAllPlatforms ? 'Show less' : 'Show all'}
            </motion.button>
          )}
        </div>

        {/* Genres */}
        <div>
          <motion.div
            className="flex items-center justify-between px-4 py-2 cursor-pointer text-gray-400 hover:text-white transition-colors"
            onClick={() => setShowAllGenres(!showAllGenres)}
          >
            <h3 className="text-sm font-medium">Genres</h3>
            {showAllGenres ? <FiChevronDown className="flex-shrink-0" /> : <FiChevronRight className="flex-shrink-0" />}
          </motion.div>
          
          <div className="space-y-1">
            {genres.slice(0, showAllGenres ? genres.length : 10).map((genre) => (
              <GenreItem key={genre.id} genre={genre} />
            ))}
          </div>
          
          {genres.length > 10 && (
            <motion.button
              className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowAllGenres(!showAllGenres)}
            >
              {showAllGenres ? 'Show less' : 'Show all'}
            </motion.button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;