import { FootballDataTeam } from "./types";

export type MappedTeam = {
  externalId: number;
  name: string;
  shortName: string | null;
  code: string | null;
  crestUrl: string | null;
};

export const mapFootballDataTeam = (team: FootballDataTeam): MappedTeam => {
  return {
    externalId: team.id,
    name: team.name,
    shortName: team.name,
    code: team.tla || null,
    crestUrl: team.crest || null,
  };
};
