import { describe, expect, it } from "vitest";
import mapStatsBombEvent, { type StatsBombEvent } from "./mapper";

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
      passOutcome: null,
      passType: null,
      passRecipientId: null,
      passAssistedShotId: null,
      duelType: null,
      duelOutcome: null,
      foulCard: null,
      substitutionReplacementId: null,
      substitutionReplacementName: null,
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
    expect(result.passOutcome).toBeNull();
    expect(result.duelType).toBeNull();
    expect(result.foulCard).toBeNull();
    expect(result.substitutionReplacementId).toBeNull();
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

  it("maps pass analytics fields", () => {
    const event: StatsBombEvent = {
      id: "pass-event",
      index: 10,
      period: 1,
      timestamp: "00:01:00.000",
      minute: 1,
      type: { id: 30, name: "Pass" },
      pass: {
        outcome: { name: "Incomplete" },
        type: { name: "Corner" },
        recipient: { id: 11391 },
        assisted_shot_id: "shot-event-uuid",
      },
    };

    const result = mapStatsBombEvent(event);

    expect(result.passOutcome).toBe("Incomplete");
    expect(result.passType).toBe("Corner");
    expect(result.passRecipientId).toBe(11391);
    expect(result.passAssistedShotId).toBe("shot-event-uuid");
  });

  it("maps duel analytics fields", () => {
    const event: StatsBombEvent = {
      id: "duel-event",
      index: 11,
      period: 1,
      timestamp: "00:01:10.000",
      minute: 1,
      type: { id: 4, name: "Duel" },
      duel: {
        type: { name: "Tackle" },
        outcome: { name: "Won" },
      },
    };

    const result = mapStatsBombEvent(event);

    expect(result.duelType).toBe("Tackle");
    expect(result.duelOutcome).toBe("Won");
  });

  it("maps cards from foul events", () => {
    const event: StatsBombEvent = {
      id: "foul-event",
      index: 12,
      period: 1,
      timestamp: "00:01:20.000",
      minute: 1,
      type: { id: 22, name: "Foul Committed" },
      foul_committed: {
        card: { name: "Yellow Card" },
      },
    };

    const result = mapStatsBombEvent(event);

    expect(result.foulCard).toBe("Yellow Card");
  });

  it("maps substitution replacement details", () => {
    const event: StatsBombEvent = {
      id: "substitution-event",
      index: 13,
      period: 2,
      timestamp: "00:50:00.000",
      minute: 50,
      type: { id: 19, name: "Substitution" },
      substitution: {
        replacement: {
          id: 12345,
          name: "Replacement Player",
        },
      },
    };

    const result = mapStatsBombEvent(event);

    expect(result.substitutionReplacementId).toBe(12345);
    expect(result.substitutionReplacementName).toBe("Replacement Player");
  });
});
