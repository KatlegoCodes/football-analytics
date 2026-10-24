import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    league: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    season: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
    team: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
    match: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock("../statsbomb/matches-client", () => ({
  getStatsBombMatches: vi.fn(),
}));

import { prisma } from "@/lib/db/prisma";
import { getStatsBombMatches } from "../statsbomb/matches-client";
import { syncStatsBombMatches } from "./statsbomb-matches";

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

describe("syncStatsBombMatches", () => {
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

    vi.mocked(prisma.season.findUnique).mockResolvedValue({
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

    vi.mocked(prisma.team.findUnique)
      .mockResolvedValueOnce({
        id: 101,
        externalId: 28,
        provider: "statsbomb",
        name: "Union Berlin",
        shortName: null,
        code: null,
        crestUrl: null,
        leagueId: 1,
        createdAt: new Date(),
      })
      .mockResolvedValueOnce({
        id: 202,
        externalId: 904,
        provider: "statsbomb",
        name: "Bayer Leverkusen",
        shortName: null,
        code: null,
        crestUrl: null,
        leagueId: 1,
        createdAt: new Date(),
      });

    vi.mocked(prisma.match.findUnique).mockResolvedValue(null);

    vi.mocked(prisma.match.upsert).mockResolvedValue({
      id: 501,
      externalId: 3895292,
      provider: "statsbomb",
      homeTeamId: 101,
      awayTeamId: 202,
      homeScore: 0,
      awayScore: 1,
      playedAt: new Date("2024-04-06T13:30:00.000Z"),
      status: "available",
      matchday: 28,
      seasonId: 10,
      createdAt: new Date(),
    });
  });

  it("links a match to its StatsBomb teams and season", async () => {
    const result = await syncStatsBombMatches(9, 281);

    expect(prisma.match.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          provider_externalId: {
            provider: "statsbomb",
            externalId: 3895292,
          },
        },
        create: expect.objectContaining({
          homeTeamId: 101,
          awayTeamId: 202,
          seasonId: 10,
          homeScore: 0,
          awayScore: 1,
        }),
      })
    );

    expect(result).toMatchObject({
      matchesProcessed: 1,
      matchesCreated: 1,
      matchesUpdated: 0,
    });
  });
});
