import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { fetchSportsData } from '../../services/gemini';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiKey, setActiveQuery, setActiveResult, addToHistory } = useAppContext();
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (!apiKey) {
      setError('Please set your Gemini API key in settings first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchSportsData(query, apiKey);
      setActiveQuery(query);
      setActiveResult(result);
      addToHistory(query, result);

      // Update URL to support deep linking/sharing
      navigate(`/?q=${encodeURIComponent(query)}`);
      setQuery('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about matches, schedules, stats, or medals..."
          className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-full py-4 pl-12 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg"
          disabled={isLoading}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </button>
      </form>
      {error && <p className="text-red-400 text-sm mt-2 ml-4">{error}</p>}
    </div>
  );
};
