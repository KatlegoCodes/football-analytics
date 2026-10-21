const STATS_BOMB_BASE_URL = "https://raw.githubusercontent.com/StatsBomb/open-data/master/data";

export const getStatsBombMatchEvents = async (matchExternalId: number) => {
  const response = await fetch(`${STATS_BOMB_BASE_URL}/events/${matchExternalId}.json`);

  if (!response.ok) {
    throw new Error(`StatsBomb event request failed: ${response.status} ${response.statusText}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(`Invalid StatsBomb events for match ${matchExternalId}`);
  }

  return data;
};
