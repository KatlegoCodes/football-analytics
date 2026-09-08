import "dotenv/config";
import { getCompetitionTeams } from "../src/lib/football/football-data/client";

async function main() {
  const data = await getCompetitionTeams("PL");

  console.log(`Competition: ${data.competition.name}`);
  console.log(`Teams returned: ${data.count}`);

  for (const team of data.teams) {
    console.log(`${team.name} (${team.tla})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
