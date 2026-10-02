import { prisma } from "@/lib/db/prisma";

export const getDashboardData = async () => {
  const [teamCount, matchCount, finishedMatchCount, recentMatches, upcomingMatches] =
    await Promise.all([
      prisma.team.count({
        where: {
          provider: "football-data",
        },
      }),

      prisma.match.count({
        where: {
          provider: "football-data",
        },
      }),

      prisma.match.count({
        where: {
          provider: "football-data",
          status: "FINISHED",
        },
      }),

      prisma.match.findMany({
        where: {
          provider: "football-data",
          status: "FINISHED",
        },

        include: {
          homeTeam: true,
          awayTeam: true,
        },

        orderBy: {
          playedAt: "desc",
        },

        take: 5,
      }),

      prisma.match.findMany({
        where: {
          provider: "football-data",
          status: {
            not: "FINISHED",
          },

          playedAt: {
            gte: new Date(),
          },
        },

        include: {
          homeTeam: true,
          awayTeam: true,
        },

        orderBy: {
          playedAt: "asc",
        },

        take: 5,
      }),
    ]);

  const goals = await prisma.match.aggregate({
    where: {
      provider: "football-data",
      status: "FINISHED",
    },

    _sum: {
      homeScore: true,
      awayScore: true,
    },
  });

  const totalGoals = (goals._sum.homeScore ?? 0) + (goals._sum.awayScore ?? 0);

  return {
    summary: {
      teams: teamCount,
      matches: matchCount,
      finishedMatches: finishedMatchCount,
      goals: totalGoals,
    },
    recentMatches,
    upcomingMatches,
  };
};
