import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiExternalLink, FiStar, FiTag } from 'react-icons/fi';
import { fetchStores } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStores = async () => {
      try {
        const data = await fetchStores();
        setStores(data.results || []);
      } catch (err) {
        console.error('Error loading stores:', err);
        // Fallback to mock data if API fails
        setStores(mockStores);
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, []);

  const mockStores = [
    {
      id: 1,
      name: "Steam",
      domain: "store.steampowered.com",
      games_count: 50000,
      image_background: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
      description: "The world's largest digital distribution platform for PC gaming"
    },
    {
      id: 2,
      name: "Epic Games Store",
      domain: "epicgames.com",
      games_count: 800,
      image_background: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
      description: "Epic's digital marketplace with weekly free games"
    },
    {
      id: 3,
      name: "GOG",
      domain: "gog.com",
      games_count: 5000,
      image_background: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800",
      description: "DRM-free games from CD PROJEKT"
    },
    {
      id: 4,
      name: "PlayStation Store",
      domain: "store.playstation.com",
      games_count: 3000,
      image_background: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800",
      description: "Official PlayStation digital store"
    },
    {
      id: 5,
      name: "Xbox Store",
      domain: "microsoft.com/store",
      games_count: 2500,
      image_background: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800",
      description: "Microsoft's gaming marketplace"
    },
    {
      id: 6,
      name: "Nintendo eShop",
      domain: "nintendo.com/us/eshop",
      games_count: 4000,
      image_background: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      description: "Nintendo's digital game store"
    }
  ];

  const getStoreIcon = (storeName) => {
    const name = storeName.toLowerCase();
    if (name.includes('steam')) return '🎮';
    if (name.includes('epic')) return '🏪';
    if (name.includes('gog')) return '🆓';
    if (name.includes('playstation')) return '🎯';
    if (name.includes('xbox')) return '🎲';
    if (name.includes('nintendo')) return '🍄';
    return '🛍️';
  };

  const deals = [
    {
      id: 1,
      title: "Summer Sale",
      store: "Steam",
      discount: "Up to 90% off",
      description: "Massive discounts on thousands of games",
      endDate: "July 15, 2024"
    },
    {
      id: 2,
      title: "Mega Sale",
      store: "Epic Games Store",
      discount: "Up to 75% off",
      description: "Plus free games every week",
      endDate: "June 30, 2024"
    },
    {
      id: 3,
      title: "DRM-Free Sale",
      store: "GOG",
      discount: "Up to 85% off",
      description: "Classic and modern games without DRM",
      endDate: "July 5, 2024"
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
          <FiShoppingCart className="text-2xl text-rawg-blue" />
          <h1 className="text-4xl font-bold text-white">Game Stores</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Find the best deals across all major gaming platforms
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-rawg-gray p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <FiShoppingCart className="text-blue-400" />
            <span className="text-sm text-gray-400">Total Stores</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">{stores.length}</div>
        </div>
        <div className="bg-rawg-gray p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <FiTag className="text-green-400" />
            <span className="text-sm text-gray-400">Active Deals</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">{deals.length}</div>
        </div>
        <div className="bg-rawg-gray p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <FiStar className="text-yellow-400" />
            <span className="text-sm text-gray-400">Total Games</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {stores.reduce((total, store) => total + (store.games_count || 0), 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Current Deals */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">🔥 Current Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 p-6 rounded-lg hover:border-red-500/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-white">{deal.title}</h3>
                <FiTag className="text-red-400" />
              </div>
              <div className="text-sm text-gray-400 mb-2">{deal.store}</div>
              <div className="text-2xl font-bold text-red-400 mb-2">{deal.discount}</div>
              <p className="text-gray-300 text-sm mb-3">{deal.description}</p>
              <div className="text-xs text-gray-500">Ends {deal.endDate}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* All Stores */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">All Stores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-rawg-gray rounded-lg overflow-hidden hover:bg-rawg-light-gray transition-colors group cursor-pointer"
            >
              {/* Store Image */}
              <div className="relative h-32 overflow-hidden">
                <img
                  src={store.image_background}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-2xl">
                  {getStoreIcon(store.name)}
                </div>
              </div>

              {/* Store Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-rawg-blue transition-colors">
                    {store.name}
                  </h3>
                  <FiExternalLink className="text-gray-400 group-hover:text-rawg-blue transition-colors" />
                </div>
                
                <p className="text-gray-400 text-sm mb-3">
                  {store.description || `Digital game store with ${store.games_count?.toLocaleString() || 0} games`}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {store.games_count?.toLocaleString() || 0} games
                  </div>
                  <div className="text-xs text-gray-600">
                    {store.domain}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 bg-gradient-to-r from-rawg-blue to-purple-600 p-6 rounded-xl text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Never Miss a Deal</h3>
        <p className="text-white/90 mb-4">
          Get notified about the best gaming deals across all platforms
        </p>
        <button className="bg-white text-rawg-blue px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Enable Notifications
        </button>
      </div>
    </motion.div>
  );
};

export default StoresPage;