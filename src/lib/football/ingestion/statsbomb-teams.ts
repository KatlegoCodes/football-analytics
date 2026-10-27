import { prisma } from "@/lib/db/prisma";
import { getStatsBombMatches } from "../statsbomb/matches-client";
import { mapStatsBombMatch, type StatsBombMatch } from "../statsbomb/matches-mapper";
export const syncStatsBombTeamsAndSeason = async (competitionId: number, seasonId: number) => {
  const rawMatches = await getStatsBombMatches(competitionId, seasonId);

  if (rawMatches.length === 0) {
    throw new Error(
      `No StatsBomb matches found for competition ${competitionId}, season ${seasonId}`
    );
  }

  const matches = rawMatches.map((match) => mapStatsBombMatch(match as StatsBombMatch));

  const { competitionName, seasonName } = matches[0];

  let league = await prisma.league.findFirst({
    where: { name: competitionName },
  });

  console.log("StatsBomb competition:", competitionName);
  console.log("League lookup result:", league);

  if (!league) {
    league = await prisma.league.create({
      data: {
        name: competitionName,
        country: "Germany",
      },
    });
  }

  const season = await prisma.season.upsert({
    where: {
      provider_externalId: {
        provider: "statsbomb",
        externalId: seasonId,
      },
    },

    update: {
      name: seasonName,
    },

    create: {
      provider: "statsbomb",
      externalId: seasonId,
      name: seasonName,
      startYear: 2023,
      endYear: 2024,
    },
  });

  const teams = new Map<number, { externalId: number; name: string }>();

  for (const match of matches) {
    teams.set(match.homeTeam.externalId, match.homeTeam);
    teams.set(match.awayTeam.externalId, match.awayTeam);
  }

  for (const team of teams.values()) {
    await prisma.team.upsert({
      where: {
        provider_externalId: {
          provider: "statsbomb",
          externalId: team.externalId,
        },
      },

      update: {
        name: team.name,
        leagueId: league.id,
      },

      create: {
        provider: "statsbomb",
        externalId: team.externalId,
        name: team.name,
        leagueId: league.id,
      },
    });
  }

  return {
    competition: competitionName,
    season: seasonName,
    teamsProcessed: teams.size,
    matchesDiscovered: matches.length,
    leagueId: league.id,
    seasonId: season.id,
  };
};
