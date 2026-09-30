import "dotenv/config";
import { prisma } from "@/lib/db/prisma";
import { getMatchDetail } from "@/lib/analytics/match-detail";

async function main() {
  const match = await prisma.match.findFirst({
    where: {
      status: "FINISHED",
    },
  });

  if (!match) {
    throw new Error("No finished match found.");
  }

  const detail = await getMatchDetail(match.id);

  console.dir(detail, {
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
