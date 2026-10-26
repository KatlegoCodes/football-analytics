import { prisma } from "@/lib/db/prisma";
import { getStatsBombMatchEvents } from "../statsbomb/client";
import type { StatsBombEvent } from "../statsbomb/mapper";

export const syncStatsBombPlayers = async (matchExternalId: number) => {
  const rawEvents = await getStatsBombMatchEvents(matchExternalId);
  const events = rawEvents as StatsBombEvent[];

  const players = new Map<
    number,
    {
      externalId: number;
      name: string;
      position: string | null;
      externalTeamId: number;
    }
  >();

  for (const event of events) {
    if (event.type.name === "Starting XI" && event.team?.id) {
      for (const entry of event.tactics?.lineup ?? []) {
        players.set(entry.player.id, {
          externalId: entry.player.id,
          name: entry.player.name,
          position: entry.position?.name ?? null,
          externalTeamId: event.team.id,
        });
      }
    }

    if (event.player?.id && event.player.name && event.team?.id) {
      const existingPlayer = players.get(event.player.id);

      players.set(event.player.id, {
        externalId: event.player.id,
        name: event.player.name,
        position: existingPlayer?.position ?? null,
        externalTeamId: event.team.id,
      });
    }
  }

  let created = 0;
  let updated = 0;

  for (const player of players.values()) {
    const team = await prisma.team.findUnique({
      where: {
        provider_externalId: {
          provider: "statsbomb",
          externalId: player.externalTeamId,
        },
      },
    });

    if (!team) {
      throw new Error(`StatsBomb team ${player.externalTeamId} not found. Sync teams first.`);
    }

    const existingPlayer = await prisma.player.findUnique({
      where: {
        provider_externalId: {
          provider: "statsbomb",
          externalId: player.externalId,
        },
      },
    });

    await prisma.player.upsert({
      where: {
        provider_externalId: {
          provider: "statsbomb",
          externalId: player.externalId,
        },
      },
      update: {
        name: player.name,
        position: player.position,
        teamId: team.id,
      },
      create: {
        provider: "statsbomb",
        externalId: player.externalId,
        name: player.name,
        position: player.position,
        teamId: team.id,
      },
    });

    if (existingPlayer) {
      updated++;
    } else {
      created++;
    }
  }

  return {
    matchExternalId,
    playersProcessed: players.size,
    playersCreated: created,
    playersUpdated: updated,
  };
};
