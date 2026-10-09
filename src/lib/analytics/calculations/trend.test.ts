import { describe, expect, it } from "vitest";

import { calculateRollingPPG } from "./trend";

describe("calculateRollingPPG", () => {
  it("calculates rolling points per game", () => {
    const result = calculateRollingPPG([
      { result: "W" },
      { result: "W" },
      { result: "D" },
      { result: "L" },
      { result: "W" },
    ]);

    expect(result).toEqual([3, 3, 2.33, 1.75, 2]);
  });

  it("returns an empty array for no matches", () => {
    expect(calculateRollingPPG([])).toEqual([]);
  });
});
