import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { getStatsBombMatchEvents } from "../statsbomb/client";
import { syncStatsBombMatchEvents } from "./match-events";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    match: { findUnique: vi.fn() },
    team: { findMany: vi.fn() },
    player: { findMany: vi.fn() },
    matchEvent: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock("../statsbomb/client", () => ({
  getStatsBombMatchEvents: vi.fn(),
}));

describe("syncStatsBombMatchEvents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a shot event with its analytics and database relationships", async () => {
    vi.mocked(prisma.match.findUnique).mockResolvedValue({
      id: 42,
    } as never);

    vi.mocked(getStatsBombMatchEvents).mockResolvedValue([
      {
        id: "shot-event-1",
        index: 140,
        period: 1,
        timestamp: "00:02:13.090",
        minute: 2,
        type: { id: 16, name: "Shot" },
        team: { id: 904, name: "Bayer Leverkusen" },
        player: { id: 11391, name: "Borja Iglesias Quintas" },
        location: [107, 53.4],
        shot: {
          statsbomb_xg: 0.084877156,
          outcome: { id: 98, name: "Off T" },
          body_part: { id: 40, name: "Right Foot" },
          technique: { id: 91, name: "Half Volley" },
        },
      },
    ]);

    vi.mocked(prisma.team.findMany).mockResolvedValue([{ id: 7, externalId: 904 }] as never);

    vi.mocked(prisma.player.findMany).mockResolvedValue([{ id: 8, externalId: 11391 }] as never);

    vi.mocked(prisma.matchEvent.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.matchEvent.upsert).mockResolvedValue({} as never);

    const result = await syncStatsBombMatchEvents(3895292);

    expect(result).toEqual({
      provider: "statsbomb",
      matchExternalId: 3895292,
      received: 1,
      created: 1,
      updated: 0,
    });

    expect(prisma.matchEvent.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          provider_externalId: {
            provider: "statsbomb",
            externalId: "shot-event-1",
          },
        },
        create: expect.objectContaining({
          provider: "statsbomb",
          externalId: "shot-event-1",
          matchId: 42,
          type: "Shot",
          minute: 2,
          locationX: 107,
          locationY: 53.4,
          shotOutcome: "Off T",
          shotXg: 0.084877156,
          shotBodyPart: "Right Foot",
          shotTechnique: "Half Volley",
          teamId: 7,
          playerId: 8,
        }),
      })
    );
  });

  it("throws when the match has not been imported", async () => {
    vi.mocked(prisma.match.findUnique).mockResolvedValue(null);

    await expect(syncStatsBombMatchEvents(3895292)).rejects.toThrow(
      "StatsBomb match 3895292 is not in the database"
    );

    expect(getStatsBombMatchEvents).not.toHaveBeenCalled();
    expect(prisma.matchEvent.upsert).not.toHaveBeenCalled();
  });

  it("throws when an event references a team that has not been imported", async () => {
    vi.mocked(prisma.match.findUnique).mockResolvedValue({
      id: 42,
    } as never);

    vi.mocked(getStatsBombMatchEvents).mockResolvedValue([
      {
        id: "shot-event-1",
        index: 140,
        period: 1,
        timestamp: "00:02:13.090",
        minute: 2,
        type: { id: 16, name: "Shot" },
        team: { id: 904, name: "Bayer Leverkusen" },
        player: null,
        location: [107, 53.4],
      },
    ]);

    vi.mocked(prisma.team.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.player.findMany).mockResolvedValue([] as never);

    await expect(syncStatsBombMatchEvents(3895292)).rejects.toThrow(
      "Missing StatsBomb team 904. Import the team first."
    );

    expect(prisma.matchEvent.upsert).not.toHaveBeenCalled();
  });
});
