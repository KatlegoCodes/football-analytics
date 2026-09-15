import type { FootballDataTeamsResponse, FootballDataMatchesResponse } from "./types";

const BASE_URL = "https://api.football-data.org/v4";

const getApiKey = () => {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    throw new Error("FOOTBALL_DATA_API_KEY is not defined");
  }

  return apiKey;
};

export const getCompetitionTeams = async (
  competitionCode: string
): Promise<FootballDataTeamsResponse> => {
  const response = await fetch(`${BASE_URL}/competitions/${competitionCode}/teams`, {
    headers: {
      "X-Auth-Token": getApiKey(),
    },
  });

  if (!response.ok) {
    throw new Error(`Football data API request failed: ${response.status} ${response.statusText} `);
  }

  return response.json();
};

export const getCompetitionMatches = async (
  competitionCode: string
): Promise<FootballDataMatchesResponse> => {
  const response = await fetch(`${BASE_URL}/competitions/${competitionCode}/matches`, {
    headers: {
      "X-Auth-Token": getApiKey(),
    },
  });

  if (!response.ok) {
    throw new Error(`Football Data API request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
};
