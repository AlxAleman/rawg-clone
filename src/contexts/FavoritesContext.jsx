import React, { createContext, useContext, useReducer, useEffect } from 'react';

const FavoritesContext = createContext();

// Tipos de acciones
const ACTIONS = {
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  ADD_WISHLIST: 'ADD_WISHLIST',
  REMOVE_WISHLIST: 'REMOVE_WISHLIST',
  LOAD_DATA: 'LOAD_DATA',
  CLEAR_ALL: 'CLEAR_ALL'
};

// Estado inicial
const initialState = {
  favorites: [],
  wishlist: []
};

// Reducer para manejar las acciones
const favoritesReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_FAVORITE:
      if (state.favorites.find(game => game.id === action.payload.id)) {
        return state; // Ya existe
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload]
      };

    case ACTIONS.REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter(game => game.id !== action.payload)
      };

    case ACTIONS.ADD_WISHLIST:
      if (state.wishlist.find(game => game.id === action.payload.id)) {
        return state; // Ya existe
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      };

    case ACTIONS.REMOVE_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.filter(game => game.id !== action.payload)
      };

    case ACTIONS.LOAD_DATA:
      return {
        ...state,
        ...action.payload
      };

    case ACTIONS.CLEAR_ALL:
      return initialState;

    default:
      return state;
  }
};

// Provider component
export const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('rawg-favorites');
      const savedWishlist = localStorage.getItem('rawg-wishlist');
      
      if (savedFavorites || savedWishlist) {
        dispatch({
          type: ACTIONS.LOAD_DATA,
          payload: {
            favorites: savedFavorites ? JSON.parse(savedFavorites) : [],
            wishlist: savedWishlist ? JSON.parse(savedWishlist) : []
          }
        });
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, []);

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    try {
      localStorage.setItem('rawg-favorites', JSON.stringify(state.favorites));
      localStorage.setItem('rawg-wishlist', JSON.stringify(state.wishlist));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [state.favorites, state.wishlist]);

  // Funciones helper
  const addFavorite = (game) => {
    dispatch({
      type: ACTIONS.ADD_FAVORITE,
      payload: {
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        rating: game.rating,
        released: game.released,
        genres: game.genres,
        platforms: game.platforms,
        addedAt: new Date().toISOString()
      }
    });
  };

  const removeFavorite = (gameId) => {
    dispatch({
      type: ACTIONS.REMOVE_FAVORITE,
      payload: gameId
    });
  };

  const addWishlist = (game) => {
    dispatch({
      type: ACTIONS.ADD_WISHLIST,
      payload: {
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        rating: game.rating,
        released: game.released,
        genres: game.genres,
        platforms: game.platforms,
        addedAt: new Date().toISOString()
      }
    });
  };

  const removeWishlist = (gameId) => {
    dispatch({
      type: ACTIONS.REMOVE_WISHLIST,
      payload: gameId
    });
  };

  const isFavorite = (gameId) => {
    return state.favorites.some(game => game.id === gameId);
  };

  const isInWishlist = (gameId) => {
    return state.wishlist.some(game => game.id === gameId);
  };

  const clearAll = () => {
    dispatch({ type: ACTIONS.CLEAR_ALL });
  };

  const toggleFavorite = (game) => {
    if (isFavorite(game.id)) {
      removeFavorite(game.id);
    } else {
      addFavorite(game);
    }
  };

  const toggleWishlist = (game) => {
    if (isInWishlist(game.id)) {
      removeWishlist(game.id);
    } else {
      addWishlist(game);
    }
  };

  const value = {
    favorites: state.favorites,
    wishlist: state.wishlist,
    addFavorite,
    removeFavorite,
    addWishlist,
    removeWishlist,
    isFavorite,
    isInWishlist,
    toggleFavorite,
    toggleWishlist,
    clearAll,
    totalFavorites: state.favorites.length,
    totalWishlist: state.wishlist.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;