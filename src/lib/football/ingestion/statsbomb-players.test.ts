import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    team: {
      findUnique: vi.fn(),
    },
    player: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock("../statsbomb/client", () => ({
  getStatsBombMatchEvents: vi.fn(),
}));

import { prisma } from "@/lib/db/prisma";
import { getStatsBombMatchEvents } from "../statsbomb/client";
import { syncStatsBombPlayers } from "./statsbomb-players";

describe("syncStatsBombPlayers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a player from a starting lineup", async () => {
    vi.mocked(getStatsBombMatchEvents).mockResolvedValue([
      {
        id: "starting-xi-1",
        index: 1,
        period: 1,
        timestamp: "00:00:00.000",
        minute: 0,
        type: { id: 35, name: "Starting XI" },
        team: { id: 904, name: "Bayer Leverkusen" },
        tactics: {
          formation: 4231,
          lineup: [
            {
              player: {
                id: 11391,
                name: "Borja Iglesias Quintas",
              },
              position: {
                id: 24,
                name: "Left Center Forward",
              },
              jersey_number: 9,
            },
          ],
        },
      },
    ] as never);

    vi.mocked(prisma.team.findUnique).mockResolvedValue({
      id: 202,
    } as never);

    vi.mocked(prisma.player.upsert).mockResolvedValue({
      id: 501,
    } as never);

    const result = await syncStatsBombPlayers(3895292);

    expect(prisma.player.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          provider_externalId: {
            provider: "statsbomb",
            externalId: 11391,
          },
        },
        create: expect.objectContaining({
          provider: "statsbomb",
          externalId: 11391,
          name: "Borja Iglesias Quintas",
          position: "Left Center Forward",
          teamId: 202,
        }),
      })
    );

    expect(result).toEqual(
      expect.objectContaining({
        playersProcessed: 1,
      })
    );
  });
});
