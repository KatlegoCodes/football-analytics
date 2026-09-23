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

  const teamExternalIds = [
    ...new Set(matches.flatMap((match) => [match.homeTeamExternalId, match.awayTeamExternalId])),
  ];

  const teams = await prisma.team.findMany({
    where: {
      provider: PROVIDER,
      externalId: {
        in: teamExternalIds,
      },
    },
    select: {
      id: true,
      externalId: true,
    },
  });

  const teamIdByExternalId = new Map(
    teams
      .filter((team): team is typeof team & { externalId: number } => team.externalId !== null)
      .map((team) => [team.externalId, team.id])
  );

  const matchExternalIds = matches.map((match) => match.externalId);
  const existingMatches = await prisma.match.findMany({
    where: {
      provider: PROVIDER,
      externalId: {
        in: matchExternalIds,
      },
    },
    select: {
      externalId: true,
    },
  });

  const existingMatchIds = new Set(
    existingMatches.map((match) => match.externalId).filter((id): id is number => id !== null)
  );

  let created = 0;
  let updated = 0;

  for (const match of matches) {
    const homeTeamId = teamIdByExternalId.get(match.homeTeamExternalId);
    const awayTeamId = teamIdByExternalId.get(match.awayTeamExternalId);

    if (!homeTeamId || !awayTeamId) {
      throw new Error(`Could not resolve teams for external match ${match.externalId}`);
    }

    await prisma.match.upsert({
      where: {
        provider_externalId: {
          provider: PROVIDER,
          externalId: match.externalId,
        },
      },
      update: {
        homeTeamId,
        awayTeamId,
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
        homeTeamId,
        awayTeamId,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        playedAt: match.playedAt,
        status: match.status,
        matchday: match.matchday,
        seasonId: season.id,
      },
    });

    if (existingMatchIds.has(match.externalId)) {
      updated++;
    } else {
      created++;
    }
  }

  return {
    competition: response.competition.name,
    season: season.name,
    recieved: matches.length,
    created,
    updated,
  };
};
