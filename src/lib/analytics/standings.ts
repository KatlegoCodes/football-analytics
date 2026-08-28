import { prisma } from "@/lib/db/prisma";

export const getStandings = async () => {
  const teams = await prisma.team.findMany({
    include: {
      homeMatches: true,
      awayMatches: true,
    },
  });

  const standings = teams.map((team) => {
    let played = 0;
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let points = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    const homeMatches = (team.homeMatches ?? []) as Array<{
      status: string;
      homeScore: number;
      awayScore: number;
    }>;

    const awayMatches = (team.awayMatches ?? []) as Array<{
      status: string;
      homeScore: number;
      awayScore: number;
    }>;

    for (const match of homeMatches) {
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

    for (const match of awayMatches) {
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

    return {
      teamId: team.id,
      team: team.name,
      played,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goaldDifference: goalsFor - goalsAgainst,
      points,
    };
  });

  return standings.sort(
    (a, b) =>
      b.points - a.points || b.goaldDifference - a.goaldDifference || b.goalsFor - a.goalsFor
  );
};
