import "dotenv/config";
import { prisma } from "@/lib/db/prisma";
import { syncStatsBombPipeline } from "@/lib/football/ingestion/statsbomb-pipeline";

const main = async () => {
  const result = await syncStatsBombPipeline({
    competitionId: 9,
    seasonId: 281,
    matchExternalId: 3895292,
  });

  console.log("\nStatsBomb Sync Complete:");
  console.dir(result, { depth: null });
};

main()
  .catch((error) => {
    console.error("\nStatsBomb sync failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
