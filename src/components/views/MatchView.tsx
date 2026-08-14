import React from 'react';
import { MatchData } from '../../types/sports';
import { Bell, Trophy, Clock, MapPin, Tv, Activity } from 'lucide-react';
import { scheduleReminder } from '../../services/notifications';
import { useAppContext } from '../../context/AppContext';
import { Star } from 'lucide-react';

interface MatchViewProps {
  data: MatchData;
}

export const MatchView: React.FC<MatchViewProps> = ({ data }) => {
  const { favorites, addFavorite, removeFavorite } = useAppContext();
  const isFavorite = favorites.includes(data.title);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(data.title);
    } else {
      addFavorite(data.title);
    }
  };

  const handleSetReminder = () => {
    const startTime = new Date(data.startTimeISO).getTime();
    if (startTime > Date.now()) {
      scheduleReminder(
        `Match Starting Soon: ${data.title}`,
        `${data.tournament} is about to begin!`,
        startTime - 15 * 60 * 1000 // 15 mins before
      );
      alert('Reminder set for 15 minutes before the match.');
    } else {
      alert('This match has already started or finished.');
    }
  };

  const p1 = data.participants[0];
  const p2 = data.participants[1]; // Might be undefined for racing

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 md:p-8 relative">
          <div className="absolute top-4 right-4 flex space-x-2">
            <button onClick={toggleFavorite} className="p-2 bg-zinc-800/80 backdrop-blur rounded-full hover:bg-zinc-700 transition-colors">
              <Star className={`w-5 h-5 ${isFavorite ? 'text-gold' : 'text-zinc-400'}`} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            {data.status === 'Upcoming' && (
              <button onClick={handleSetReminder} className="p-2 bg-zinc-800/80 backdrop-blur rounded-full hover:bg-zinc-700 transition-colors text-blue-400">
                <Bell className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex flex-col items-center mb-6">
            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
              {data.sport} • {data.tournament}
            </span>
            <div className="flex items-center space-x-2 text-sm text-zinc-400">
              <Clock className="w-4 h-4" />
              <span>{new Date(data.startTimeISO).toLocaleString()}</span>
              <span className="mx-2">•</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                data.status === 'Live' ? 'bg-red-500/20 text-red-500 animate-pulse' :
                data.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-700 text-zinc-300'
              }`}>
                {data.status}
              </span>
            </div>
          </div>

          {/* Scoreboard */}
          {p2 ? (
            <div className="flex justify-between items-center max-w-2xl mx-auto">
              <div className="flex flex-col items-center flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-center text-zinc-100 mb-2">{p1.name}</h3>
                {p1.isWinner && <Trophy className="w-6 h-6 text-gold mb-1" />}
              </div>

              <div className="flex flex-col items-center px-4 md:px-8">
                <div className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-50 bg-zinc-800/50 px-6 py-2 rounded-xl">
                  {p1.scoreSummary} - {p2.scoreSummary}
                </div>
              </div>

              <div className="flex flex-col items-center flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-center text-zinc-100 mb-2">{p2.name}</h3>
                {p2.isWinner && <Trophy className="w-6 h-6 text-gold mb-1" />}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-3xl font-bold text-zinc-100 mb-4">{data.title}</h3>
              {p1 && (
                <div className="inline-flex items-center bg-zinc-800 px-6 py-3 rounded-xl">
                  <span className="text-xl font-semibold text-zinc-300 mr-4">{p1.name}</span>
                  <span className="text-2xl font-bold text-gold">{p1.scoreSummary}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Bar */}
        <div className="bg-zinc-950/50 px-6 py-4 border-t border-zinc-800 flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {data.venue.name}, {data.venue.city}
          </div>
          {data.broadcasts && data.broadcasts.length > 0 && (
            <div className="flex items-center">
              <Tv className="w-4 h-4 mr-2 text-blue-400" />
              {data.broadcasts.map(b => b.network).join(' / ')}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-zinc-100 mb-3 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-400" />
              Match Overview
            </h4>
            <p className="text-zinc-300 leading-relaxed">{data.overview}</p>
          </div>

          {data.keyMoments && data.keyMoments.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-zinc-100 mb-4">Key Moments</h4>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-700 before:to-transparent">
                {data.keyMoments.map((moment, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-zinc-900 bg-zinc-700 text-zinc-100 text-xs font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      {moment.timeMarker}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 shadow">
                      <div className="font-semibold text-zinc-200 mb-1">{moment.title}</div>
                      <div className="text-sm text-zinc-400">{moment.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {data.boxScoreMetrics && data.boxScoreMetrics.length > 0 && p2 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-zinc-100 mb-4">Team Stats</h4>
              <div className="space-y-4">
                {data.boxScoreMetrics.map((metric, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>{metric.team1Val}</span>
                      <span className="font-medium text-zinc-300">{metric.label}</span>
                      <span>{metric.team2Val}</span>
                    </div>
                    {/* Visual bar attempt - assumes % or numbers that can be approximated, fallback to 50/50 if not parsable easily */}
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                      <div className="h-full bg-blue-500" style={{ width: '50%' }}></div>
                      <div className="h-full bg-zinc-600" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(p1?.periodScores || p2?.periodScores) && p2 && (
             <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
               <h4 className="text-lg font-semibold text-zinc-100 mb-4">Box Score</h4>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50">
                     <tr>
                       <th className="px-3 py-2 rounded-tl-lg">Team</th>
                       {p1.periodScores?.map((_, i) => (
                         <th key={i} className="px-3 py-2 text-center">{i + 1}</th>
                       ))}
                       <th className="px-3 py-2 text-center font-bold text-zinc-300 rounded-tr-lg">T</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr className="border-b border-zinc-800/50">
                       <td className="px-3 py-2 font-medium text-zinc-200">{p1.name}</td>
                       {p1.periodScores?.map((score, i) => (
                         <td key={i} className="px-3 py-2 text-center text-zinc-400">{score}</td>
                       ))}
                       <td className="px-3 py-2 text-center font-bold text-zinc-200">{p1.scoreSummary}</td>
                     </tr>
                     <tr>
                       <td className="px-3 py-2 font-medium text-zinc-200">{p2.name}</td>
                       {p2.periodScores?.map((score, i) => (
                         <td key={i} className="px-3 py-2 text-center text-zinc-400">{score}</td>
                       ))}
                       <td className="px-3 py-2 text-center font-bold text-zinc-200">{p2.scoreSummary}</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
