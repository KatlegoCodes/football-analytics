import { syncStatsBombMatches } from "./statsbomb-matches";
import { syncStatsBombPlayers } from "./statsbomb-players";
import { syncStatsBombMatchEvents } from "./match-events";
import { syncStatsBombPlayerMatchStats } from "./player-match-stats";

type StatsBombPipelineOptions = {
  competitionId: number;
  seasonId: number;
  matchExternalId: number;
};

export const syncStatsBombPipeline = async ({
  competitionId,
  seasonId,
  matchExternalId,
}: StatsBombPipelineOptions) => {
  const matchesResult = await syncStatsBombMatches(competitionId, seasonId);

  const playersResult = await syncStatsBombPlayers(matchExternalId);

  const eventsResult = await syncStatsBombMatchEvents(matchExternalId);

  const playerStatsResult = await syncStatsBombPlayerMatchStats(matchExternalId);

  return {
    competitionId,
    seasonId,
    matchExternalId,
    matches: matchesResult,
    players: playersResult,
    events: eventsResult,
    playerStats: playerStatsResult,
  };
};
