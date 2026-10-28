import { prisma } from "@/lib/db/prisma";
import { calculatePlayerXg } from "./player-xg";

type GetPlayerXgOptions = {
  playerId: number;
  seasonId: number;
};

const getPlayerXg = async ({ playerId, seasonId }: GetPlayerXgOptions): Promise<number | null> => {
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

  const events = await prisma.matchEvent.findMany({
    where: {
      provider: "statsbomb",
      playerId,
      type: "Shot",
      match: {
        seasonId,
        status: "FINISHED",
      },
    },

    select: {
      type: true,
      shotXg: true,
    },
  });

  return calculatePlayerXg(events);
};

export default getPlayerXg;
