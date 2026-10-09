import type { MatchResult } from "@/types/analytics";

export type TrendResult = {
  result: MatchResult;
};

export const calculateRollingPPG = (matches: TrendResult[]): number[] => {
  let points = 0;

  return matches.map((match, index) => {
    if (match.result === "W") {
      points += 3;
    } else if (match.result === "D") {
      points += 1;
    }

    return Number((points / (index + 1)).toFixed(2));
  });
};
