import { prisma } from "@/lib/db/prisma";
import { TeamPerformanceTrend, TeamPerformanceTrendPoint, MatchResult } from "@/types/analytics";
import { calculateRollingPPG } from "./calculations/trend";

export const getTeamPerformanceTrend = async (
  teamId: number,
  seasonId: number,
  limit = 10
): Promise<TeamPerformanceTrend | null> => {
  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    return null;
  }

  const matches = await prisma.match.findMany({
    where: {
      seasonId,
      status: "FINISHED",
      OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
    },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: {
      playedAt: "desc",
    },
    take: limit,
  });

  matches.reverse();

  const rawMatchInputs = matches.flatMap((match) => {
    if (match.homeScore === null || match.awayScore === null) {
      return [];
    }

    const isHome = match.homeTeamId === teamId;
    const goalsFor = isHome ? match.homeScore : match.awayScore;
    const goalsAgainst = isHome ? match.awayScore : match.homeScore;
    const opponent = isHome ? match.awayTeam : match.homeTeam;

    let result: MatchResult = "D";
    if (goalsFor > goalsAgainst) {
      result = "W";
    } else if (goalsFor < goalsAgainst) {
      result = "L";
    }

    return [
      {
        matchId: match.id,
        opponent: opponent.shortName ?? opponent.name,
        playedAt: match.playedAt,
        result,
      },
    ];
  });

  const rollingPPGValues = calculateRollingPPG(rawMatchInputs.map((m) => ({ result: m.result })));

  let rollingPoints = 0;
  const trendMatches: TeamPerformanceTrendPoint[] = rawMatchInputs.map((match, index) => {
    const points = match.result === "W" ? 3 : match.result === "D" ? 1 : 0;
    rollingPoints += points;

    return {
      matchId: match.matchId,
      opponent: match.opponent,
      playedAt: match.playedAt,
      result: match.result,
      points,
      rollingPoints,
      rollingPointsPerGame: rollingPPGValues[index],
    };
  });

  return {
    teamId: team.id,
    team: team.name,
    matches: trendMatches,
  };
};
