import React from 'react';
import { Settings, Bell, Star } from 'lucide-react';
import { SearchBar } from '../ui/SearchBar';

interface NavbarProps {
  onOpenSettings: () => void;
  onOpenAlerts: () => void;
  unreadAlertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings, onOpenAlerts, unreadAlertsCount }) => {
  return (
    <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-orange-500 flex items-center justify-center shadow-lg shadow-gold/20">
            <Star className="w-5 h-5 text-zinc-950" fill="currentColor" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400 hidden sm:inline-block">
            Olympiq
          </span>
        </div>

        <div className="flex-1 max-w-2xl">
          <SearchBar />
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onOpenAlerts}
            className="relative p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-950"></span>
            )}
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-all"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};
