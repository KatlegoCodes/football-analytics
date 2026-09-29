import { prisma } from "@/lib/db/prisma";
import type { MatchDetail, MatchOutcome } from "@/types/analytics";

export const getMatchDetail = async (matchId: number): Promise<MatchDetail | null> => {
  const match = await prisma.match.findUnique({
    where: {
      id: matchId,
    },

    include: {
      homeTeam: true,
      awayTeam: true,
      season: true,
    },
  });

  if (!match) {
    return null;
  }

  let outcome: MatchOutcome = null;

  if (match.status === "FINISHED" && match.homeScore !== null && match.awayScore !== null) {
    if (match.homeScore > match.awayScore) {
      outcome = "HOME_WIN";
    } else if (match.homeScore < match.awayScore) {
      outcome = "AWAY_WIN";
    } else {
      outcome = "DRAW";
    }
  }

  return {
    id: match.id,
    externalId: match.externalId,

    playedAt: match.playedAt,
    status: match.status,
    matchday: match.matchday,

    homeTeam: {
      id: match.homeTeam.id,
      name: match.homeTeam.name,
      shortName: match.homeTeam.shortName,
      code: match.homeTeam.code,
      crestUrl: match.homeTeam.crestUrl,
    },

    awayTeam: {
      id: match.awayTeam.id,
      name: match.awayTeam.name,
      shortName: match.awayTeam.shortName,
      code: match.awayTeam.code,
      crestUrl: match.awayTeam.crestUrl,
    },

    homeScore: match.homeScore,
    awayScore: match.awayScore,

    outcome,

    season: {
      id: match.season.id,
      name: match.season.name,
      startYear: match.season.startYear,
      endYear: match.season.endYear,
    },
  };
};
