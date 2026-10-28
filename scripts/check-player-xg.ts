import "dotenv/config";
import { prisma } from "@/lib/db/prisma";
import getPlayerXg from "@/lib/analytics/calculations/player-xg-data";

const main = async () => {
  const playerId = 20;
  const seasonId = 3;

  const xg = await getPlayerXg({ playerId, seasonId });

  console.log({
    playerId,
    seasonId,
    expectedGoals: xg,
  });
};

main()
  .catch((error) => {
    console.error("Player xG check failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
