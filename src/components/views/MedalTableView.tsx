import React, { useState } from 'react';
import { MedalTableData } from '../../types/sports';
import { Trophy, Globe, User, Medal } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Star } from 'lucide-react';

interface MedalTableViewProps {
  data: MedalTableData;
}

export const MedalTableView: React.FC<MedalTableViewProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'nation' | 'sport' | 'athletes'>('nation');
  const [sportFilter, setSportFilter] = useState<string>('All');
  const { favorites, addFavorite, removeFavorite } = useAppContext();

  const isFavorite = favorites.includes(data.competitionName);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(data.competitionName);
    } else {
      addFavorite(data.competitionName);
    }
  };

  const sportsList = ['All', ...(data.bySport?.map(s => s.sportName) || [])];

  const filteredSports = data.bySport?.filter(
    sport => sportFilter === 'All' || sport.sportName === sportFilter
  ) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 text-zinc-800/50 rotate-12 scale-150">
          <Globe className="w-64 h-64" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="px-3 py-1 bg-zinc-950 text-blue-400 text-xs font-bold rounded-full border border-zinc-800 mb-3 inline-block">
                {data.yearOrEdition} • {data.hostCityCountry}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-zinc-100 tracking-tight">
                {data.competitionName}
              </h1>
            </div>
            <button
              onClick={toggleFavorite}
              className="p-3 bg-zinc-950 rounded-full hover:bg-zinc-800 transition-colors border border-zinc-800"
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'text-gold' : 'text-zinc-400'}`} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-3xl mt-4 border-t border-zinc-800/50 pt-4">
            {data.championshipOverview}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-zinc-900 rounded-xl p-1 shadow-inner border border-zinc-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('nation')}
          className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg whitespace-nowrap transition-all flex items-center justify-center
            ${activeTab === 'nation' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
        >
          <Globe className="w-4 h-4 mr-2" /> By Nation
        </button>
        <button
          onClick={() => setActiveTab('sport')}
          className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg whitespace-nowrap transition-all flex items-center justify-center
            ${activeTab === 'sport' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
        >
          <Trophy className="w-4 h-4 mr-2" /> By Sport
        </button>
        <button
          onClick={() => setActiveTab('athletes')}
          className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg whitespace-nowrap transition-all flex items-center justify-center
            ${activeTab === 'athletes' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
        >
          <User className="w-4 h-4 mr-2" /> Top Athletes
        </button>
      </div>

      {/* Content */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        {activeTab === 'nation' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950/80 border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="p-4 font-semibold w-16 text-center">Rank</th>
                  <th className="p-4 font-semibold">Nation</th>
                  <th className="p-4 font-semibold text-center w-20">🥇</th>
                  <th className="p-4 font-semibold text-center w-20">🥈</th>
                  <th className="p-4 font-semibold text-center w-20">🥉</th>
                  <th className="p-4 font-semibold text-center w-24">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {data.byNation?.map((nation, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 text-center text-zinc-400 font-medium">
                      {nation.rank === 1 ? '🥇' : nation.rank === 2 ? '🥈' : nation.rank === 3 ? '🥉' : nation.rank}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="font-semibold text-zinc-200 mr-2">{nation.country}</span>
                        <span className="text-xs text-zinc-500 border border-zinc-700 rounded px-1.5 py-0.5">{nation.countryCode}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center font-semibold text-gold">{nation.gold}</td>
                    <td className="p-4 text-center font-semibold text-zinc-300">{nation.silver}</td>
                    <td className="p-4 text-center font-semibold text-orange-400">{nation.bronze}</td>
                    <td className="p-4 text-center font-bold text-zinc-100">{nation.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'sport' && (
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-100">Podium Finishes</h3>
              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 text-zinc-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
              >
                {sportsList.map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>

            <div className="space-y-8">
              {filteredSports.map((sport, idx) => (
                <div key={idx} className="animate-in fade-in">
                  <h4 className="text-xl font-bold text-blue-400 border-b border-zinc-800 pb-2 mb-4">
                    {sport.sportName}
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sport.events.map((event, eIdx) => (
                      <div key={eIdx} className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
                        <div className="text-sm font-semibold text-zinc-300 mb-3 text-center">{event.eventName}</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center text-zinc-200"><span className="w-5 text-center mr-2">🥇</span> {event.gold.athlete}</span>
                            <span className="text-xs text-zinc-500">{event.gold.mark || event.gold.nation}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center text-zinc-300"><span className="w-5 text-center mr-2">🥈</span> {event.silver.athlete}</span>
                            <span className="text-xs text-zinc-500">{event.silver.mark || event.silver.nation}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center text-zinc-400"><span className="w-5 text-center mr-2">🥉</span> {event.bronze.athlete}</span>
                            <span className="text-xs text-zinc-500">{event.bronze.mark || event.bronze.nation}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'athletes' && (
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950/80 border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="p-4 font-semibold">Athlete</th>
                  <th className="p-4 font-semibold hidden md:table-cell">Sport</th>
                  <th className="p-4 font-semibold text-center">🥇</th>
                  <th className="p-4 font-semibold text-center">🥈</th>
                  <th className="p-4 font-semibold text-center">🥉</th>
                  <th className="p-4 font-semibold text-center">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {data.topAthletes?.map((athlete, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-zinc-200">{athlete.athleteName}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{athlete.nation} • <span className="md:hidden">{athlete.sport}</span></div>
                    </td>
                    <td className="p-4 text-zinc-400 text-sm hidden md:table-cell">{athlete.sport}</td>
                    <td className="p-4 text-center font-semibold text-gold">{athlete.gold}</td>
                    <td className="p-4 text-center font-semibold text-zinc-300">{athlete.silver}</td>
                    <td className="p-4 text-center font-semibold text-orange-400">{athlete.bronze}</td>
                    <td className="p-4 text-center font-bold text-zinc-100">{athlete.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
