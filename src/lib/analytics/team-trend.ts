import { prisma } from "@/lib/db/prisma";
import { TeamPerformanceTrendPoint, TeamPerformanceTrend, MatchResult } from "@/types/analytics";

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

  let rollingPoints = 0;
  let validMatches = 0;

  const trendMatches: TeamPerformanceTrendPoint[] = matches.flatMap((match, index) => {
    if (match.homeScore === null || match.awayScore === null) {
      return [];
    }

    const isHome = match.homeTeamId === teamId;

    const goalsFor = isHome ? match.homeScore : match.awayScore;
    const goalsAgainst = isHome ? match.awayScore : match.homeScore;

    let result: MatchResult;
    let points: number;

    if (goalsFor > goalsAgainst) {
      result = "W";
      points = 3;
    } else if (goalsFor < goalsAgainst) {
      result = "L";
      points = 0;
    } else {
      result = "D";
      points = 1;
    }

    rollingPoints += points;
    validMatches++;

    const opponent = isHome ? match.awayTeam : match.homeTeam;

    return [
      {
        matchId: match.id,
        opponent: opponent.shortName ?? opponent.name,
        playedAt: match.playedAt,

        result,
        points,

        rollingPoints,

        rollingPointsPerGame: Number((rollingPoints / validMatches).toFixed(2)),
      },
    ];
  });

  return {
    teamId: team.id,
    team: team.name,
    matches: trendMatches,
  };
};
