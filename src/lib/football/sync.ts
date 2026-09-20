import { syncCompetitionTeams } from "./ingestion/teams";
import { syncCompetitionMatches } from "./ingestion/matches";

export const syncFootballData = async (competitionCode: string, leagueId: number) => {
  const startedAt = new Date();

  console.log(`[football-sync] Starting ${competitionCode} sync...`);

  try {
    console.log("[football-sync] Syncing teams...");

    const teams = await syncCompetitionTeams(competitionCode, leagueId);

    console.log("[football-sync] Teams complete:", teams);
    console.log("[football-sync] Syncing Matches");

    const matches = await syncCompetitionMatches(competitionCode);

    console.log("[football-sync] Matches complete:", matches);

    const finishedAt = new Date();

    return {
      success: true,
      competitionCode,
      teams,
      matches,
      startedAt,
      finishedAt,
      durationMs: finishedAt.getTime() - startedAt.getTime(),
    };
  } catch (error) {
    console.error("[football-sync] Sync failed:", error);

    throw error;
  }
};
