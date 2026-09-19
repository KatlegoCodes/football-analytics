import { prisma } from "@/lib/db/prisma";
import { getCompetitionMatches } from "../football-data/client";
import { mapFootballDataMatch } from "../football-data/mapper";

const PROVIDER = "football-data";

export const syncCompetitionMatches = async (competitionCode: string) => {
  const response = await getCompetitionMatches(competitionCode);
  const matches = response.matches.map(mapFootballDataMatch);

  const seasonExternalsIds = [...new Set(matches.map((match) => match.seasonExternalId))];

  if (seasonExternalsIds.length !== 1) {
    throw new Error(`Expected One season but recieved ${seasonExternalsIds.length}`);
  }

  const seasonExternalId = seasonExternalsIds[0];

  const firstMatch = response.matches[0];

  if (!firstMatch) {
    return {
      competition: response.competition.name,
      recieved: 0,
      created: 0,
      updated: 0,
    };
  }

  const startYear = new Date(firstMatch.season.startDate).getUTCFullYear();
  const endYear = new Date(firstMatch.season.endDate).getUTCFullYear();

  const season = await prisma.season.upsert({
    where: {
      provider_externalId: {
        provider: PROVIDER,
        externalId: seasonExternalId,
      },
    },

    update: {
      name: `${startYear}/${String(endYear).slice(-2)}`,
      startYear,
      endYear,
    },
    create: {
      provider: PROVIDER,
      externalId: seasonExternalId,
      name: `${startYear}/${String(endYear).slice(-2)}`,
      startYear,
      endYear,
    },
  });

  let created = 0;
  let updated = 0;

  for (const match of matches) {
    const [homeTeam, awayTeam] = await Promise.all([
      prisma.team.findUnique({
        where: {
          provider_externalId: {
            provider: PROVIDER,
            externalId: match.homeTeamExternalId,
          },
        },
      }),

      prisma.team.findUnique({
        where: {
          provider_externalId: {
            provider: PROVIDER,
            externalId: match.awayTeamExternalId,
          },
        },
      }),
    ]);

    if (!homeTeam || !awayTeam) {
      throw new Error(`Could not resolve teams for external match ${match.externalId}`);
    }

    const existingMatch = await prisma.match.findUnique({
      where: {
        provider_externalId: {
          provider: PROVIDER,
          externalId: match.externalId,
        },
      },
    });

    await prisma.match.upsert({
      where: {
        provider_externalId: {
          provider: PROVIDER,
          externalId: match.externalId,
        },
      },

      update: {
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        playedAt: match.playedAt,
        status: match.status,
        matchday: match.matchday,
        seasonId: season.id,
      },

      create: {
        provider: PROVIDER,
        externalId: match.externalId,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        playedAt: match.playedAt,
        status: match.status,
        matchday: match.matchday,
        seasonId: season.id,
      },
    });

    existingMatch ? updated++ : created++;
  }

  return {
    competition: response.competition.name,
    season: season.name,
    recieved: matches.length,
    created,
    updated,
  };
};
