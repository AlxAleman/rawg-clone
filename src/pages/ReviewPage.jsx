import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiStar, FiUser, FiCalendar } from 'react-icons/fi';
import { fetchGames } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const ReviewsPage = () => {
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentGames = async () => {
      try {
        const data = await fetchGames({ 
          page_size: 6,
          ordering: '-released',
          metacritic: '70,100'
        });
        setRecentGames(data.results || []);
      } catch (err) {
        console.error('Error loading games:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecentGames();
  }, []);

  const mockReviews = [
    {
      id: 1,
      user: "GameMaster2024",
      game: "Cyberpunk 2077",
      rating: 4.5,
      date: "2024-06-25",
      content: "After the recent updates, this game has really come into its own. The storyline is incredible and Night City feels truly alive.",
      likes: 142,
      helpful: 89
    },
    {
      id: 2,
      user: "RPGFanatic",
      game: "Baldur's Gate 3",
      rating: 5.0,
      date: "2024-06-24",
      content: "Simply the best RPG I've played in years. The character development and story choices are phenomenal.",
      likes: 298,
      helpful: 156
    },
    {
      id: 3,
      user: "ActionHero",
      game: "Spider-Man 2",
      rating: 4.2,
      date: "2024-06-23",
      content: "Web-swinging feels amazing and the dual protagonist system works really well. Combat is fluid and satisfying.",
      likes: 87,
      helpful: 45
    }
  ];

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
          <FiMessageSquare className="text-2xl text-rawg-blue" />
          <h1 className="text-4xl font-bold text-white">Game Reviews</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Read honest reviews from the gaming community
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-rawg-gray p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <FiMessageSquare className="text-blue-400" />
            <span className="text-sm text-gray-400">Total Reviews</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">2.3M+</div>
        </div>
        <div className="bg-rawg-gray p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <FiUser className="text-green-400" />
            <span className="text-sm text-gray-400">Active Reviewers</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">45K+</div>
        </div>
        <div className="bg-rawg-gray p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <FiStar className="text-yellow-400" />
            <span className="text-sm text-gray-400">Average Rating</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">4.2</div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Reviews</h2>
        <div className="space-y-4">
          {mockReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-rawg-gray p-6 rounded-lg hover:bg-rawg-light-gray transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-rawg-blue rounded-full flex items-center justify-center">
                    <FiUser className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{review.user}</h3>
                    <p className="text-sm text-gray-400">Reviewed {review.game}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <FiStar className="text-yellow-400" />
                    <span className="text-white font-medium">{review.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-400">
                    <FiCalendar />
                    <span>{review.date}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{review.content}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{review.likes} likes</span>
                <span>•</span>
                <span>{review.helpful} found helpful</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-rawg-blue to-purple-600 p-6 rounded-xl text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Write Your Own Review</h3>
        <p className="text-white/90 mb-4">
          Share your gaming experience with the community
        </p>
        <button className="bg-white text-rawg-blue px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Start Writing
        </button>
      </div>
    </motion.div>
  );
};

export default ReviewsPage;