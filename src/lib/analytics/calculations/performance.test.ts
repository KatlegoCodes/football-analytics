import { describe, expect, it } from "vitest";

import { calculatePerformanceSplit } from "./performance";

describe("calculatePerformanceSplit", () => {
  it("calculates football performance correctly", () => {
    const result = calculatePerformanceSplit([
      {
        venue: "HOME",
        goalsFor: 2,
        goalsAgainst: 0,
      },
      {
        venue: "AWAY",
        goalsFor: 1,
        goalsAgainst: 1,
      },
      {
        venue: "HOME",
        goalsFor: 0,
        goalsAgainst: 1,
      },
      {
        venue: "AWAY",
        goalsFor: 3,
        goalsAgainst: 1,
      },
    ]);

    expect(result.played).toBe(4);

    expect(result.wins).toBe(2);
    expect(result.draws).toBe(1);
    expect(result.losses).toBe(1);

    expect(result.goalsFor).toBe(6);
    expect(result.goalsAgainst).toBe(3);
    expect(result.goalDifference).toBe(3);

    expect(result.points).toBe(7);
    expect(result.pointsPerGame).toBe(1.75);

    expect(result.goalsPerGame).toBe(1.5);
    expect(result.goalsAgainstPerGame).toBe(0.75);

    expect(result.cleanSheets).toBe(1);
    expect(result.failedToScore).toBe(1);
  });

  it("returns zero values when no matches exist", () => {
    const result = calculatePerformanceSplit([]);

    expect(result).toEqual({
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,

      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,

      points: 0,
      pointsPerGame: 0,

      goalsPerGame: 0,
      goalsAgainstPerGame: 0,

      cleanSheets: 0,
      failedToScore: 0,
    });
  });

  it("handles a perfect winning record", () => {
    const result = calculatePerformanceSplit([
      {
        venue: "HOME",
        goalsFor: 3,
        goalsAgainst: 0,
      },
      {
        venue: "AWAY",
        goalsFor: 2,
        goalsAgainst: 0,
      },
      {
        venue: "HOME",
        goalsFor: 4,
        goalsAgainst: 0,
      },
    ]);

    expect(result.played).toBe(3);
    expect(result.wins).toBe(3);

    expect(result.points).toBe(9);
    expect(result.pointsPerGame).toBe(3);

    expect(result.goalsFor).toBe(9);
    expect(result.goalsAgainst).toBe(0);

    expect(result.cleanSheets).toBe(3);
    expect(result.failedToScore).toBe(0);
  });
});
