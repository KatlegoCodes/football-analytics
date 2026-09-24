import { prisma } from "@/lib/db/prisma";
import { MatchResult, TeamForm, TeamFormResult } from "@/types/analytics";

export const getTeamForm = async (teamId: number, limit = 5): Promise<TeamForm | null> => {
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
      status: "FINISHED",
      OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
    },

    include: {
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: {
      playedAt: "desc",
    },
    take: limit,
  });

  const formMatches: TeamFormResult[] = matches.flatMap((match) => {
    if (match.homeScore === null || match.awayScore === null) {
      return [];
    }

    const isHome = match.homeTeamId === teamId;

    const goalsFor = isHome ? match.homeScore : match.awayScore;

    const goalsAgainst = isHome ? match.awayScore : match.homeScore;

    let result: MatchResult;

    if (goalsFor > goalsAgainst) {
      result = "W";
    } else if (goalsFor < goalsAgainst) {
      result = "L";
    } else {
      result = "D";
    }

    const opponent = isHome ? match.awayTeam : match.homeTeam;

    return [
      {
        matchId: match.id,
        opponentId: opponent.id,
        opponent: opponent.name,
        playedAt: match.playedAt,

        venue: isHome ? "HOME" : "AWAY",

        result,
        goalsFor,
        goalsAgainst,
      },
    ];
  });

  const wins = formMatches.filter((match) => match.result === "W").length;

  const draws = formMatches.filter((match) => match.result === "D").length;

  const losses = formMatches.filter((match) => match.result === "L").length;

  const goalsFor = formMatches.reduce((total, match) => total + match.goalsFor, 0);

  const goalsAgainst = formMatches.reduce((total, match) => total + match.goalsAgainst, 0);

  const points = wins * 3 + draws;

  const played = formMatches.length;

  return {
    teamId: team.id,
    team: team.name,

    matches: formMatches,

    played,
    wins,
    draws,
    losses,

    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,

    points,

    pointsPerGame: played === 0 ? 0 : Number((points / played).toFixed(2)),
  };
};
