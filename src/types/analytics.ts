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
