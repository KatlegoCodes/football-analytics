import { error } from "console";
import { prisma } from "../src/lib/db/prisma";

const main = async () => {
  const teams = await prisma.team.findMany();

  console.log("Teams:");

  for (const team of teams) {
    console.log(`- ${team.name}`);
  }
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
