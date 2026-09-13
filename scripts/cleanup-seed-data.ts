import "dotenv/config";
import { prisma } from "../src/lib/db/prisma";

async function main() {
  const seedTeams = await prisma.team.findMany({
    where: {
      provider: null,
      externalId: null,
    },
  });

  if (seedTeams.length === 0) {
    console.log("No legacy seed teams found.");
    return;
  }

  const teamIds = seedTeams.map((team) => team.id);

  console.log(
    "Removing legacy teams:",
    seedTeams.map((team) => team.name)
  );

  await prisma.$transaction(async (tx) => {
    // Stats depend on matches/players.
    await tx.playerMatchStat.deleteMany({
      where: {
        OR: [
          {
            player: {
              teamId: {
                in: teamIds,
              },
            },
          },
          {
            match: {
              OR: [{ homeTeamId: { in: teamIds } }, { awayTeamId: { in: teamIds } }],
            },
          },
        ],
      },
    });

    await tx.teamMatchStat.deleteMany({
      where: {
        OR: [
          { teamId: { in: teamIds } },
          {
            match: {
              OR: [{ homeTeamId: { in: teamIds } }, { awayTeamId: { in: teamIds } }],
            },
          },
        ],
      },
    });

    await tx.matchEvent.deleteMany({
      where: {
        OR: [
          { teamId: { in: teamIds } },
          {
            match: {
              OR: [{ homeTeamId: { in: teamIds } }, { awayTeamId: { in: teamIds } }],
            },
          },
        ],
      },
    });

    await tx.match.deleteMany({
      where: {
        OR: [{ homeTeamId: { in: teamIds } }, { awayTeamId: { in: teamIds } }],
      },
    });

    await tx.player.deleteMany({
      where: {
        teamId: {
          in: teamIds,
        },
      },
    });

    await tx.team.deleteMany({
      where: {
        id: {
          in: teamIds,
        },
      },
    });
  });

  console.log("Legacy seed football data removed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
