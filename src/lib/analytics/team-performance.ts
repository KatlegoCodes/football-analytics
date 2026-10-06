import { prisma } from "@/lib/db/prisma";
import { PerformanceSplit, TeamPerformance } from "@/types/analytics";

type MatchPerformance = {
  venue: "HOME" | "AWAY";
  goalsFor: number;
  goalsAgainst: number;
};

const calculateSplit = (matches: MatchPerformance[]): PerformanceSplit => {
  const played = matches.length;

  let wins = 0;
  let draws = 0;
  let losses = 0;

  let goalsFor = 0;
  let goalsAgainst = 0;

  let cleanSheets = 0;
  let failedToScore = 0;

  for (const match of matches) {
    goalsFor += match.goalsFor;
    goalsAgainst += match.goalsAgainst;

    if (match.goalsFor > match.goalsAgainst) {
      wins++;
    } else if (match.goalsFor < match.goalsAgainst) {
      losses++;
    } else {
      draws++;
    }

    if (match.goalsAgainst === 0) {
      cleanSheets++;
    }

    if (match.goalsFor === 0) {
      failedToScore++;
    }
  }

  const points = wins * 3 + draws;

  return {
    played,
    wins,
    draws,
    losses,

    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,

    points,

    pointsPerGame: played === 0 ? 0 : Number((points / played).toFixed(2)),

    goalsPerGame: played === 0 ? 0 : Number((goalsFor / played).toFixed(2)),

    goalsAgainstPerGame: played === 0 ? 0 : Number((goalsAgainst / played).toFixed(2)),

    cleanSheets,
    failedToScore,
  };
};

export async function getTeamPerformance(
  teamId: number,
  seasonId: number
): Promise<TeamPerformance | null> {
  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    return null;
  }

  const matches = await prisma.match.findMany({
    where: {
      seasonId,
      status: "FINISHED",
      OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
    },

    orderBy: {
      playedAt: "asc",
    },
  });

  const performances: MatchPerformance[] = matches.flatMap((match) => {
    if (match.homeScore === null || match.awayScore === null) {
      return [];
    }

    const isHome = match.homeTeamId === teamId;

    return [
      {
        venue: isHome ? "HOME" : "AWAY",
        goalsFor: isHome ? match.homeScore : match.awayScore,
        goalsAgainst: isHome ? match.awayScore : match.homeScore,
      },
    ];
  });

  const homeMatches = performances.filter((match) => match.venue === "HOME");

  const awayMatches = performances.filter((match) => match.venue === "AWAY");

  return {
    teamId: team.id,
    team: team.name,

    overall: calculateSplit(performances),
    home: calculateSplit(homeMatches),
    away: calculateSplit(awayMatches),
  };
}
