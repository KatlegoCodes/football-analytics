import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    match: {
      findUnique: vi.fn(),
    },
    matchEvent: {
      findMany: vi.fn(),
    },
    playerMatchStat: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db/prisma";
import { syncStatsBombPlayerMatchStats } from "./player-match-stats";

describe("syncStatsBombPlayerMatchStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("aggregates player statistics from match events", async () => {
    vi.mocked(prisma.match.findUnique).mockResolvedValue({
      id: 381,
    } as never);

    vi.mocked(prisma.matchEvent.findMany).mockResolvedValue([
      {
        externalId: "goal-shot",
        playerId: 10,
        type: "Shot",
        shotOutcome: "Goal",
        passOutcome: null,
        passAssistedShotId: null,
        duelType: null,
        foulCard: null,
      },
      {
        externalId: "saved-shot",
        playerId: 10,
        type: "Shot",
        shotOutcome: "Saved",
        passOutcome: null,
        passAssistedShotId: null,
        duelType: null,
        foulCard: null,
      },
      {
        externalId: "assist-pass",
        playerId: 10,
        type: "Pass",
        shotOutcome: null,
        passOutcome: null,
        passAssistedShotId: "goal-shot",
        duelType: null,
        foulCard: null,
      },
      {
        externalId: "tackle",
        playerId: 10,
        type: "Duel",
        shotOutcome: null,
        passOutcome: null,
        passAssistedShotId: null,
        duelType: "Tackle",
        foulCard: null,
      },
      {
        externalId: "interception",
        playerId: 10,
        type: "Interception",
        shotOutcome: null,
        passOutcome: null,
        passAssistedShotId: null,
        duelType: null,
        foulCard: null,
      },
      {
        externalId: "incomplete-pass",
        playerId: 10,
        type: "Pass",
        shotOutcome: null,
        passOutcome: "Incomplete",
        passAssistedShotId: null,
        duelType: null,
        foulCard: null,
      },
      {
        externalId: "yellow-card",
        playerId: 10,
        type: "Foul Committed",
        shotOutcome: null,
        passOutcome: null,
        passAssistedShotId: null,
        duelType: null,
        foulCard: "Yellow Card",
      },
    ] as never);

    vi.mocked(prisma.playerMatchStat.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.playerMatchStat.upsert).mockResolvedValue({} as never);

    const result = await syncStatsBombPlayerMatchStats(3895292);

    expect(result).toMatchObject({
      provider: "statsbomb",
      matchExternalId: 3895292,
      eventsProcessed: 7,
      playersProcessed: 1,
      created: 1,
      updated: 0,
    });

    expect(prisma.playerMatchStat.upsert).toHaveBeenCalledWith({
      where: {
        playerId_matchId: {
          playerId: 10,
          matchId: 381,
        },
      },
      create: {
        playerId: 10,
        matchId: 381,
        goals: 1,
        assists: 1,
        shots: 2,
        shotsOnTarget: 2,
        passes: 2,
        passesCompleted: 1,
        keyPasses: 1,
        tackles: 1,
        interceptions: 1,
        yellowCards: 1,
        redCards: 0,
      },
      update: {
        goals: 1,
        assists: 1,
        shots: 2,
        shotsOnTarget: 2,
        passes: 2,
        passesCompleted: 1,
        keyPasses: 1,
        tackles: 1,
        interceptions: 1,
        yellowCards: 1,
        redCards: 0,
      },
    });
  });

  it("counts a second yellow as both yellow and red", async () => {
    vi.mocked(prisma.match.findUnique).mockResolvedValue({
      id: 381,
    } as never);

    vi.mocked(prisma.matchEvent.findMany).mockResolvedValue([
      {
        externalId: "second-yellow",
        playerId: 20,
        type: "Foul Committed",
        shotOutcome: null,
        passOutcome: null,
        passAssistedShotId: null,
        duelType: null,
        foulCard: "Second Yellow",
      },
    ] as never);

    vi.mocked(prisma.playerMatchStat.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.playerMatchStat.upsert).mockResolvedValue({} as never);

    await syncStatsBombPlayerMatchStats(3895292);

    expect(prisma.playerMatchStat.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          yellowCards: 1,
          redCards: 1,
        }),
      })
    );
  });

  it("throws an error when the match does not exist", async () => {
    vi.mocked(prisma.match.findUnique).mockResolvedValue(null);

    await expect(syncStatsBombPlayerMatchStats(999999)).rejects.toThrow(
      "StatsBomb match 999999 was not found"
    );

    expect(prisma.matchEvent.findMany).not.toHaveBeenCalled();
  });
});
