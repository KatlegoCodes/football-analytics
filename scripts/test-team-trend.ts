import "dotenv/config";

import { prisma } from "@/lib/db/prisma";
import { getTeamPerformanceTrend } from "@/lib/analytics/team-trend";

async function main() {
  const team = await prisma.team.findFirst({
    where: {
      provider: "football-data",
    },
  });

  if (!team) {
    throw new Error("No provider-backed team found.");
  }

  const trend = await getTeamPerformanceTrend(team.id, 10);

  console.dir(trend, {
    depth: null,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
