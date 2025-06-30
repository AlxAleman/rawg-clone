import axios from 'axios';

const API_KEY = 'a0d5406e060a4fbabedeea9f3b3daa8a';
const BASE_URL = 'https://api.rawg.io/api';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

// Interceptor silencioso para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo loggear errores que no sean 401 para evitar spam en consola
    if (error.response?.status !== 401) {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

export const gamesAPI = {
  // Obtener juegos nuevos y trending
  getNewAndTrending: async (page = 1) => {
    try {
      const response = await api.get('/games', {
        params: {
          dates: '2024-01-01,2025-12-31',
          ordering: '-added',
          page,
          page_size: 20,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching new and trending games:', error);
      return { results: [] };
    }
  },

  // Obtener juegos más populares
  getTopGames: async (page = 1) => {
    try {
      const response = await api.get('/games', {
        params: {
          ordering: '-metacritic',
          page,
          page_size: 20,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top games:', error);
      return { results: [] };
    }
  },

  // Obtener juegos por género
  getGamesByGenre: async (genreId, page = 1) => {
    try {
      const response = await api.get('/games', {
        params: {
          genres: genreId,
          page,
          page_size: 20,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching games by genre:', error);
      return { results: [] };
    }
  },

  // Obtener juegos por plataforma
  getGamesByPlatform: async (platformId, page = 1) => {
    try {
      const response = await api.get('/games', {
        params: {
          platforms: platformId,
          page,
          page_size: 20,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching games by platform:', error);
      return { results: [] };
    }
  },

  // Obtener detalles de un juego
  getGameDetails: async (id) => {
    try {
      const response = await api.get(`/games/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching game details:', error);
      throw error;
    }
  },

  // Obtener screenshots de un juego
  getGameScreenshots: async (id) => {
    try {
      const response = await api.get(`/games/${id}/screenshots`);
      return response.data;
    } catch (error) {
      console.log(`Screenshots not available for game ${id}`);
      return { results: [] };
    }
  },

  // Obtener trailers de un juego
  getGameTrailers: async (id) => {
    try {
      const response = await api.get(`/games/${id}/movies`);
      return response.data;
    } catch (error) {
      console.log(`Trailers not available for game ${id}`);
      return { results: [] };
    }
  },

  // Obtener juegos similares - MÉTODO COMPLETAMENTE REESCRITO
  getSimilarGames: async (id) => {
    try {
      // Primero, obtener información del juego para conseguir sus géneros
      const gameResponse = await api.get(`/games/${id}`);
      const game = gameResponse.data;
      
      if (game.genres && game.genres.length > 0) {
        // Usar el primer género para buscar juegos similares
        const genreId = game.genres[0].id;
        const similarResponse = await api.get('/games', {
          params: {
            genres: genreId,
            page_size: 10,
            ordering: '-rating',
          },
        });
        
        // Filtrar el juego actual de los resultados
        const filteredResults = similarResponse.data.results.filter(g => g.id !== parseInt(id));
        
        return {
          results: filteredResults.slice(0, 6)
        };
      } else {
        // Si no hay géneros, usar juegos populares como fallback
        const popularResponse = await api.get('/games', {
          params: {
            ordering: '-rating',
            page_size: 7,
          },
        });
        
        const filteredResults = popularResponse.data.results.filter(g => g.id !== parseInt(id));
        
        return {
          results: filteredResults.slice(0, 6)
        };
      }
    } catch (error) {
      console.log(`Similar games not available for game ${id}`);
      return { results: [] };
    }
  },

  // Buscar juegos
  searchGames: async (query, page = 1) => {
    try {
      const response = await api.get('/games', {
        params: {
          search: query,
          page,
          page_size: 20,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching games:', error);
      return { results: [] };
    }
  },

  // Obtener géneros
  getGenres: async () => {
    try {
      const response = await api.get('/genres');
      return response.data;
    } catch (error) {
      console.error('Error fetching genres:', error);
      return { results: [] };
    }
  },

  // Obtener plataformas
  getPlatforms: async () => {
    try {
      const response = await api.get('/platforms');
      return response.data;
    } catch (error) {
      console.error('Error fetching platforms:', error);
      return { results: [] };
    }
  },

  // Obtener stores/tiendas
  getStores: async () => {
    try {
      const response = await api.get('/stores');
      return response.data;
    } catch (error) {
      console.error('Error fetching stores:', error);
      return { results: [] };
    }
  },

  // Obtener lanzamientos de esta semana
  getThisWeekReleases: async () => {
    try {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
      
      const formatDate = (date) => date.toISOString().split('T')[0];
      
      const response = await api.get('/games', {
        params: {
          dates: `${formatDate(startOfWeek)},${formatDate(endOfWeek)}`,
          ordering: '-added',
          page_size: 10,
        },
      });
      return response.data;
    } catch (error) {
      console.log('This week releases not available');
      return { results: [] };
    }
  },

  // Obtener próximos lanzamientos
  getUpcomingReleases: async () => {
    try {
      const today = new Date();
      const futureDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
      
      const formatDate = (date) => date.toISOString().split('T')[0];
      
      const response = await api.get('/games', {
        params: {
          dates: `${formatDate(today)},${formatDate(futureDate)}`,
          ordering: 'released',
          page_size: 10,
        },
      });
      return response.data;
    } catch (error) {
      console.log('Upcoming releases not available, using recent games');
      // Fallback: usar juegos recientes
      try {
        const response = await api.get('/games', {
          params: {
            ordering: '-released',
            page_size: 10,
          },
        });
        return response.data;
      } catch (fallbackError) {
        console.error('Error fetching upcoming releases fallback:', fallbackError);
        return { results: [] };
      }
    }
  },

  // Método adicional: obtener juegos populares por rating
  getPopularGames: async (page = 1) => {
    try {
      const response = await api.get('/games', {
        params: {
          ordering: '-rating',
          page,
          page_size: 20,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular games:', error);
      return { results: [] };
    }
  },

  // Método adicional: obtener juegos por año
  getGamesByYear: async (year, page = 1) => {
    try {
      const response = await api.get('/games', {
        params: {
          dates: `${year}-01-01,${year}-12-31`,
          ordering: '-added',
          page,
          page_size: 20,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching games by year:', error);
      return { results: [] };
    }
  },

  // Método general para obtener juegos con parámetros personalizados
  getGamesWithParams: async (params = {}) => {
    try {
      const response = await api.get('/games', {
        params: {
          page_size: 20,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching games with params:', error);
      return { results: [] };
    }
  },
};

// Funciones wrapper para mantener compatibilidad con los nuevos componentes
export const fetchGames = (params = {}) => gamesAPI.getGamesWithParams(params);
export const fetchGenres = () => gamesAPI.getGenres();
export const fetchPlatforms = () => gamesAPI.getPlatforms();
export const fetchStores = () => gamesAPI.getStores();

// Utilidades para formatear datos
export const formatGameData = (game) => ({
  id: game.id,
  name: game.name,
  slug: game.slug,
  background_image: game.background_image,
  released: game.released,
  rating: game.rating,
  rating_top: game.rating_top,
  ratings_count: game.ratings_count,
  metacritic: game.metacritic,
  platforms: game.platforms?.map(p => p.platform) || [],
  genres: game.genres || [],
  tags: game.tags || [],
  short_screenshots: game.short_screenshots || [],
  description: game.description || game.description_raw || '',
});

export default api;