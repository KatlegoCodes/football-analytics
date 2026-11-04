import "dotenv/config";
import { prisma } from "@/lib/db/prisma";
import getPlayerPerformance from "@/lib/analytics/player-performance";

const main = async () => {
  const playerId = 20;
  const seasonId = 3;

  const performance = await getPlayerPerformance(playerId, seasonId);

  console.log("\nPlayer Performance Summary:");
  console.dir(performance, { depth: null });
};

main()
  .catch((error) => {
    console.error("Player performance check failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
