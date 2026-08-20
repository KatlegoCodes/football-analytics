import { PrismaClient } from "../src/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding database...");

  const premierLeague = await prisma.league.create({
    data: {
      name: "Premier League",
      country: "England",
    },
  });

  const season = await prisma.season.create({
    data: {
      name: "2025/26",
      startYear: 2025,
      endYear: 2026,
    },
  });

  const manCity = await prisma.team.create({
    data: {
      name: "Manchester City",
      shortName: "MCI",
      leagueId: premierLeague.id,
    },
  });

  const arsenal = await prisma.team.create({
    data: {
      name: "Arsenal",
      shortName: "ARS",
      leagueId: premierLeague.id,
    },
  });

  const haaland = await prisma.player.create({
    data: {
      name: "Erling Haaland",
      position: "ST",
      nationality: "Norway",
      teamId: manCity.id,
    },
  });

  const deBruyne = await prisma.player.create({
    data: {
      name: "Kevin De Bruyne",
      position: "CM",
      nationality: "Belgium",
      teamId: manCity.id,
    },
  });

  const saka = await prisma.player.create({
    data: {
      name: "Bukayo Saka",
      position: "RW",
      nationality: "England",
      teamId: arsenal.id,
    },
  });

  const odegaard = await prisma.player.create({
    data: {
      name: "Martin Ødegaard",
      position: "AM",
      nationality: "Norway",
      teamId: arsenal.id,
    },
  });

  const match = await prisma.match.create({
    data: {
      homeTeamId: manCity.id,
      awayTeamId: arsenal.id,
      homeScore: 3,
      awayScore: 1,
      playedAt: new Date("2025-09-20T15:00:00Z"),
      status: "FINISHED",
      seasonId: season.id,
    },
  });

  await prisma.matchEvent.createMany({
    data: [
      {
        matchId: match.id,
        minute: 23,
        type: "GOAL",
        detail: "Goal",
        teamId: manCity.id,
        extraTime: 0,
      },
      {
        matchId: match.id,
        minute: 41,
        type: "GOAL",
        detail: "Goal",
        teamId: arsenal.id,
        extraTime: 0,
      },
      {
        matchId: match.id,
        minute: 67,
        type: "GOAL",
        detail: "Goal",
        teamId: manCity.id,
        extraTime: 0,
      },
      {
        matchId: match.id,
        minute: 82,
        type: "GOAL",
        detail: "Goal",
        teamId: manCity.id,
        extraTime: 0,
      },
    ],
  });

  await prisma.teamMatchStat.createMany({
    data: [
      {
        teamId: manCity.id,
        matchId: match.id,
        possession: 61,
        shots: 15,
        shotsOnTarget: 7,
        corners: 6,
        fouls: 9,
        yellowCards: 2,
        redCards: 0,
        offsides: 2,
        passes: 587,
        passAccuracy: 89,
      },
      {
        teamId: arsenal.id,
        matchId: match.id,
        possession: 39,
        shots: 8,
        shotsOnTarget: 3,
        corners: 2,
        fouls: 12,
        yellowCards: 3,
        redCards: 0,
        offsides: 1,
        passes: 402,
        passAccuracy: 82,
      },
    ],
  });

  await prisma.playerMatchStat.createMany({
    data: [
      {
        playerId: haaland.id,
        matchId: match.id,
        minutesPlayed: 90,
        goals: 2,
        assists: 0,
        shots: 5,
        shotsOnTarget: 3,
      },
      {
        playerId: deBruyne.id,
        matchId: match.id,
        minutesPlayed: 90,
        goals: 1,
        assists: 1,
        shots: 3,
        shotsOnTarget: 2,
        keyPasses: 4,
      },
      {
        playerId: saka.id,
        matchId: match.id,
        minutesPlayed: 90,
        goals: 1,
        assists: 0,
        shots: 3,
        shotsOnTarget: 1,
      },
      {
        playerId: odegaard.id,
        matchId: match.id,
        minutesPlayed: 90,
        goals: 0,
        assists: 1,
        shots: 2,
        shotsOnTarget: 1,
        keyPasses: 3,
      },
    ],
  });

  console.log("✅ Seed complete!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
