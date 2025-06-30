import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay, FiStar, FiCalendar, FiPlus, FiHeart, FiMoreHorizontal, FiGrid, FiList } from 'react-icons/fi';
import { format } from 'date-fns';
import GameCard from './GameCard';

// Componente para mostrar un solo juego en formato lista
const GameListItem = ({ game }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Validación temprana
  if (!game) {
    return null;
  }

  const getPlatformIcons = (platforms) => {
    if (!platforms || !Array.isArray(platforms)) return [];
    
    const iconMap = {
      pc: '💻',
      playstation: '🎮',
      xbox: '🎮',
      nintendo: '🎮',
      mac: '🖥️',
      linux: '🐧',
      ios: '📱',
      android: '📱',
    };

    return platforms.slice(0, 6).map((platform, index) => {
      // Verificar que platform y platform.name existan
      if (!platform || !platform.name || typeof platform.name !== 'string') {
        return { name: 'Unknown', icon: '🎮' };
      }
      
      const name = platform.name.toLowerCase();
      for (const [key, icon] of Object.entries(iconMap)) {
        if (name.includes(key)) {
          return { name: platform.name, icon };
        }
      }
      return { name: platform.name, icon: '🎮' };
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 4.0) return 'text-yellow-400';
    if (rating >= 3.0) return 'text-orange-400';
    return 'text-red-400';
  };

  const getMetacriticColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const platformIcons = getPlatformIcons(game.platforms);

  return (
    <motion.div
      className="bg-rawg-gray hover:bg-rawg-light-gray cursor-pointer group rounded-lg transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/game/${game.id}`)}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex p-4">
        {/* Game Image */}
        <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <motion.img
            src={game.background_image || '/placeholder-game.jpg'}
            alt={game.name || 'Game'}
            className="w-full h-full object-cover transition-transform duration-300"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              e.target.src = '/placeholder-game.jpg';
            }}
          />
          
          {/* Play Button Overlay */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <FiPlay className="text-white text-sm ml-0.5" />
              </div>
            </motion.div>
          )}

          {/* Metacritic Score */}
          {game.metacritic && (
            <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-xs font-bold text-white ${getMetacriticColor(game.metacritic)}`}>
              {game.metacritic}
            </div>
          )}
        </div>

        {/* Game Info */}
        <div className="flex-1 ml-4 flex flex-col justify-between">
          <div>
            {/* Title and Release Date */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-semibold text-lg group-hover:text-rawg-blue transition-colors line-clamp-1">
                {game.name || 'Unknown Game'}
              </h3>
              {game.released && (
                <span className="text-gray-400 text-sm ml-4 flex-shrink-0">
                  {format(new Date(game.released), 'MMM dd, yyyy')}
                </span>
              )}
            </div>

            {/* Platforms */}
            <div className="flex items-center space-x-2 mb-2">
              {platformIcons.map((platform, index) => (
                <div
                  key={index}
                  className="relative group/tooltip"
                  title={platform.name}
                >
                  <span className="text-sm">{platform.icon}</span>
                </div>
              ))}
            </div>

            {/* Genres */}
            {game.genres?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {game.genres.slice(0, 4).map((genre) => (
                  <span
                    key={genre.id}
                    className="px-2 py-1 bg-rawg-light-gray text-xs text-gray-300 rounded"
                  >
                    {genre.name}
                  </span>
                ))}
                {game.genres.length > 4 && (
                  <span className="px-2 py-1 bg-rawg-light-gray text-xs text-gray-300 rounded">
                    +{game.genres.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bottom Row: Rating and Actions */}
          <div className="flex items-center justify-between">
            {/* Rating */}
            <div className="flex items-center space-x-4">
              {game.rating > 0 && (
                <div className="flex items-center space-x-1">
                  <FiStar className={`text-sm ${getRatingColor(game.rating)}`} />
                  <span className={`text-sm font-medium ${getRatingColor(game.rating)}`}>
                    {game.rating.toFixed(1)}
                  </span>
                  {game.ratings_count > 0 && (
                    <span className="text-xs text-gray-400">
                      ({game.ratings_count.toLocaleString()})
                    </span>
                  )}
                </div>
              )}
              
              {game.playtime && (
                <div className="text-sm text-gray-400">
                  {game.playtime}h avg
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-rawg-light-gray rounded hover:bg-rawg-blue transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to library logic
                }}
                title="Add to library"
              >
                <FiPlus className="text-sm" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-rawg-light-gray rounded hover:bg-red-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to wishlist logic
                }}
                title="Add to wishlist"
              >
                <FiHeart className="text-sm" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-rawg-light-gray rounded hover:bg-gray-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // More options logic
                }}
                title="More options"
              >
                <FiMoreHorizontal className="text-sm" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Componente principal que maneja tanto listas como un solo juego
const GamesList = ({ games, game, viewMode = 'grid', showRanking = false }) => {
  // Si se pasa un solo juego, convertirlo en array
  const gamesList = games || (game ? [game] : []);

  // Validación
  if (!gamesList || gamesList.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">
          No games found
        </div>
      </div>
    );
  }

  // Modo lista
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {gamesList.map((gameItem, index) => (
          <motion.div
            key={gameItem.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GameListItem game={gameItem} />
          </motion.div>
        ))}
      </div>
    );
  }

  // Modo grid (por defecto)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {gamesList.map((gameItem, index) => (
        <motion.div
          key={gameItem.id || index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <GameCard game={gameItem} />
        </motion.div>
      ))}
    </div>
  );
};

export default GamesList;