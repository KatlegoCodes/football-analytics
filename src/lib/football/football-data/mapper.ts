import { FootballDataTeam, FootballDataMatch } from "./types";

export type MappedTeam = {
  externalId: number;
  provider: "football-data";
  name: string;
  shortName: string | null;
  code: string | null;
  crestUrl: string | null;
};

export type MappedMatch = {
  externalId: number;
  provider: "football-data";

  seasonExternalId: number;
  homeTeamExternalId: number;
  awayTeamExternalId: number;
  homeScore: number | null;
  awayScore: number | null;
  playedAt: Date;
  status: string;
  matchday: number | null;
};

export const mapFootballDataTeam = (team: FootballDataTeam): MappedTeam => {
  return {
    externalId: team.id,
    provider: "football-data",
    name: team.name,
    shortName: team.name,
    code: team.tla || null,
    crestUrl: team.crest || null,
  };
};

export const mapFootballDataMatch = (match: FootballDataMatch): MappedMatch => {
  return {
    externalId: match.id,
    provider: "football-data",
    homeTeamExternalId: match.homeTeam.id,
    awayTeamExternalId: match.awayTeam.id,
    homeScore: match.score.fullTime?.home ?? null,
    awayScore: match.score.fullTime?.away ?? null,
    playedAt: new Date(match.utcDate),
    status: match.status,
    matchday: match.matchday ?? null,
    seasonExternalId: match.season.id,
  };
};
