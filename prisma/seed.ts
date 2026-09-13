import "dotenv/config";
import { PrismaClient } from "../src/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.league.upsert({
    where: {
      id: 1,
    },
    update: {
      name: "Premier League",
      country: "England",
    },
    create: {
      id: 1,
      name: "Premier League",
      country: "England",
    },
  });
  console.log("Database bootstrap comple.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
