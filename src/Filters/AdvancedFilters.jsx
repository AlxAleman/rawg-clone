import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFilter, 
  FiX, 
  FiChevronDown, 
  FiChevronUp,
  FiStar,
  FiCalendar,
  FiSliders
} from 'react-icons/fi';
import { gamesAPI } from '../services/api';

const AdvancedFilters = ({ filters, onFilterChange, genres = [], platforms = [] }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    genres: false,
    platforms: false,
    rating: true,
    year: true,
    metacritic: false
  });

  const handleGenreToggle = (genreId) => {
    const currentGenre = filters.genre;
    const newGenre = currentGenre === genreId.toString() ? '' : genreId.toString();
    onFilterChange({ genre: newGenre });
  };

  const handlePlatformToggle = (platformId) => {
    const currentPlatform = filters.platform;
    const newPlatform = currentPlatform === platformId.toString() ? '' : platformId.toString();
    onFilterChange({ platform: newPlatform });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      genre: '',
      platform: '',
      ordering: '-added',
      page_size: 20
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.genre) count++;
    if (filters.platform) count++;
    if (filters.search) count++;
    return count;
  };

  const FilterSection = ({ title, children, sectionKey, icon: Icon }) => (
    <div className="border-b border-gray-600 pb-4">
      <motion.div
        className="flex items-center justify-between cursor-pointer py-2"
        onClick={() => toggleSection(sectionKey)}
        whileHover={{ backgroundColor: 'rgba(75, 85, 99, 0.3)' }}
      >
        <div className="flex items-center space-x-2">
          <Icon className="text-rawg-blue" />
          <span className="font-medium text-white">{title}</span>
        </div>
        <div className="text-gray-400">
          {expandedSections[sectionKey] ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </motion.div>
      
      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="bg-rawg-gray p-6 rounded-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiFilter className="text-rawg-blue" />
            <h3 className="text-lg font-bold text-white">Advanced Filters</h3>
            {getActiveFiltersCount() > 0 && (
              <div className="bg-rawg-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getActiveFiltersCount()}
              </div>
            )}
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Sort By
          </label>
          <select
            value={filters.ordering || '-added'}
            onChange={(e) => onFilterChange({ ordering: e.target.value })}
            className="w-full bg-rawg-light-gray border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-rawg-blue focus:ring-1 focus:ring-rawg-blue"
          >
            <option value="-added">Most Popular</option>
            <option value="-rating">Highest Rated</option>
            <option value="-released">Newest</option>
            <option value="released">Oldest</option>
            <option value="-metacritic">Metacritic Score</option>
            <option value="name">Name A-Z</option>
            <option value="-name">Name Z-A</option>
          </select>
        </div>

        {/* Genres Filter */}
        <FilterSection title="Genres" sectionKey="genres" icon={FiFilter}>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {genres.map((genre) => (
              <motion.label
                key={genre.id}
                className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-rawg-light-gray transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="radio"
                  name="genre"
                  checked={filters.genre === genre.id.toString()}
                  onChange={() => handleGenreToggle(genre.id)}
                  className="text-rawg-blue"
                />
                <span className="text-sm text-gray-300">{genre.name}</span>
              </motion.label>
            ))}
          </div>
        </FilterSection>

        {/* Platforms Filter */}
        <FilterSection title="Platforms" sectionKey="platforms" icon={FiSliders}>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {platforms.slice(0, 10).map((platform) => (
              <motion.label
                key={platform.id}
                className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-rawg-light-gray transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="radio"
                  name="platform"
                  checked={filters.platform === platform.id.toString()}
                  onChange={() => handlePlatformToggle(platform.id)}
                  className="text-rawg-blue"
                />
                <span className="text-sm text-gray-300">{platform.name}</span>
              </motion.label>
            ))}
          </div>
        </FilterSection>

        {/* Actions */}
        <div className="flex space-x-2 pt-4 border-t border-gray-600">
          <button
            onClick={clearFilters}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;