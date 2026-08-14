import React from 'react';
import { ScheduleData } from '../../types/sports';
import { CalendarDays, MapPin, Tv, Clock, Bell } from 'lucide-react';
import { scheduleReminder } from '../../services/notifications';

interface ScheduleViewProps {
  data: ScheduleData;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ data }) => {
  // Group fixtures by date
  const groupedFixtures = data.fixtures.reduce((acc, fixture) => {
    if (!acc[fixture.date]) {
      acc[fixture.date] = [];
    }
    acc[fixture.date].push(fixture);
    return acc;
  }, {} as Record<string, typeof data.fixtures>);

  const handleSetReminder = (fixture: typeof data.fixtures[0]) => {
    // Attempt to parse date/time, fallback to a standard text notification if unparseable
    const dateTimeStr = `${fixture.date}T${fixture.time}:00`;
    const startTime = new Date(dateTimeStr).getTime();

    const title = `${fixture.homeOrParticipant1} vs ${fixture.awayOrParticipant2}`;

    if (!isNaN(startTime) && startTime > Date.now()) {
      scheduleReminder(
        `Upcoming: ${title}`,
        `${fixture.competition} starting soon on ${fixture.broadcast}`,
        startTime - 15 * 60 * 1000
      );
      alert('Reminder set for 15 minutes before the event.');
    } else {
      // If we can't parse exactly, or it's past, just show a message
      alert('Cannot set reminder for past events or unparseable dates.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 text-zinc-100 bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-sm">
        <CalendarDays className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-xl font-bold">Schedule & Fixtures</h2>
          <p className="text-zinc-400 text-sm">{data.coverageRange}</p>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedFixtures).map(([date, fixtures]) => (
          <div key={date} className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-300 sticky top-[72px] bg-zinc-950/90 backdrop-blur-sm py-2 z-10 border-b border-zinc-800/50">
              {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>

            <div className="grid gap-4">
              {fixtures.map((fixture, idx) => (
                <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-700 transition-colors group">

                  <div className="flex items-center space-x-4 md:w-1/4">
                    <div className="bg-zinc-950 p-3 rounded-lg text-center min-w-[80px] border border-zinc-800">
                      <span className="block text-lg font-bold text-zinc-100">{fixture.time}</span>
                    </div>
                    <div className="text-xs font-medium text-blue-400 uppercase tracking-wider md:hidden">
                      {fixture.competition}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="hidden md:block text-xs font-medium text-blue-400 uppercase tracking-wider mb-1">
                      {fixture.competition}
                    </div>
                    <div className="text-lg font-bold text-zinc-100 flex items-center justify-center md:justify-start flex-wrap gap-2">
                      <span>{fixture.homeOrParticipant1}</span>
                      {fixture.awayOrParticipant2 && (
                        <>
                          <span className="text-zinc-500 text-sm font-normal">vs</span>
                          <span>{fixture.awayOrParticipant2}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end space-y-2 text-sm text-zinc-400 border-t border-zinc-800 md:border-t-0 pt-4 md:pt-0">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 opacity-70" />
                      {fixture.venue}
                    </div>
                    {fixture.broadcast && fixture.broadcast !== 'N/A' && (
                      <div className="flex items-center">
                        <Tv className="w-4 h-4 mr-2 opacity-70" />
                        {fixture.broadcast}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleSetReminder(fixture)}
                    className="absolute top-4 right-4 md:relative md:top-0 md:right-0 p-2 text-zinc-500 hover:text-blue-400 hover:bg-zinc-800 rounded-full transition-colors md:opacity-0 md:group-hover:opacity-100"
                    title="Set Reminder"
                  >
                    <Bell className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
