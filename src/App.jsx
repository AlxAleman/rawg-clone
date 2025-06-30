import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import HomePage from './pages/HomePage';
import GameDetailsPage from './pages/GameDetailsPage';
import GenrePage from './pages/GenrePage';
import PlatformPage from './pages/PlatformPage';
import SearchPage from './pages/SearchPage';
import ReviewPage from './pages/ReviewPage';
import BrowsePage from './pages/BrowsePage';
import PlatformsPage from './pages/PlatformsPage';
import StoresPage from './pages/StoresPage';
import NewReleasesPage from './pages/NewReleasesPage';
import TopGamesPage from './pages/TopGamesPage';
import ReleaseCalendarPage from './pages/ReleaseCalendarPage';
import './App.css';

function App() {
  return (
    <FavoritesProvider>
      <Router 
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="min-h-screen bg-rawg-dark text-white">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Routes>
                  {/* Rutas principales */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/game/:id" element={<GameDetailsPage />} />
                  <Route path="/genre/:id" element={<GenrePage />} />
                  <Route path="/platform/:id" element={<PlatformPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  
                  {/* Nuevas rutas */}
                  <Route path="/reviews" element={<ReviewPage />} />
                  <Route path="/browse" element={<BrowsePage />} />
                  <Route path="/platforms" element={<PlatformsPage />} />
                  <Route path="/stores" element={<StoresPage />} />
                  <Route path="/release-calendar" element={<ReleaseCalendarPage />} />
                  
                  {/* Rutas de New Releases */}
                  <Route path="/new-releases/last-30-days" element={<NewReleasesPage period="last-30-days" />} />
                  <Route path="/new-releases/this-week" element={<NewReleasesPage period="this-week" />} />
                  <Route path="/new-releases/next-week" element={<NewReleasesPage period="next-week" />} />
                  
                  {/* Rutas de Top Games */}
                  <Route path="/top/best-of-year" element={<TopGamesPage category="best-of-year" />} />
                  <Route path="/top/popular-2024" element={<TopGamesPage category="popular-2024" />} />
                  <Route path="/top/all-time-250" element={<TopGamesPage category="all-time-250" />} />
                </Routes>
              </motion.div>
            </main>
          </div>
        </div>
      </Router>
    </FavoritesProvider>
  );
}

export default App;