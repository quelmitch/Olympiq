import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getStorageItem, setStorageItem } from '../services/storage';
import { QueryResponse } from '../types/sports';
import { AppNotification, getStoredNotifications } from '../services/notifications';

interface AppContextProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  favorites: string[];
  addFavorite: (item: string) => void;
  removeFavorite: (item: string) => void;
  history: { query: string; result: QueryResponse }[];
  addToHistory: (query: string, result: QueryResponse) => void;
  activeQuery: string;
  setActiveQuery: (query: string) => void;
  activeResult: QueryResponse | null;
  setActiveResult: (result: QueryResponse | null) => void;
  notifications: AppNotification[];
  refreshNotifications: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string>(() => getStorageItem('olympiq_api_key', ''));
  const [favorites, setFavoritesState] = useState<string[]>(() => getStorageItem('olympiq_favorites', []));
  const [history, setHistoryState] = useState<{ query: string; result: QueryResponse }[]>(() => getStorageItem('olympiq_history', []));
  const [activeQuery, setActiveQuery] = useState<string>('');
  const [activeResult, setActiveResult] = useState<QueryResponse | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>(getStoredNotifications);

  useEffect(() => {
    const handleNotification = (e: CustomEvent<AppNotification>) => {
      setNotifications(prev => [e.detail, ...prev].slice(0, 50));
    };
    window.addEventListener('olympiq-notification-triggered', handleNotification as EventListener);
    return () => {
      window.removeEventListener('olympiq-notification-triggered', handleNotification as EventListener);
    };
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    setStorageItem('olympiq_api_key', key);
  };

  const addFavorite = (item: string) => {
    const newFavorites = [...new Set([...favorites, item])];
    setFavoritesState(newFavorites);
    setStorageItem('olympiq_favorites', newFavorites);
  };

  const removeFavorite = (item: string) => {
    const newFavorites = favorites.filter((f) => f !== item);
    setFavoritesState(newFavorites);
    setStorageItem('olympiq_favorites', newFavorites);
  };

  const addToHistory = (query: string, result: QueryResponse) => {
    const newHistory = [{ query, result }, ...history.filter(h => h.query !== query)].slice(0, 20); // Keep last 20
    setHistoryState(newHistory);
    setStorageItem('olympiq_history', newHistory);
  };

  const refreshNotifications = () => {
    setNotifications(getStoredNotifications());
  };

  return (
    <AppContext.Provider
      value={{
        apiKey,
        setApiKey,
        favorites,
        addFavorite,
        removeFavorite,
        history,
        addToHistory,
        activeQuery,
        setActiveQuery,
        activeResult,
        setActiveResult,
        notifications,
        refreshNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
