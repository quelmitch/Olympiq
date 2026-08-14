export type QueryType = 'match' | 'schedule' | 'player' | 'medals';

// ==========================================
// TYPE 1: MATCH / GAME / RACE
// ==========================================
export interface MatchParticipant {
  name: string;
  isWinner: boolean;
  scoreSummary: string;
  periodScores?: string[];
  scorersOrStandouts?: string[];
}

export interface KeyMoment {
  timeMarker: string;
  title: string;
  description: string;
}

export interface BoxScoreMetric {
  label: string;
  team1Val: string;
  team2Val: string;
}

export interface MatchData {
  id: string;
  sport: string;
  tournament: string;
  title: string;
  status: 'Historical' | 'Live' | 'Upcoming';
  startTimeISO: string;
  venue: { name: string; city: string; country: string };
  broadcasts: { network: string; regionOrCountry: string }[];
  participants: MatchParticipant[];
  overview: string;
  keyMoments: KeyMoment[];
  boxScoreMetrics: BoxScoreMetric[];
}

// ==========================================
// TYPE 2: SCHEDULE & FIXTURES
// ==========================================
export interface Fixture {
  date: string;
  time: string;
  homeOrParticipant1: string;
  awayOrParticipant2: string;
  competition: string;
  venue: string;
  broadcast: string;
}

export interface ScheduleData {
  coverageRange: string;
  fixtures: Fixture[];
}

// ==========================================
// TYPE 3: PLAYER / ATHLETE STATS
// ==========================================
export interface PlayerData {
  playerName: string;
  currentTeamOrNation: string;
  positionOrRole: string;
  profileSummary: string;
  gameStats?: { matchRef: string; stats: Record<string, number | string> };
  seasonStats?: { seasonLabel: string; stats: Record<string, number | string> };
  careerStats?: {
    activeYears: string;
    titlesAndAccolades: string[];
    overallMetrics: Record<string, number | string>;
  };
}

// ==========================================
// TYPE 4: MEDAL TABLE & CHAMPIONSHIPS
// ==========================================
export interface NationMedal {
  rank: number;
  country: string;
  countryCode: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export interface MedalWinner {
  athlete: string;
  nation: string;
  mark?: string;
}

export interface EventMedal {
  eventName: string;
  gold: MedalWinner;
  silver: MedalWinner;
  bronze: MedalWinner;
}

export interface SportMedal {
  sportName: string;
  events: EventMedal[];
}

export interface TopAthlete {
  athleteName: string;
  nation: string;
  sport: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  notableEvents: string[];
}

export interface MedalTableData {
  competitionName: string;
  yearOrEdition: string;
  hostCityCountry: string;
  championshipOverview: string;
  byNation: NationMedal[];
  bySport: SportMedal[];
  topAthletes: TopAthlete[];
}

export interface QueryResponse {
  type: QueryType;
  data: MatchData | ScheduleData | PlayerData | MedalTableData;
}
