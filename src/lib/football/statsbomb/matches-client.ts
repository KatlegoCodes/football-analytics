const STATS_BOMB_BASE_URL = "https://raw.githubusercontent.com/StatsBomb/open-data/master/data";

export const getStatsBombMatches = async (competitionId: number, seasonId: number) => {
  const response = await fetch(`${STATS_BOMB_BASE_URL}/matches/${competitionId}/${seasonId}.json`);

  if (!response.ok) {
    throw new Error(`StatsBomb matches request failed: ${response.status} ${response.statusText}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(
      `Invalid StatsBomb matches response for competition ${competitionId}, season ${seasonId}`
    );
  }

  return data;
};
