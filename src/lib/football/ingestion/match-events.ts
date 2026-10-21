import { prisma } from "@/lib/db/prisma";
import { getStatsBombMatchEvents } from "../statsbomb/client";
import mapStatsBombEvent, { MappedstatsBombEvent, type StatsBombEvent } from "../statsbomb/mapper";

const PROVIDER = "statsbomb";

export const syncStatsBombMatchEvents = async (matchExternalId: number) => {
  const match = await prisma.match.findUnique({
    where: {
      provider_externalId: {
        provider: PROVIDER,
        externalId: matchExternalId,
      },
    },
  });

  if (!match) {
    throw new Error(
      `StatsBomb match ${matchExternalId} is not in the database. import the match first`
    );
  }

  const rawEvents = await getStatsBombMatchEvents(matchExternalId);
  const events = rawEvents.map((event) => mapStatsBombEvent(event as StatsBombEvent));

  const teamExternalIds = [
    ...new Set(
      events.flatMap((event) => (event.externalTeamId === null ? [] : [event.externalTeamId]))
    ),
  ];

  const playerExternalIds = [
    ...new Set(
      events.flatMap((event) => (event.externalPlayerId === null ? [] : [event.externalPlayerId]))
    ),
  ];

  const [teams, players] = await Promise.all([
    prisma.team.findMany({
      where: {
        provider: PROVIDER,
        externalId: { in: teamExternalIds },
      },
      select: { id: true, externalId: true },
    }),
    prisma.player.findMany({
      where: {
        provider: PROVIDER,
        externalId: { in: playerExternalIds },
      },
    }),
  ]);

  const teamIdByExternalId = new Map(
    teams
      .filter((team): team is typeof team & { externalId: number } => team.externalId !== null)
      .map((team) => [team.externalId, team.id])
  );

  const playerIdByExternalId = new Map(
    players
      .filter(
        (player): player is typeof player & { externalId: number } => player.externalId !== null
      )
      .map((player) => [player.externalId, player.id])
  );

  for (const event of events) {
    if (event.externalTeamId !== null && !teamIdByExternalId.has(event.externalTeamId)) {
      throw new Error(`Missing StatsBomb team ${event.externalTeamId}. Import the team first.`);
    }

    if (event.externalPlayerId !== null && !playerIdByExternalId.has(event.externalPlayerId)) {
      throw new Error(
        `Missing StatsBomb player ${event.externalPlayerId}. Import the player first.`
      );
    }
  }

  let created = 0;
  let updated = 0;

  for (const event of events) {
    const teamId =
      event.externalTeamId === null ? null : teamIdByExternalId.get(event.externalTeamId)!;

    const playerId =
      event.externalPlayerId === null ? null : playerIdByExternalId.get(event.externalPlayerId)!;

    const existing = await prisma.matchEvent.findUnique({
      where: {
        provider_externalId: {
          provider: PROVIDER,
          externalId: event.externalId,
        },
      },
      select: { id: true },
    });

    await prisma.matchEvent.upsert({
      where: {
        provider_externalId: {
          provider: PROVIDER,
          externalId: event.externalId,
        },
      },
      update: {
        matchId: match.id,
        minute: event.minute,
        period: event.period,
        timestamp: event.timestamp,
        eventIndex: event.eventIndex,
        type: event.type,
        detail: event.detail,
        locationX: event.locationX,
        locationY: event.locationY,
        shotOutcome: event.shotOutcome,
        shotXg: event.shotXg,
        shotBodyPart: event.shotBodyPart,
        shotTechnique: event.shotTechnique,
        teamId,
        playerId,
      },
      create: {
        provider: PROVIDER,
        externalId: event.externalId,
        matchId: match.id,
        minute: event.minute,
        period: event.period,
        timestamp: event.timestamp,
        eventIndex: event.eventIndex,
        type: event.type,
        detail: event.detail,
        locationX: event.locationX,
        locationY: event.locationY,
        shotOutcome: event.shotOutcome,
        shotXg: event.shotXg,
        shotBodyPart: event.shotBodyPart,
        shotTechnique: event.shotTechnique,
        teamId,
        playerId,
      },
    });

    if (existing) {
      updated++;
    } else {
      created++;
    }
  }

  return {
    provider: PROVIDER,
    matchExternalId,
    received: events.length,
    created,
    updated,
  };
};
