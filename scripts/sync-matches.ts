import "dotenv/config";
import { prisma } from "@/lib/db/prisma";
import { syncCompetitionMatches } from "@/lib/football/ingestion/matches";

const main = async () => {
  const result = await syncCompetitionMatches("PL");

  console.log("Match sync complete");
  console.log(result);
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
