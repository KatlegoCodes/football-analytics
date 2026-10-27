import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  syncStatsBombMatchesMock,
  syncStatsBombPlayersMock,
  syncStatsBombMatchEventsMock,
  callOrder,
} = vi.hoisted(() => ({
  syncStatsBombMatchesMock: vi.fn(),
  syncStatsBombPlayersMock: vi.fn(),
  syncStatsBombMatchEventsMock: vi.fn(),
  callOrder: [] as string[],
}));

vi.mock("./statsbomb-matches", () => ({
  syncStatsBombMatches: syncStatsBombMatchesMock,
}));

vi.mock("./statsbomb-players", () => ({
  syncStatsBombPlayers: syncStatsBombPlayersMock,
}));

vi.mock("./match-events", () => ({
  syncStatsBombMatchEvents: syncStatsBombMatchEventsMock,
}));

import { syncStatsBombPipeline } from "./statsbomb-pipeline";
import { syncStatsBombMatches } from "./statsbomb-matches";
import { syncStatsBombPlayers } from "./statsbomb-players";
import { syncStatsBombMatchEvents } from "./match-events";

describe("syncStatsBombPipeline", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    callOrder.length = 0;
  });

  it("runs matches, players, and events in order", async () => {
    syncStatsBombMatchesMock.mockImplementation(async () => {
      callOrder.push("matches");
      return { matchesProcessed: 1 };
    });

    syncStatsBombPlayersMock.mockImplementation(async () => {
      callOrder.push("players");
      return { playersProcessed: 22 };
    });

    syncStatsBombMatchEventsMock.mockImplementation(async () => {
      callOrder.push("events");
      return { received: 1500 };
    });

    const result = await syncStatsBombPipeline({
      competitionId: 9,
      seasonId: 281,
      matchExternalId: 3895292,
    });

    expect(syncStatsBombMatches).toHaveBeenCalledWith(9, 281);
    expect(syncStatsBombPlayers).toHaveBeenCalledWith(3895292);
    expect(syncStatsBombMatchEvents).toHaveBeenCalledWith(3895292);

    expect(callOrder).toEqual(["matches", "players", "events"]);

    expect(result).toEqual({
      competitionId: 9,
      seasonId: 281,
      matchExternalId: 3895292,
      matches: { matchesProcessed: 1 },
      players: { playersProcessed: 22 },
      events: { received: 1500 },
    });
  });

  it("stops if match ingestion fails", async () => {
    syncStatsBombMatchesMock.mockRejectedValue(new Error("Match ingestion failed"));

    await expect(
      syncStatsBombPipeline({
        competitionId: 9,
        seasonId: 281,
        matchExternalId: 3895292,
      })
    ).rejects.toThrow("Match ingestion failed");

    expect(syncStatsBombPlayers).not.toHaveBeenCalled();
    expect(syncStatsBombMatchEvents).not.toHaveBeenCalled();
  });
});
