import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiMonitor, FiSmartphone, FiSettings } from 'react-icons/fi';
import { fetchPlatforms } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const PlatformsPage = () => {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        const data = await fetchPlatforms();
        setPlatforms(data.results || []);
      } catch (err) {
        console.error('Error loading platforms:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPlatforms();
  }, []);

  const getPlatformIcon = (platformName) => {
    const name = platformName.toLowerCase();
    if (name.includes('pc') || name.includes('mac') || name.includes('linux')) {
      return <FiMonitor className="text-3xl" />;
    }
    if (name.includes('ios') || name.includes('android')) {
      return <FiSmartphone className="text-3xl" />;
    }
    return <FiSettings className="text-3xl" />;
  };

  const getPlatformCategory = (platformName) => {
    const name = platformName.toLowerCase();
    if (name.includes('pc') || name.includes('mac') || name.includes('linux')) {
      return 'PC';
    }
    if (name.includes('playstation') || name.includes('ps')) {
      return 'PlayStation';
    }
    if (name.includes('xbox')) {
      return 'Xbox';
    }
    if (name.includes('nintendo')) {
      return 'Nintendo';
    }
    if (name.includes('ios') || name.includes('android')) {
      return 'Mobile';
    }
    return 'Other';
  };

  const groupedPlatforms = platforms.reduce((acc, platform) => {
    const category = getPlatformCategory(platform.name);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(platform);
    return acc;
  }, {});

  if (loading) {
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
          <FiSettings className="text-2xl text-rawg-blue" />
          <h1 className="text-4xl font-bold text-white">Gaming Platforms</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Explore games across all your favorite platforms
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-rawg-gray p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <FiSettings className="text-blue-400" />
            <span className="text-sm text-gray-400">Total Platforms</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">{platforms.length}</div>
        </div>
        <div className="bg-rawg-gray p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <FiMonitor className="text-green-400" />
            <span className="text-sm text-gray-400">PC Platforms</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">{groupedPlatforms.PC?.length || 0}</div>
        </div>
        <div className="bg-rawg-gray p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <FiSmartphone className="text-purple-400" />
            <span className="text-sm text-gray-400">Mobile Platforms</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">{groupedPlatforms.Mobile?.length || 0}</div>
        </div>
      </div>

      {/* Platform Categories */}
      <div className="space-y-8">
        {Object.entries(groupedPlatforms).map(([category, categoryPlatforms]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rawg-gray p-6 rounded-lg"
          >
            <h2 className="text-2xl font-bold text-white mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryPlatforms.map((platform, index) => (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-rawg-light-gray p-4 rounded-lg hover:bg-rawg-blue/20 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/platform/${platform.id}`)}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-rawg-blue group-hover:text-white transition-colors">
                      {getPlatformIcon(platform.name)}
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-rawg-blue transition-colors">
                      {platform.name}
                    </h3>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-2">
                    {platform.games_count?.toLocaleString() || 0} games available
                  </div>
                  
                  {platform.year_start && (
                    <div className="text-xs text-gray-500">
                      Since {platform.year_start}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Popular Platforms */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Most Popular Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms
            .sort((a, b) => (b.games_count || 0) - (a.games_count || 0))
            .slice(0, 6)
            .map((platform, index) => (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-rawg-gray to-rawg-light-gray p-6 rounded-lg hover:from-rawg-blue/20 hover:to-rawg-blue/10 transition-all cursor-pointer"
                onClick={() => navigate(`/platform/${platform.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{platform.name}</h3>
                    <p className="text-gray-400">{platform.games_count?.toLocaleString() || 0} games</p>
                  </div>
                  <div className="text-rawg-blue">
                    {getPlatformIcon(platform.name)}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PlatformsPage;