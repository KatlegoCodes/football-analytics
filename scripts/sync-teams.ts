import "dotenv/config";
import { prisma } from "../src/lib/db/prisma";
import { syncCompetitionTeams } from "../src/lib/football/ingestion/teams";

async function main() {
  const league = await prisma.league.findFirst({
    where: {
      name: "Premier League",
    },
  });

  if (!league) {
    throw new Error("Premier League not found");
  }

  const result = await syncCompetitionTeams("PL", league.id);

  console.log("Team sync complete:");
  console.log(result);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
