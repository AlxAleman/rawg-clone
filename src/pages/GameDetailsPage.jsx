import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlay, 
  FiStar, 
  FiCalendar, 
  FiPlus, 
  FiHeart, 
  FiShare2,
  FiExternalLink,
  FiMonitor,
  FiSmartphone,
  FiX,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { format } from 'date-fns';
import { gamesAPI } from '../services/api';
import GameCard from '../components/GameCard/GameCard';

const GameDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [similarGames, setSimilarGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const [gameResponse, screenshotsResponse, trailersResponse, similarResponse] = await Promise.all([
          gamesAPI.getGameDetails(id),
          gamesAPI.getGameScreenshots(id),
          gamesAPI.getGameTrailers(id),
          gamesAPI.getSimilarGames(id)
        ]);

        setGame(gameResponse);
        setScreenshots(screenshotsResponse.results || []);
        setTrailers(trailersResponse.results || []);
        setSimilarGames(similarResponse.results || []);
        
        if (screenshotsResponse.results?.length > 0) {
          setSelectedMedia({
            type: 'image',
            url: screenshotsResponse.results[0].image,
            index: 0
          });
        }
      } catch (error) {
        console.error('Error fetching game details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGameDetails();
    }
  }, [id]);

  const getPlatformIcons = (platforms) => {
    if (!platforms) return [];
    
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

    return platforms.map((platform) => {
      const platformData = platform?.platform || platform;
      if (!platformData?.name) return null;
      
      const name = platformData.name.toLowerCase();
      for (const [key, icon] of Object.entries(iconMap)) {
        if (name.includes(key)) {
          return { name: platformData.name, icon };
        }
      }
      return { name: platformData.name, icon: '🎮' };
    }).filter(Boolean);
  };

  const getRatingColor = (rating) => {
    if (!rating) return 'text-gray-400';
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 4.0) return 'text-yellow-400';
    if (rating >= 3.0) return 'text-orange-400';
    return 'text-red-400';
  };

  const getMetacriticColor = (score) => {
    if (!score) return 'bg-gray-500';
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const playTrailer = (trailer) => {
    setActiveTrailer(trailer);
    setShowTrailerModal(true);
  };

  const nextScreenshot = () => {
    if (screenshots.length > 0) {
      const nextIndex = (currentScreenshot + 1) % screenshots.length;
      setCurrentScreenshot(nextIndex);
      setSelectedMedia({
        type: 'image',
        url: screenshots[nextIndex].image,
        index: nextIndex
      });
    }
  };

  const previousScreenshot = () => {
    if (screenshots.length > 0) {
      const prevIndex = currentScreenshot === 0 ? screenshots.length - 1 : currentScreenshot - 1;
      setCurrentScreenshot(prevIndex);
      setSelectedMedia({
        type: 'image',
        url: screenshots[prevIndex].image,
        index: prevIndex
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Game not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  const platformIcons = getPlatformIcons(game.platforms);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center game-hero"
        style={{ backgroundImage: `url(${game.background_image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-rawg-dark via-rawg-dark/80 to-transparent" />
        
        <div className="relative h-full flex items-end container-padding">
          <div className="pb-8">
            <motion.h1 
              className="heading-responsive font-bold mb-4 text-shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {game.name}
            </motion.h1>
            
            <div className="flex items-center space-x-4 mb-4">
              {game.released && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <FiCalendar />
                  <span>{format(new Date(game.released), 'MMMM dd, yyyy')}</span>
                </div>
              )}
              
              {game.metacritic && (
                <div className={`px-3 py-1 rounded-lg text-white font-bold ${getMetacriticColor(game.metacritic)}`}>
                  {game.metacritic}
                </div>
              )}
              
              {game.rating > 0 && (
                <div className="flex items-center space-x-1">
                  <FiStar className={`${getRatingColor(game.rating)}`} />
                  <span className={`font-medium ${getRatingColor(game.rating)}`}>
                    {game.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-400 text-sm">
                    ({game.ratings_count?.toLocaleString()})
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 mb-6">
              {platformIcons.slice(0, 6).map((platform, index) => (
                <div
                  key={index}
                  className="tooltip platform-icon"
                  data-tooltip={platform.name}
                >
                  {platform.icon}
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
              >
                <FiPlus className="mr-2" />
                Add to Library
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary"
              >
                <FiHeart className="mr-2" />
                Wishlist
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-ghost"
              >
                <FiShare2 />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-padding section-spacing">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Media Gallery */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Media</h2>
              
              {/* Main Media Display */}
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                {selectedMedia?.type === 'image' ? (
                  <motion.img
                    key={selectedMedia.url}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={selectedMedia.url}
                    alt="Game screenshot"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-rawg-gray flex items-center justify-center">
                    <FiPlay className="text-6xl text-gray-400" />
                  </div>
                )}
                
                {/* Navigation Arrows */}
                {screenshots.length > 1 && (
                  <>
                    <button
                      onClick={previousScreenshot}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <FiChevronLeft className="text-white" />
                    </button>
                    <button
                      onClick={nextScreenshot}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <FiChevronRight className="text-white" />
                    </button>
                  </>
                )}
              </div>

              {/* Media Thumbnails */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {/* Trailers */}
                {trailers.map((trailer, index) => (
                  <motion.div
                    key={`trailer-${index}`}
                    whileHover={{ scale: 1.05 }}
                    className="relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => playTrailer(trailer)}
                  >
                    <img
                      src={trailer.preview || game.background_image}
                      alt="Trailer thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <FiPlay className="text-white text-2xl" />
                    </div>
                  </motion.div>
                ))}

                {/* Screenshots */}
                {screenshots.map((screenshot, index) => (
                  <motion.img
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    src={screenshot.image}
                    alt={`Screenshot ${index + 1}`}
                    className={`flex-shrink-0 w-32 h-20 object-cover rounded-lg cursor-pointer border-2 transition-colors ${
                      selectedMedia?.index === index && selectedMedia?.type === 'image'
                        ? 'border-rawg-blue'
                        : 'border-transparent'
                    }`}
                    onClick={() => {
                      setCurrentScreenshot(index);
                      setSelectedMedia({
                        type: 'image',
                        url: screenshot.image,
                        index
                      });
                    }}
                  />
                ))}
              </div>
            </section>

            {/* Description */}
            {game.description_raw && (
              <section>
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <div 
                  className="text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: game.description_raw.replace(/\n/g, '<br />') 
                  }}
                />
              </section>
            )}

            {/* Similar Games */}
            {similarGames.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Games like {game.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similarGames.slice(0, 6).map((similarGame) => (
                    <GameCard key={similarGame.id} game={similarGame} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Info */}
            <div className="card p-6">
              <h3 className="text-lg font-bold mb-4">Game Details</h3>
              
              <div className="space-y-3">
                {game.released && (
                  <div>
                    <span className="text-gray-400 text-sm">Release Date</span>
                    <div className="font-medium">
                      {format(new Date(game.released), 'MMMM dd, yyyy')}
                    </div>
                  </div>
                )}

                {game.developers?.length > 0 && (
                  <div>
                    <span className="text-gray-400 text-sm">Developer</span>
                    <div className="font-medium">
                      {game.developers.map(dev => dev.name).join(', ')}
                    </div>
                  </div>
                )}

                {game.publishers?.length > 0 && (
                  <div>
                    <span className="text-gray-400 text-sm">Publisher</span>
                    <div className="font-medium">
                      {game.publishers.map(pub => pub.name).join(', ')}
                    </div>
                  </div>
                )}

                {game.genres?.length > 0 && (
                  <div>
                    <span className="text-gray-400 text-sm">Genres</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {game.genres.map((genre) => (
                        <span key={genre.id} className="genre-tag">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {game.playtime && (
                  <div>
                    <span className="text-gray-400 text-sm">Average Playtime</span>
                    <div className="font-medium">{game.playtime} hours</div>
                  </div>
                )}

                {game.website && (
                  <div>
                    <span className="text-gray-400 text-sm">Website</span>
                    <div>
                      <a
                        href={game.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rawg-blue hover:text-blue-400 flex items-center space-x-1"
                      >
                        <span>Official Website</span>
                        <FiExternalLink className="text-sm" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Platforms */}
            {game.platforms?.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-bold mb-4">Available On</h3>
                <div className="space-y-2">
                  {game.platforms.map((platform, index) => {
                    const platformData = platform?.platform || platform;
                    return (
                      <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-rawg-light-gray transition-colors">
                        <FiMonitor className="text-gray-400" />
                        <span>{platformData.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailerModal && activeTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowTrailerModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowTrailerModal(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
              >
                <FiX className="text-2xl" />
              </button>
              
              <video
                src={activeTrailer.data?.max || activeTrailer.data?.['480']}
                controls
                autoPlay
                className="w-full h-full rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GameDetailsPage;