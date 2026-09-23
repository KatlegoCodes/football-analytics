import { prisma } from "@/lib/db/prisma";
import { getCompetitionTeams } from "../football-data/client";
import { mapFootballDataTeam } from "../football-data/mapper";

const PROVIDER = "football-data";

export const syncCompetitionTeams = async (competitionCode: string, leagueId: number) => {
  const response = await getCompetitionTeams(competitionCode);

  const teams = response.teams.map(mapFootballDataTeam);

  const externalIds = teams.map((team) => team.externalId);

  const existingTeams = await prisma.team.findMany({
    where: {
      provider: PROVIDER,
      externalId: {
        in: externalIds,
      },
    },
    select: {
      externalId: true,
    },
  });

  const existingIds = new Set(
    existingTeams.map((team) => team.externalId).filter((id): id is number => id !== null)
  );

  let created = 0;
  let updated = 0;

  for (const team of teams) {
    await prisma.team.upsert({
      where: {
        provider_externalId: {
          provider: team.provider,
          externalId: team.externalId,
        },
      },

      update: {
        name: team.name,
        shortName: team.shortName,
        code: team.code,
        crestUrl: team.crestUrl,
        leagueId,
      },
      create: {
        externalId: team.externalId,
        provider: PROVIDER,
        name: team.name,
        shortName: team.shortName,
        code: team.code,
        crestUrl: team.crestUrl,
        leagueId,
      },
    });

    if (existingIds.has(team.externalId)) {
      updated++;
    } else {
      created++;
    }
  }
  return {
    competition: response.competition.name,
    recieved: teams.length,
    created,
    updated,
  };
};
