import "dotenv/config";
import { getCompetitionTeams } from "../src/lib/football/football-data/client";
import { mapFootballDataTeam } from "../src/lib/football/football-data/mapper";

async function main() {
  const data = await getCompetitionTeams("PL");

  console.log(`Competition: ${data.competition.name}`);
  console.log(`Teams returned: ${data.count}`);

  const mappedTeams = data.teams.map(mapFootballDataTeam);

  console.log(mappedTeams);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
