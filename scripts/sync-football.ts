import "dotenv/config";
import { prisma } from "@/lib/db/prisma";
import { syncFootballData } from "@/lib/football/sync";

const main = async () => {
  const league = await prisma.league.findFirst({
    where: {
      name: "Premier League",
    },
  });

  if (!league) {
    throw new Error("Premier League not found. Run the database bootstrap first.");
  }

  const result = await syncFootballData("PL", league.id);

  console.log("\nFootball Sync Complete:");
  console.log(result);
};

main()
  .catch((error) => {
    console.error("\nFootball sync failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
