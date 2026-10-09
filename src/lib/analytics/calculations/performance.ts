import type { PerformanceSplit } from "@/types/analytics";

export type MatchPerformance = {
  venue: "HOME" | "AWAY";
  goalsFor: number;
  goalsAgainst: number;
};

export function calculatePerformanceSplit(matches: MatchPerformance[]): PerformanceSplit {
  const played = matches.length;

  let wins = 0;
  let draws = 0;
  let losses = 0;

  let goalsFor = 0;
  let goalsAgainst = 0;

  let cleanSheets = 0;
  let failedToScore = 0;

  for (const match of matches) {
    goalsFor += match.goalsFor;
    goalsAgainst += match.goalsAgainst;

    if (match.goalsFor > match.goalsAgainst) {
      wins++;
    } else if (match.goalsFor < match.goalsAgainst) {
      losses++;
    } else {
      draws++;
    }

    if (match.goalsAgainst === 0) {
      cleanSheets++;
    }

    if (match.goalsFor === 0) {
      failedToScore++;
    }
  }

  const points = wins * 3 + draws;

  return {
    played,
    wins,
    draws,
    losses,

    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,

    points,

    pointsPerGame: played === 0 ? 0 : Number((points / played).toFixed(2)),

    goalsPerGame: played === 0 ? 0 : Number((goalsFor / played).toFixed(2)),

    goalsAgainstPerGame: played === 0 ? 0 : Number((goalsAgainst / played).toFixed(2)),

    cleanSheets,
    failedToScore,
  };
}
