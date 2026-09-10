import { FootballDataTeam } from "./types";

export type MappedTeam = {
  externalId: number;
  provider: "football-data";
  name: string;
  shortName: string | null;
  code: string | null;
  crestUrl: string | null;
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
