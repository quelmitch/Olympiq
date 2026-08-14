import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FavoritesBar: React.FC = () => {
  const { favorites, removeFavorite } = useAppContext();
  const navigate = useNavigate();

  if (favorites.length === 0) return null;

  return (
    <div className="bg-zinc-900 border-b border-zinc-800 overflow-x-auto whitespace-nowrap custom-scrollbar">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center space-x-2">
        <Star className="w-4 h-4 text-gold shrink-0 mr-2" fill="currentColor" />
        {favorites.map((fav) => (
          <div
            key={fav}
            className="inline-flex items-center bg-zinc-800 rounded-full px-3 py-1 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors cursor-pointer border border-zinc-700"
            onClick={() => navigate(`/?q=${encodeURIComponent(fav)}`)}
          >
            <span>{fav}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFavorite(fav);
              }}
              className="ml-2 text-zinc-500 hover:text-red-400 focus:outline-none"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
