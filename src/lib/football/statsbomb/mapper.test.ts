import { describe, expect, it } from "vitest";
import { mapStatsBombEvent, type StatsBombEvent } from "./mapper";

describe("mapStatsBombEvent", () => {
  it("maps shot events and their analytics fields", () => {
    const event: StatsBombEvent = {
      id: "452ac1fc-6e97-459f-8819-62bc82078292",
      index: 140,
      period: 1,
      timestamp: "00:02:13.090",
      minute: 2,
      type: { id: 16, name: "Shot" },
      team: { id: 904, name: "Bayer Leverkusen" },
      player: { id: 11391, name: "Borja Iglesias Quintas" },
      location: [107.0, 53.4],
      shot: {
        statsbomb_xg: 0.084877156,
        outcome: { id: 98, name: "Off T" },
        body_part: { id: 40, name: "Right Foot" },
        technique: { id: 91, name: "Half Volley" },
      },
    };

    expect(mapStatsBombEvent(event)).toEqual({
      provider: "statsbomb",
      externalId: "452ac1fc-6e97-459f-8819-62bc82078292",
      eventIndex: 140,
      period: 1,
      timestamp: "00:02:13.090",
      minute: 2,
      type: "Shot",
      detail: null,
      locationX: 107.0,
      locationY: 53.4,
      shotOutcome: "Off T",
      shotXg: 0.084877156,
      shotBodyPart: "Right Foot",
      shotTechnique: "Half Volley",
      externalTeamId: 904,
      externalPlayerId: 11391,
    });
  });

  it("maps ordinary events without shot data", () => {
    const event: StatsBombEvent = {
      id: "ordinary-event-uuid",
      index: 1,
      period: 1,
      timestamp: "00:00:00.000",
      minute: 0,
      type: { id: 35, name: "Starting XI" },
      team: { id: 904, name: "Bayer Leverkusen" },
    };

    const result = mapStatsBombEvent(event);

    expect(result.type).toBe("Starting XI");
    expect(result.externalTeamId).toBe(904);
    expect(result.externalPlayerId).toBeNull();
    expect(result.locationX).toBeNull();
    expect(result.shotOutcome).toBeNull();
    expect(result.shotXg).toBeNull();
  });

  it("preserves zero values instead of treating them as missing", () => {
    const event: StatsBombEvent = {
      id: "zero-value-event",
      index: 2,
      period: 1,
      timestamp: "00:00:01.000",
      minute: 0,
      type: { id: 16, name: "Shot" },
      location: [0, 0],
      shot: { statsbomb_xg: 0 },
    };

    const result = mapStatsBombEvent(event);

    expect(result.locationX).toBe(0);
    expect(result.locationY).toBe(0);
    expect(result.shotXg).toBe(0);
  });
});
