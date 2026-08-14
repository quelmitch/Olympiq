import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Navbar } from './layout/Navbar';
import { FavoritesBar } from './layout/FavoritesBar';
import { SettingsModal } from './ui/SettingsModal';
import { AlertCenterModal } from './ui/AlertCenterModal';
import { MatchView } from './views/MatchView';
import { ScheduleView } from './views/ScheduleView';
import { PlayerView } from './views/PlayerView';
import { MedalTableView } from './views/MedalTableView';
import { fetchSportsData } from '../services/gemini';
import { Loader2, Search } from 'lucide-react';
import { MatchData, ScheduleData, PlayerData, MedalTableData } from '../types/sports';

export const MainApp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    apiKey,
    activeResult,
    setActiveResult,
    activeQuery,
    setActiveQuery,
    addToHistory,
    notifications,
    history
  } = useAppContext();

  const [isSettingsOpen, setIsSettingsOpen] = useState(!apiKey);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unreadAlertsCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q !== activeQuery && apiKey) {
      // Deep link or search param changed
      const loadQuery = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await fetchSportsData(q, apiKey);
          setActiveQuery(q);
          setActiveResult(result);
          addToHistory(q, result);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch data');
        } finally {
          setIsLoading(false);
        }
      };
      loadQuery();
    }
  }, [searchParams, apiKey]);

  // Handle default state for empty queries if not loading
  if (!activeResult && !isLoading && !error && apiKey && history.length === 0) {
     // Give user some examples when empty
  }

  const handleHistoryClick = (q: string) => {
    navigate(`/?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col text-zinc-50">
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
      />
      <FavoritesBar />

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
            <p className="text-lg">Analyzing your request...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl max-w-2xl mx-auto text-center">
            <p className="font-semibold mb-2">Error</p>
            <p>{error}</p>
          </div>
        )}

        {!activeResult && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-700">
            <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-2xl">
              <Search className="w-10 h-10 text-zinc-500" />
            </div>
            <h2 className="text-3xl font-bold text-zinc-100 mb-4">Welcome to Olympiq</h2>
            <p className="text-zinc-400 text-lg mb-8">
              Ask anything about sports. Try queries like:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Paris 2024 Olympic medal table",
                "Lionel Messi career stats",
                "Next Arsenal match schedule",
                "Super Bowl LVIII recap"
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/?q=${encodeURIComponent(example)}`)}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 px-4 py-2 rounded-full text-sm transition-all shadow-sm hover:shadow-md"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        )}

        {activeResult && !isLoading && !error && (
          <div className="w-full">
            {activeResult.type === 'match' && <MatchView data={activeResult.data as MatchData} />}
            {activeResult.type === 'schedule' && <ScheduleView data={activeResult.data as ScheduleData} />}
            {activeResult.type === 'player' && <PlayerView data={activeResult.data as PlayerData} />}
            {activeResult.type === 'medals' && <MedalTableView data={activeResult.data as MedalTableData} />}
          </div>
        )}
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <AlertCenterModal isOpen={isAlertsOpen} onClose={() => setIsAlertsOpen(false)} />
    </div>
  );
};
