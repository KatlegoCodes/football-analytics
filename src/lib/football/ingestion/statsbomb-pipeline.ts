import { prisma } from "@/lib/db/prisma";
import { syncStatsBombMatches } from "./statsbomb-matches";
import { syncStatsBombPlayers } from "./statsbomb-players";
import { syncStatsBombMatchEvents } from "./match-events";
import { syncStatsBombPlayerMatchStats } from "./player-match-stats";

const PROVIDER = "statsbomb";

type StatsBombPipelineOptions = {
  competitionId: number;
  seasonId: number;
  matchExternalId?: number;
};

export const syncStatsBombPipeline = async ({
  competitionId,
  seasonId,
  matchExternalId,
}: StatsBombPipelineOptions) => {
  // Stage 1: Import all matches for the competition season.
  const matchesResult = await syncStatsBombMatches(competitionId, seasonId);

  const season = await prisma.season.findUnique({
    where: {
      provider_externalId: {
        provider: PROVIDER,
        externalId: seasonId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!season) {
    throw new Error(`StatsBomb season ${seasonId} was not found`);
  }

  // Stage 2: Retrieve all matches belonging to this season.
  const seasonMatches = await prisma.match.findMany({
    where: {
      provider: PROVIDER,
      seasonId: season.id,
      externalId: {
        not: null,
      },
    },
    select: {
      externalId: true,
    },
    orderBy: {
      playedAt: "asc",
    },
  });

  const allMatchIds = seasonMatches.flatMap((match) =>
    match.externalId === null ? [] : [match.externalId]
  );

  // Allow an individual match to be synced when requested.
  const matchIds =
    matchExternalId !== undefined
      ? allMatchIds.includes(matchExternalId)
        ? [matchExternalId]
        : []
      : allMatchIds;

  if (matchIds.length === 0) {
    throw new Error(
      matchExternalId !== undefined
        ? `Match ${matchExternalId} was not found in season ${seasonId}`
        : `No StatsBomb matches found for season ${seasonId}`
    );
  }

  // Stage 3: Process each match sequentially.
  const matchResults = [];

  for (const [index, externalId] of matchIds.entries()) {
    console.log(`\nProcessing match ${index + 1}/${matchIds.length}: ${externalId}`);

    const playersResult = await syncStatsBombPlayers(externalId);

    const eventsResult = await syncStatsBombMatchEvents(externalId);

    const playerStatsResult = await syncStatsBombPlayerMatchStats(externalId);

    matchResults.push({
      matchExternalId: externalId,
      players: playersResult,
      events: eventsResult,
      playerStats: playerStatsResult,
    });

    console.log(`Completed match ${index + 1}/${matchIds.length}`);
  }

  return {
    competitionId,
    seasonId,
    matches: matchesResult,
    processedMatchCount: matchResults.length,
    matchResults,
  };
};
