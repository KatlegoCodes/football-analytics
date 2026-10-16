import { prisma } from "@/lib/db/prisma";
import type { PlayerPerformanceSummary } from "@/types/analytics";
import { calculatePlayerPerformance } from "./calculations/player-performance";

const getPlayerPerformance = async (
  playerId: number,
  seasonId: number
): Promise<PlayerPerformanceSummary | null> => {
  const player = await prisma.player.findUnique({
    where: {
      id: playerId,
    },

    select: {
      id: true,
    },
  });

  if (!player) {
    return null;
  }

  const stats = await prisma.playerMatchStat.findMany({
    where: {
      playerId,
      match: {
        seasonId,
        status: "FINISHED",
      },
    },

    select: {
      minutesPlayed: true,
      goals: true,
      assists: true,
      shots: true,
      shotsOnTarget: true,
      passes: true,
      tackles: true,
      interceptions: true,
      yellowCards: true,
      redCards: true,
    },
  });

  return calculatePlayerPerformance(player.id, stats);
};

export default getPlayerPerformance;
