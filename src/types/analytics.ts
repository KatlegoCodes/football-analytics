export type MatchResult = "W" | "D" | "L";

export type TeamFormResult = {
  matchId: number;
  opponentId: number;
  opponent: string;
  playedAt: Date;

  venue: "HOME" | "AWAY";
  result: MatchResult;

  goalsFor: number;
  goalsAgainst: number;
};

export type TeamForm = {
  teamId: number;
  team: string;

  matches: TeamFormResult[];

  played: number;
  wins: number;
  draws: number;
  losses: number;

  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;

  points: number;
  pointsPerGame: number;
};

export type PerformanceSplit = {
  played: number;
  wins: number;
  draws: number;
  losses: number;

  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;

  points: number;
  pointsPerGame: number;

  goalsPerGame: number;
  goalsAgainstPerGame: number;

  cleanSheets: number;
  failedToScore: number;
};

export type TeamPerformance = {
  teamId: number;
  team: string;

  overall: PerformanceSplit;
  home: PerformanceSplit;
  away: PerformanceSplit;
};

export type MatchOutcome = "HOME_WIN" | "AWAY_WIN" | "DRAW" | null;

export type MatchTeamDetail = {
  id: number;
  name: string;
  shortName: string | null;
  code: string | null;
  crestUrl: string | null;
};

export type MatchDetail = {
  id: number;
  externalId: number | null;

  playedAt: Date;
  status: string;
  matchday: number | null;

  homeTeam: MatchTeamDetail;
  awayTeam: MatchTeamDetail;

  homeScore: number | null;
  awayScore: number | null;

  outcome: MatchOutcome;

  season: {
    id: number;
    name: string;
    startYear: number;
    endYear: number;
  };
};
