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
