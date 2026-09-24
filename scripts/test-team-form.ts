import "dotenv/config";
import { prisma } from "@/lib/db/prisma";
import { getTeamForm } from "@/lib/analytics/team-forms";

async function main() {
  const team = await prisma.team.findFirst({
    where: {
      provider: "football-data",
    },
  });

  if (!team) {
    throw new Error("No provider-backed team found.");
  }

  const form = await getTeamForm(team.id);

  console.dir(form, {
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
