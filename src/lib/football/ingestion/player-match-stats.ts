import { prisma } from "@/lib/db/prisma";

const PROVIDER = "statsbomb";

type PlayerStatsAccumulator = {
  playerId: number;
  goals: number;
  assists: number;
  shots: number;
  shotsOnTarget: number;
  passes: number;
  passesCompleted: number;
  keyPasses: number;
  tackles: number;
  interceptions: number;
  yellowCards: number;
  redCards: number;
};

export const syncStatsBombPlayerMatchStats = async (matchExternalId: number) => {
  const match = await prisma.match.findUnique({
    where: {
      provider_externalId: {
        provider: PROVIDER,
        externalId: matchExternalId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!match) {
    throw new Error(`statsBomb match ${matchExternalId} was not found`);
  }

  const events = await prisma.matchEvent.findMany({
    where: {
      provider: PROVIDER,
      matchId: match.id,
    },
    select: {
      externalId: true,
      playerId: true,
      type: true,
      shotOutcome: true,
      passOutcome: true,
      passAssistedShotId: true,
      duelType: true,
      foulCard: true,
    },
  });

  const playerStats = new Map<number, PlayerStatsAccumulator>();

  const getPlayerStats = (playerId: number) => {
    let stats = playerStats.get(playerId);

    if (!stats) {
      stats = {
        playerId,
        goals: 0,
        assists: 0,
        shots: 0,
        shotsOnTarget: 0,
        passes: 0,
        passesCompleted: 0,
        keyPasses: 0,
        tackles: 0,
        interceptions: 0,
        yellowCards: 0,
        redCards: 0,
      };

      playerStats.set(playerId, stats);
    }

    return stats;
  };

  const goalShotIds = new Set(
    events
      .filter((event) => event.type === "Shot" && event.shotOutcome === "Goal")
      .map((event) => event.externalId)
  );

  for (const event of events) {
    if (event.playerId === null) {
      continue;
    }

    const stats = getPlayerStats(event.playerId);

    switch (event.type) {
      case "Shot": {
        stats.shots++;

        if (event.shotOutcome === "Goal" || event.shotOutcome === "saved") {
          stats.shotsOnTarget++;
        }

        if (event.shotOutcome === "Goal") {
          stats.goals++;
        }

        break;
      }

      case "Pass": {
        stats.passes++;

        // StatsBomb represents completed passes with no outcome.
        if (event.passOutcome === null) {
          stats.passesCompleted++;
        }

        if (event.passAssistedShotId !== null) {
          stats.keyPasses++;

          if (goalShotIds.has(event.passAssistedShotId)) {
            stats.assists++;
          }
        }

        break;
      }

      case "Duel": {
        if (event.duelType === "Tackle") {
          stats.tackles++;
        }

        break;
      }

      case "Interception": {
        stats.interceptions++;
        break;
      }
    }

    if (event.foulCard === "Yellow Card") {
      stats.yellowCards++;
    } else if (event.foulCard === "Second Yellow") {
      stats.yellowCards++;
      stats.redCards++;
    } else if (event.foulCard === "Red Card") {
      stats.redCards++;
    }
  }

  let created = 0;
  let updated = 0;

  for (const stats of playerStats.values()) {
    const { playerId, ...data } = stats;

    const existing = await prisma.playerMatchStat.findUnique({
      where: {
        playerId_matchId: {
          playerId,
          matchId: match.id,
        },
      },
      select: {
        id: true,
      },
    });

    await prisma.playerMatchStat.upsert({
      where: {
        playerId_matchId: {
          playerId,
          matchId: match.id,
        },
      },
      create: {
        playerId,
        matchId: match.id,
        ...data,
      },
      update: data,
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
    eventsProcessed: events.length,
    playersProcessed: playerStats.size,
    created,
    updated,
  };
};
