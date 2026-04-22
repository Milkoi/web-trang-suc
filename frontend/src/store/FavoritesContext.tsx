import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import api from '../services/api';

interface FavoritesContextType {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, openAuth } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Fetch favorites from API on auth change
  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await api.get('/favorites');
          setFavorites(response.data);
        } catch (error) {
          console.error('Failed to fetch favorites from server', error);
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
    };
    fetchFavorites();
  }, [isAuthenticated, user?.id]);

  const toggleFavorite = async (product: Product) => {
    if (!isAuthenticated) {
      openAuth('login');
      return;
    }

    const isFav = isFavorite(product.id);

    try {
      if (isFav) {
        // Optimistic UI update
        setFavorites(prev => prev.filter(p => p.id !== product.id));
        await api.delete(`/favorites/${product.id}`);
      } else {
        // Optimistic UI update
        setFavorites(prev => [...prev, product]);
        await api.post(`/favorites/${product.id}`);
      }
    } catch (error) {
      console.error('Failed to update favorite status', error);
      // Revert optimistic update on failure
      const response = await api.get('/favorites');
      setFavorites(response.data);
    }
  };

  const isFavorite = (id: number) => {
    return favorites.some(p => p.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
