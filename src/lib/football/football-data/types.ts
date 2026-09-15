export type FootballDataArea = {
  id: number;
  name: string;
  code: string;
  flag: string | null;
};

export type FootballDataCompetition = {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string | null;
};

export type FootballDataSeason = {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchDay: number | null;
};

export type FootballDataTeam = {
  id: number;
  name: string;
  shortName: string;
  tla: string | null;
  crest: string | null;
};

export type FootballDataTeamsResponse = {
  count: number;
  filters: {
    season?: string;
  };
  competition: FootballDataCompetition;
  season: FootballDataSeason;
  teams: FootballDataTeam[];
};

export type FootballDataMatchTeam = {
  id: number;
  name: string;
  shortName: string | null;
  tla: string | null;
  crest: string | null;
};

export type FootballDataScore = {
  winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
  duration: string;
  fulltime: {
    home: number | null;
    away: number | null;
  };
};

export type FootballDataMatch = {
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  stage: string;
  homeTeam: FootballDataMatch;
  awayTeam: FootballDataMatch;
  score: FootballDataScore;
};

export type FootballDataMatchesResponse = {
  filters: {
    season?: string;
    matchday: string;
  };
  resultSet: {
    count: number;
    first: string | null;
    last: string | null;
    played: number;
  };
  competition: FootballDataCompetition;
  matches: FootballDataMatch[];
};
