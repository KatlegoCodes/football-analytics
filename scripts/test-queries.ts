import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // 1. Get all leagues
  const leagues = await prisma.league.findMany();

  console.log("\n🏆 LEAGUES");
  console.log(leagues);

  // 2. Get teams with their players
  /* const teams = await prisma.team.findMany({
    include: {
      players: true,
    },
  });

  console.log("\n⚽ TEAMS & PLAYERS");

  for (const team of teams) {
    console.log(`\n${team.name}`);

    for (const player of team.players) {
      console.log(`  - ${player.name} (${player.position})`);
    }
  } */

  // 3. Get matches with both teams
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });

  console.log("\n📅 MATCHES");

  for (const match of matches) {
    console.log(
      `${match.homeTeam.name} ${match.homeScore} - ${match.awayScore} ${match.awayTeam.name}`
    );
  }

  // 4. Get player statistics
  const playerStats = await prisma.playerMatchStat.findMany({
    include: {
      player: true,
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
  });

  console.log("\n📊 PLAYER STATISTICS");

  for (const stat of playerStats) {
    console.log(`${stat.player.name}: ${stat.goals} goal(s), ${stat.assists} assist(s)`);
  }

  const topScorers = await prisma.playerMatchStat.groupBy({
    by: ["playerId"],
    _sum: {
      goals: true,
    },
    orderBy: {
      _sum: {
        goals: "desc",
      },
    },
  });

  const teams = await prisma.team.findMany({
    include: {
      homeMatches: true,
      AwayMatches: true,
    },
  });

  console.log("TEAM STANDINGS");
  console.log("----------");

  for (const team of teams) {
    let played = 0;
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let points = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    for (const match of team.homeMatches) {
      if (match.status !== "FINISHED") continue;

      played++;

      goalsFor += match.homeScore;
      goalsAgainst += match.awayScore;

      if (match.homeScore > match.awayScore) {
        wins++;
        points += 3;
      } else if (match.homeScore === match.awayScore) {
        draws++;
        points += 1;
      } else {
        losses++;
      }
    }

    for (const match of team.AwayMatches) {
      if (match.status !== "FINISHED") continue;

      played++;

      goalsFor += match.awayScore;
      goalsAgainst += match.homeScore;

      if (match.awayScore > match.homeScore) {
        wins++;
        points += 3;
      } else if (match.awayScore === match.homeScore) {
        draws++;
        points += 1;
      } else {
        losses++;
      }
    }

    console.log(
      `${team.name}: ` +
        `${played} played | ` +
        `${wins}W ${draws}D ${losses}L | ` +
        `${goalsFor}:${goalsAgainst} | ` +
        `${points} pts`
    );
  }

  const players = await prisma.player.findMany();

  console.log("\n TOP SCORERS");
  console.log("------------");

  for (const scorer of topScorers) {
    const player = players.find((player) => player.id === scorer.playerId);

    console.log(`${player?.name}: ${scorer._sum.goals ?? 0} goals`);
  }

  const matchWithStats = await prisma.match.findFirst({
    include: {
      homeTeam: true,
      awayTeam: true,
      teamStats: {
        include: {
          team: true,
        },
      },
    },
  });

  if (!matchWithStats) {
    console.log("No Matches found");
    return;
  }

  console.log("\n Match Insights");

  const homeStats = matchWithStats.teamStats.find(
    (stat) => stat.teamId === matchWithStats.homeTeamId
  );

  const awayStats = matchWithStats.teamStats.find(
    (stat) => stat.teamId === matchWithStats.awayTeamId
  );

  if (!homeStats || !awayStats) {
    console.log("TeamStatistics are missing");
    return;
  }

  const possessionDifference = (homeStats.possession ?? 0) - (awayStats.possession ?? 0);

  const shotDifference = homeStats.shots - awayStats.shots;

  const shotOnTargetDifference = homeStats.shotsOnTarget - awayStats.shotsOnTarget;

  const passAccuracyDifference = (homeStats.passAccuracy ?? 0) - (awayStats.passAccuracy ?? 0);

  console.log(
    `\n${matchWithStats.homeTeam.name} ${matchWithStats.homeScore} - ` +
      `${matchWithStats.awayScore} ${matchWithStats.awayTeam.name}`
  );

  console.log(
    `${matchWithStats.homeTeam.name}: ` +
      `${homeStats.possession}% possession, ` +
      `${homeStats.shots} shots, ` +
      `${homeStats.shotsOnTarget} on target`
  );

  console.log(
    `${matchWithStats.awayTeam.name}: ` +
      `${awayStats.possession}% possession, ` +
      `${awayStats.shots} shots, ` +
      `${awayStats.shotsOnTarget} on target`
  );

  console.log("\n📈 DIFFERENCES");

  console.log(`Possession: ${possessionDifference}%`);
  console.log(`Shots: ${shotDifference}`);
  console.log(`Shots on target: ${shotOnTargetDifference}`);
  console.log(`Pass accuracy: ${passAccuracyDifference}%`);

  let insight = "";

  if (possessionDifference > 10 && shotDifference > 3 && shotOnTargetDifference > 2) {
    insight = `${matchWithStats.homeTeam.name} dominated the match statistically.`;
  } else if (possessionDifference < -10 && shotDifference < -3 && shotOnTargetDifference < -2) {
    insight = `${matchWithStats.awayTeam.name} dominated the match statistically.`;
  } else {
    insight = "The match was relatively balanced statistically.";
  }

  console.log(`\n💡 INSIGHT: ${insight}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
