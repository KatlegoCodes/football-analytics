import { prisma } from "@/lib/db/prisma";
import { getStatsBombMatches } from "../statsbomb/matches-client";
import { mapStatsBombMatch, type StatsBombMatch } from "../statsbomb/matches-mapper";
import { syncStatsBombTeamsAndSeason } from "./statsbomb-teams";

export const syncStatsBombMatches = async (competitionId: number, seasonId: number) => {
  const setup = await syncStatsBombTeamsAndSeason(competitionId, seasonId);

  const rawMatches = await getStatsBombMatches(competitionId, seasonId);

  const matches = rawMatches.map((match) => mapStatsBombMatch(match as StatsBombMatch));

  const season = await prisma.season.findUnique({
    where: {
      provider_externalId: {
        provider: "statsbomb",
        externalId: seasonId,
      },
    },
  });

  if (!season) {
    throw new Error(`StatsBomb season ${seasonId} was not found after ingestion`);
  }

  let created = 0;
  let updated = 0;

  for (const match of matches) {
    const homeTeam = await prisma.team.findUnique({
      where: {
        provider_externalId: {
          provider: "statsbomb",
          externalId: match.homeTeam.externalId,
        },
      },
    });

    const awayTeam = await prisma.team.findUnique({
      where: {
        provider_externalId: {
          provider: "statsbomb",
          externalId: match.awayTeam.externalId,
        },
      },
    });

    if (!homeTeam || !awayTeam) {
      throw new Error(`Missing team for StatsBomb match ${match.externalId}`);
    }

    const existingMatch = await prisma.match.findUnique({
      where: {
        provider_externalId: {
          provider: "statsbomb",
          externalId: match.externalId,
        },
      },
      select: { id: true },
    });

    await prisma.match.upsert({
      where: {
        provider_externalId: {
          provider: "statsbomb",
          externalId: match.externalId,
        },
      },
      update: {
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        playedAt: match.playedAt,
        status: match.status,
        matchday: match.matchday,
        seasonId: season.id,
      },
      create: {
        provider: "statsbomb",
        externalId: match.externalId,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        playedAt: match.playedAt,
        status: match.status,
        matchday: match.matchday,
        seasonId: season.id,
      },
    });

    if (existingMatch) {
      updated++;
    } else {
      created++;
    }
  }
};
