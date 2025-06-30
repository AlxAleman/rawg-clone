import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiStar, FiCalendar, FiPlus, FiHeart } from 'react-icons/fi';
import { format } from 'date-fns';

const GameCard = ({ game, showPreviewOnHover = true }) => {
  // Validación temprana para evitar errores si game es undefined
  if (!game) {
    return (
      <div className="relative bg-rawg-gray rounded-lg overflow-hidden p-4">
        <div className="text-white">Game data not available</div>
      </div>
    );
  }

  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const hoverTimeoutRef = useRef(null);
  const imageIntervalRef = useRef(null);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
      if (showPreviewOnHover && game?.short_screenshots?.length > 1) {
        startImageSlideshow();
      }
    }, 500); // Delay de 500ms antes de mostrar el preview
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
    stopImageSlideshow();
    setCurrentImageIndex(0);
  };

  const startImageSlideshow = () => {
    if (game?.short_screenshots?.length > 1) {
      imageIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => 
          prev < game.short_screenshots.length - 1 ? prev + 1 : 0
        );
      }, 1500);
    }
  };

  const stopImageSlideshow = () => {
    if (imageIntervalRef.current) {
      clearInterval(imageIntervalRef.current);
      imageIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      stopImageSlideshow();
    };
  }, []);

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

    return platforms.slice(0, 4).map((platform) => {
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

  const currentImage = game?.short_screenshots?.[currentImageIndex]?.image || game?.background_image || '/placeholder-game.jpg';
  const platformIcons = getPlatformIcons(game?.platforms);

  return (
    <motion.div
      className="relative bg-rawg-gray rounded-lg overflow-hidden cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/game/${game.id}`)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden">
        <motion.img
          src={currentImage}
          alt={game.name}
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Platform Icons */}
        <div className="absolute top-3 right-3 flex space-x-1">
          {platformIcons.map((platform, index) => (
            <div
              key={index}
              className="w-6 h-6 bg-black/50 rounded flex items-center justify-center text-xs"
              title={platform.name}
            >
              {platform.icon}
            </div>
          ))}
        </div>

        {/* Metacritic Score */}
        {game.metacritic && (
          <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold text-white ${getMetacriticColor(game.metacritic)}`}>
            {game.metacritic}
          </div>
        )}

        {/* Play Button (on hover) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FiPlay className="text-white text-2xl ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Indicators */}
        {game.short_screenshots?.length > 1 && isHovered && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {game.short_screenshots.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Release Date */}
        {game.released && (
          <div className="text-xs text-gray-400 mb-2 flex items-center">
            <FiCalendar className="mr-1" />
            {format(new Date(game.released), 'MMM dd, yyyy')}
          </div>
        )}

        {/* Title */}
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-rawg-blue transition-colors">
          {game.name}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {game.rating > 0 && (
              <div className="flex items-center space-x-1">
                <FiStar className={`text-sm ${getRatingColor(game.rating)}`} />
                <span className={`text-sm font-medium ${getRatingColor(game.rating)}`}>
                  {game.rating.toFixed(1)}
                </span>
              </div>
            )}
            {game.ratings_count > 0 && (
              <span className="text-xs text-gray-400">
                ({game.ratings_count.toLocaleString()})
              </span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 bg-rawg-light-gray rounded hover:bg-rawg-blue transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Add to library logic
              }}
            >
              <FiPlus className="text-sm" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 bg-rawg-light-gray rounded hover:bg-red-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Add to wishlist logic
              }}
            >
              <FiHeart className="text-sm" />
            </motion.button>
          </div>
        </div>

        {/* Genres */}
        {game.genres?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {game.genres.slice(0, 3).map((genre) => (
              <span
                key={genre.id}
                className="px-2 py-1 bg-rawg-light-gray text-xs text-gray-300 rounded"
              >
                {genre.name}
              </span>
            ))}
            {game.genres.length > 3 && (
              <span className="px-2 py-1 bg-rawg-light-gray text-xs text-gray-300 rounded">
                +{game.genres.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover Overlay with Additional Info */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4 pt-8"
          >
            <div className="space-y-2">
              {/* Quick Stats */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Release</span>
                <span className="text-white">
                  {game.released ? format(new Date(game.released), 'yyyy') : 'TBA'}
                </span>
              </div>
              
              {game.playtime && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Playtime</span>
                  <span className="text-white">{game.playtime}h</span>
                </div>
              )}

              {/* Tags */}
              {game.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {game.tags.slice(0, 5).map((tag) => (
                    <span
                      key={tag.id}
                      className="px-1.5 py-0.5 bg-white/10 text-xs text-gray-300 rounded"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GameCard;