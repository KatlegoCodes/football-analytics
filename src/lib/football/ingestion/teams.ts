import { prisma } from "@/lib/db/prisma";
import { getCompetitionTeams } from "../football-data/client";
import { mapFootballDataTeam } from "../football-data/mapper";

const PROVIDER = "football-data";

export const syncCompetitionTeams = async (competitionCode: string, leagueId: number) => {
  const response = await getCompetitionTeams(competitionCode);

  const teams = response.teams.map(mapFootballDataTeam);

  let created = 0;

  let updated = 0;

  for (const team of teams) {
    const existingTeam = await prisma.team.findUnique({
      where: {
        provider_externalId: {
          provider: team.provider,
          externalId: team.externalId,
        },
      },
    });

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

    if (existingTeam) {
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
