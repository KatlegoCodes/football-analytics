import { describe, expect, it } from "vitest";

import { calculatePlayerXg } from "./player-xg";

describe("calculatePlayerXg", () => {
  it("sums expected goals from a player's shots", () => {
    const result = calculatePlayerXg([
      { type: "Shot", shotXg: 0.2 },
      { type: "Shot", shotXg: 0.35 },
      { type: "Pass", shotXg: null },
    ]);

    expect(result).toBe(0.55);
  });

  it("ignores events without an xG value", () => {
    const result = calculatePlayerXg([
      { type: "Shot", shotXg: null },
      { type: "Shot", shotXg: 0.15 },
    ]);

    expect(result).toBe(0.15);
  });

  it("returns zero when there are no shots", () => {
    expect(calculatePlayerXg([])).toBe(0);
  });

  it("preserves a valid xG value of zero", () => {
    expect(calculatePlayerXg([{ type: "Shot", shotXg: 0 }])).toBe(0);
  });
});
