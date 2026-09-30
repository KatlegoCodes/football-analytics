import "dotenv/config";
import { prisma } from "@/lib/db/prisma";
import { getTeamPerformance } from "@/lib/analytics/team-performance";

const main = async () => {
  const team = await prisma.team.findFirst({
    where: {
      provider: "football-data",
    },
  });

  if (!team) {
    throw new Error("No provider backed team found");
  }

  const perfomance = await getTeamPerformance(team.id);

  console.dir(perfomance, { depth: null });
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
