import React, { useState } from 'react';
import { PlayerData } from '../../types/sports';
import { User, Shield, Star, Activity, Award, Trophy } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface PlayerViewProps {
  data: PlayerData;
}

export const PlayerView: React.FC<PlayerViewProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'game' | 'season' | 'career'>('career');
  const { favorites, addFavorite, removeFavorite } = useAppContext();

  const isFavorite = favorites.includes(data.playerName);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(data.playerName);
    } else {
      addFavorite(data.playerName);
    }
  };

  const renderStatsGrid = (stats?: Record<string, number | string>) => {
    if (!stats) return <p className="text-zinc-500">No stats available.</p>;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(stats).map(([label, value], idx) => (
          <div key={idx} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{label}</span>
            <span className="text-2xl font-bold text-zinc-100">{value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-900/40 to-zinc-900/10"></div>

        <div className="relative pt-12 px-6 pb-6 md:px-10 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-zinc-800 border-4 border-zinc-900 rounded-full flex items-center justify-center shadow-2xl relative z-10 shrink-0">
            <User className="w-12 h-12 md:w-16 md:h-16 text-zinc-600" />
          </div>

          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">{data.playerName}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm">
              <span className="flex items-center text-zinc-300 bg-zinc-800/80 px-3 py-1 rounded-full border border-zinc-700/50">
                <Shield className="w-4 h-4 mr-1.5 text-blue-400" />
                {data.currentTeamOrNation}
              </span>
              <span className="flex items-center text-zinc-300 bg-zinc-800/80 px-3 py-1 rounded-full border border-zinc-700/50">
                <Activity className="w-4 h-4 mr-1.5 text-gold" />
                {data.positionOrRole}
              </span>
            </div>
          </div>

          <button
            onClick={toggleFavorite}
            className="absolute top-4 right-4 md:relative md:top-auto md:right-auto p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors border border-zinc-700 z-10"
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'text-gold' : 'text-zinc-400'}`} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="px-6 md:px-10 py-6 bg-zinc-950/50 border-t border-zinc-800">
          <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
            {data.profileSummary}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Tabs */}
        <div className="flex border-b border-zinc-800 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('career')}
            className={`flex-1 py-4 px-6 text-sm font-medium whitespace-nowrap transition-colors flex items-center justify-center
              ${activeTab === 'career' ? 'text-blue-400 border-b-2 border-blue-400 bg-zinc-800/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20'}`}
          >
            <Trophy className="w-4 h-4 mr-2" /> Career Totals
          </button>
          <button
            onClick={() => setActiveTab('season')}
            className={`flex-1 py-4 px-6 text-sm font-medium whitespace-nowrap transition-colors flex items-center justify-center
              ${activeTab === 'season' ? 'text-blue-400 border-b-2 border-blue-400 bg-zinc-800/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20'}`}
          >
            <Award className="w-4 h-4 mr-2" /> Season Stats
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`flex-1 py-4 px-6 text-sm font-medium whitespace-nowrap transition-colors flex items-center justify-center
              ${activeTab === 'game' ? 'text-blue-400 border-b-2 border-blue-400 bg-zinc-800/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20'}`}
          >
            <Activity className="w-4 h-4 mr-2" /> Latest Game
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          {activeTab === 'career' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-zinc-100">Overall Metrics</h3>
                <span className="text-sm text-zinc-500">Active: {data.careerStats?.activeYears || 'N/A'}</span>
              </div>
              {renderStatsGrid(data.careerStats?.overallMetrics)}

              {data.careerStats?.titlesAndAccolades && data.careerStats.titlesAndAccolades.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-4">Accolades</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.careerStats.titlesAndAccolades.map((title, i) => (
                      <li key={i} className="flex items-start text-zinc-300 text-sm">
                        <Star className="w-4 h-4 text-gold mr-2 shrink-0 mt-0.5" />
                        <span>{title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'season' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-zinc-100">Season Summary</h3>
                <span className="text-sm font-medium text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
                  {data.seasonStats?.seasonLabel || 'Current'}
                </span>
              </div>
              {renderStatsGrid(data.seasonStats?.stats)}
            </div>
          )}

          {activeTab === 'game' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-zinc-100">Single Game Metrics</h3>
                <span className="text-sm text-zinc-400 truncate max-w-[200px] md:max-w-md">
                  {data.gameStats?.matchRef || 'Latest Match'}
                </span>
              </div>
              {renderStatsGrid(data.gameStats?.stats)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
