import { syncStatsBombMatches } from "./statsbomb-matches";
import { syncStatsBombPlayers } from "./statsbomb-players";
import { syncStatsBombMatchEvents } from "./match-events";

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
  const matchResult = await syncStatsBombMatches(competitionId, seasonId);

  const playerResult = await syncStatsBombPlayers(matchExternalId);

  const eventResult = await syncStatsBombMatchEvents(matchExternalId);

  return {
    competitionId,
    seasonId,
    matchExternalId,
    matches: matchResult,
    players: playerResult,
    events: eventResult,
  };
};
