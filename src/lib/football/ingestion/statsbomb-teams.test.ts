import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    league: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    season: {
      upsert: vi.fn(),
    },
    team: {
      upsert: vi.fn(),
    },
  },
}));

vi.mock("../statsbomb/matches-client", () => ({
  getStatsBombMatches: vi.fn(),
}));

import { prisma } from "@/lib/db/prisma";
import { getStatsBombMatches } from "../statsbomb/matches-client";
import { syncStatsBombTeamsAndSeason } from "./statsbomb-teams";

const sampleMatch = {
  match_id: 3895292,
  match_date: "2024-04-06",
  kick_off: "15:30:00",
  home_score: 0,
  away_score: 1,
  match_status: "available",
  match_week: 28,
  home_team: {
    home_team_id: 28,
    home_team_name: "Union Berlin",
  },
  away_team: {
    away_team_id: 904,
    away_team_name: "Bayer Leverkusen",
  },
  competition: {
    competition_id: 9,
    competition_name: "Bundesliga",
  },
  season: {
    season_id: 281,
    season_name: "2023/2024",
  },
};

describe("syncStatsBombTeamsAndSeason", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getStatsBombMatches).mockResolvedValue([sampleMatch]);

    vi.mocked(prisma.league.findFirst).mockResolvedValue({
      id: 1,
      name: "Bundesliga",
      country: "Germany",
      createdAt: new Date(),
    });

    vi.mocked(prisma.season.upsert).mockResolvedValue({
      id: 10,
      externalId: 281,
      provider: "statsbomb",
      name: "2023/2024",
      startYear: 2023,
      endYear: 2024,
      createdAt: new Date(),
    });

    vi.mocked(prisma.team.upsert).mockResolvedValue({
      id: 1,
      externalId: 28,
      provider: "statsbomb",
      name: "Union Berlin",
      shortName: null,
      code: null,
      crestUrl: null,
      leagueId: 1,
      createdAt: new Date(),
    });
  });

  it("imports unique teams and creates/reuses the season", async () => {
    const result = await syncStatsBombTeamsAndSeason(9, 281);

    expect(getStatsBombMatches).toHaveBeenCalledWith(9, 281);
    expect(prisma.season.upsert).toHaveBeenCalledOnce();
    expect(prisma.team.upsert).toHaveBeenCalledTimes(2);

    expect(result).toMatchObject({
      competition: "Bundesliga",
      season: "2023/2024",
      teamsProcessed: 2,
      matchesDiscovered: 1,
      leagueId: 1,
      seasonId: 10,
    });
  });

  it("rejects an empty match list", async () => {
    vi.mocked(getStatsBombMatches).mockResolvedValue([]);

    await expect(syncStatsBombTeamsAndSeason(9, 281)).rejects.toThrow("No StatsBomb matches found");

    expect(prisma.team.upsert).not.toHaveBeenCalled();
  });
});
