import type { PlayerPerformanceSummary } from "@/types/analytics";

export type PlayerMatchPerformanceInput = {
  minutesPlayed: number | null;
  goals: number;
  assists: number;
  shots: number;
  shotsOnTarget: number;
  passes: number;
  tackles: number;
  interceptions: number;
  yellowCards: number;
  redCards: number;
};

export const calculatePlayerPerformance = (
  playerId: number,
  stats: PlayerMatchPerformanceInput[]
): PlayerPerformanceSummary => {
  const appearances = stats.length;

  const sum = (getValue: (stat: PlayerMatchPerformanceInput) => number) =>
    stats.reduce((total, stat) => total + getValue(stat), 0);

  const minutesPlayed = sum((stat) => stat.minutesPlayed ?? 0);
  const goals = sum((stat) => stat.goals);
  const assists = sum((stat) => stat.assists);
  const shots = sum((stat) => stat.shots);
  const shotsOnTarget = sum((stat) => stat.shotsOnTarget);
  const passesAttempted = sum((stat) => stat.passes);
  const tackles = sum((stat) => stat.tackles);
  const interceptions = sum((stat) => stat.interceptions);
  const yellowCards = sum((stat) => stat.yellowCards);
  const redCards = sum((stat) => stat.redCards);

  const per90 = (value: number): number =>
    minutesPlayed === 0 ? 0 : Number(((value / minutesPlayed) * 90).toFixed(2));

  return {
    playerId,
    appearances,
    starts: 0,
    minutesPlayed,
    goals,
    assists,
    shots,
    shotsOnTarget,
    passesCompleted: 0,
    passesAttempted,
    passAccuracy: null,
    tackles,
    interceptions,
    yellowCards,
    redCards,
    goalsPer90: per90(goals),
    assistsPer90: per90(assists),
    goalContributionsPer90: per90(goals + assists),
  };
};
