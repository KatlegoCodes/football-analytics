import { prisma } from "@/lib/db/prisma";

const PROVIDER = "statsbomb";

export const getStatsBombArchive = async (seasonId: number) => {
  const season = await prisma.season.findFirst({
    where: {
      id: seasonId,
      provider: PROVIDER,
    },
  });

  if (!season) {
    return null;
  }

  const [matchCount, matches] = await Promise.all([
    prisma.match.count({
      where: {
        seasonId: season.id,
        provider: PROVIDER,
      },
    }),

    prisma.match.findMany({
      where: {
        seasonId: season.id,
        provider: PROVIDER,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: {
        playedAt: "desc",
      },
    }),
  ]);

  return {
    competition: "Bundesliga",
    season: {
      id: season.id,
      name: season.name,
      startYear: season.startYear,
      endYear: season.endYear,
    },
    summary: {
      matches: matchCount,
      completedMatches: matches.filter((match) => match.status === "FINISHED").length,
    },
    matches,
  };
};
