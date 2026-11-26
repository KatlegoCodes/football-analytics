import { prisma } from "@/lib/db/prisma";
import type { MatchDetail, MatchOutcome, MatchPlayerStatDetail } from "@/types/analytics";

export const getMatchDetail = async (matchId: number): Promise<MatchDetail | null> => {
  const match = await prisma.match.findUnique({
    where: {
      id: matchId,
    },

    include: {
      homeTeam: true,
      awayTeam: true,
      season: true,

      playerStats: {
        include: {
          player: {
            select: {
              id: true,
              name: true,
              position: true,
            },
          },
        },
      },
    },
  });

  if (!match) {
    return null;
  }

  console.log("MATCH PLAYER STATS DEBUG:", {
    matchId: match.id,
    externalId: match.externalId,
    provider: match.provider,
    playerStatsCount: match.playerStats.length,
  });

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

  const playerStats: MatchPlayerStatDetail[] =
    match.provider === "statsbomb"
      ? match.playerStats.map((stat) => ({
          playerId: stat.player.id,
          playerName: stat.player.name,
          position: stat.player.position,

          minutesPlayed: stat.minutesPlayed,

          goals: stat.goals,
          assists: stat.assists,
          shots: stat.shots,
          shotsOnTarget: stat.shotsOnTarget,

          passes: stat.passes,
          passesCompleted: stat.passesCompleted,
          keyPasses: stat.keyPasses,

          tackles: stat.tackles,
          interceptions: stat.interceptions,

          yellowCards: stat.yellowCards,
          redCards: stat.redCards,
        }))
      : [];

  return {
    id: match.id,
    externalId: match.externalId,
    provider: match.provider,

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

    playerStats,
  };
};
