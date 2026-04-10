import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, openAuth } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>(() => {
    if (user) {
      const stored = localStorage.getItem(`favorites_${user.id}`);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Sync from local storage on auth change
  useEffect(() => {
    if (isAuthenticated && user) {
      const storedFavs = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavs) {
        try {
          setFavorites(JSON.parse(storedFavs));
        } catch (e) {
          console.error('Failed to parse favorites from local storage');
        }
      } else {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated, user?.id]);

  // Save to local storage whenever favorites change
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, isAuthenticated, user?.id]);

  const toggleFavorite = (product: Product) => {
    if (!isAuthenticated) {
      openAuth('login');
      return;
    }
    setFavorites(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
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
