import { prisma } from "@/lib/db/prisma";
import { TeamPerformance } from "@/types/analytics";
import {
  calculatePerformanceSplit,
  MatchPerformance,
} from "@/lib/analytics/calculations/performance";

export async function getTeamPerformance(
  teamId: number,
  seasonId: number
): Promise<TeamPerformance | null> {
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

    orderBy: {
      playedAt: "asc",
    },
  });

  const performances: MatchPerformance[] = matches.flatMap((match) => {
    if (match.homeScore === null || match.awayScore === null) {
      return [];
    }

    const isHome = match.homeTeamId === teamId;

    return [
      {
        venue: isHome ? "HOME" : "AWAY",
        goalsFor: isHome ? match.homeScore : match.awayScore,
        goalsAgainst: isHome ? match.awayScore : match.homeScore,
      },
    ];
  });

  const homeMatches = performances.filter((match) => match.venue === "HOME");

  const awayMatches = performances.filter((match) => match.venue === "AWAY");

  return {
    teamId: team.id,
    team: team.name,

    overall: calculatePerformanceSplit(performances),
    home: calculatePerformanceSplit(homeMatches),
    away: calculatePerformanceSplit(awayMatches),
  };
}
