import "dotenv/config";
import { getCompetitionMatches } from "../src/lib/football/football-data/client";
import { mapFootballDataMatch } from "../src/lib/football/football-data/mapper";

async function main() {
  const response = await getCompetitionMatches("PL");

  const matches = response.matches.map(mapFootballDataMatch);

  console.log(`Competition: ${response.competition.name}`);
  console.log(`Matches returned: ${matches.length}`);

  console.log(matches.slice(0, 5));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
