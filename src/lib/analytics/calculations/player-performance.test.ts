import { describe, expect, it } from "vitest";

import { calculatePlayerPerformance } from "./player-performance";

describe("calculatePlayerPerformance", () => {
  it("calculates player totals and per-90 statistics", () => {
    const result = calculatePlayerPerformance(7, [
      {
        minutesPlayed: 90,
        goals: 1,
        assists: 1,
        shots: 3,
        shotsOnTarget: 2,
        passes: 40,
        tackles: 2,
        interceptions: 1,
        yellowCards: 0,
        redCards: 0,
      },
      {
        minutesPlayed: 90,
        goals: 1,
        assists: 0,
        shots: 2,
        shotsOnTarget: 1,
        passes: 35,
        tackles: 3,
        interceptions: 2,
        yellowCards: 1,
        redCards: 0,
      },
    ]);

    expect(result.playerId).toBe(7);
    expect(result.appearances).toBe(2);
    expect(result.minutesPlayed).toBe(180);

    expect(result.goals).toBe(2);
    expect(result.assists).toBe(1);
    expect(result.shots).toBe(5);
    expect(result.shotsOnTarget).toBe(3);

    expect(result.passesAttempted).toBe(75);
    expect(result.tackles).toBe(5);
    expect(result.interceptions).toBe(3);
    expect(result.yellowCards).toBe(1);
    expect(result.redCards).toBe(0);

    expect(result.goalsPer90).toBe(1);
    expect(result.assistsPer90).toBe(0.5);
    expect(result.goalContributionsPer90).toBe(1.5);

    expect(result.passAccuracy).toBeNull();
  });

  it("returns zero totals when no match statistics exist", () => {
    const result = calculatePlayerPerformance(7, []);

    expect(result.appearances).toBe(0);
    expect(result.minutesPlayed).toBe(0);
    expect(result.goals).toBe(0);
    expect(result.assists).toBe(0);
    expect(result.goalsPer90).toBe(0);
    expect(result.assistsPer90).toBe(0);
    expect(result.goalContributionsPer90).toBe(0);
  });

  it("avoids division by zero when minutes are missing", () => {
    const result = calculatePlayerPerformance(7, [
      {
        minutesPlayed: null,
        goals: 1,
        assists: 0,
        shots: 1,
        shotsOnTarget: 1,
        passes: 10,
        tackles: 0,
        interceptions: 0,
        yellowCards: 0,
        redCards: 0,
      },
    ]);

    expect(result.minutesPlayed).toBe(0);
    expect(result.goals).toBe(1);
    expect(result.goalsPer90).toBe(0);
    expect(result.assistsPer90).toBe(0);
    expect(result.goalContributionsPer90).toBe(0);
  });

  it("rounds per-90 statistics to two decimal places", () => {
    const result = calculatePlayerPerformance(7, [
      {
        minutesPlayed: 60,
        goals: 1,
        assists: 0,
        shots: 1,
        shotsOnTarget: 1,
        passes: 10,
        tackles: 0,
        interceptions: 0,
        yellowCards: 0,
        redCards: 0,
      },
    ]);

    expect(result.goalsPer90).toBe(1.5);
    expect(result.goalContributionsPer90).toBe(1.5);
  });
});
