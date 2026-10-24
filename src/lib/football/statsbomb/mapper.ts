export type StatsBombEvent = {
  id: string;
  index: number;
  period: number;
  timestamp: string;
  minute: number;
  type: {
    id: number;
    name: string;
  };
  team?: {
    id: number;
    name: string;
  } | null;
  player?: {
    id: number;
    name: string;
  } | null;

  location?: number[] | null;
  shot?: {
    statsbomb_xg?: number | null;
    outcome?: {
      id: number;
      name: string;
    } | null;
    body_part?: {
      id: number;
      name: string;
    } | null;
    technique?: {
      id: number;
      name: string;
    } | null;
  } | null;

  tactics?:
    | {
        formation?: number | null;
        lineup?: {
          id: number;
          name: string;
        };
        position?: {
          id: number;
          name: string;
        } | null;
        jersey_number?: number | null;
      }[]
    | null;
};

export type MappedstatsBombEvent = {
  provider: "statsbomb";
  externalId: string;
  eventIndex: number;
  period: number;
  timestamp: string;
  minute: number;
  type: string;
  detail: string | null;
  locationX: number | null;
  locationY: number | null;
  shotOutcome: string | null;
  shotXg: number | null;
  shotBodyPart: string | null;
  shotTechnique: string | null;
  externalTeamId: number | null;
  externalPlayerId: number | null;
};

const mapStatsBombEvent = (event: StatsBombEvent): MappedstatsBombEvent => {
  const isShot = event.type.name === "Shot";

  return {
    provider: "statsbomb",
    externalId: event.id,
    eventIndex: event.index,
    period: event.period,
    timestamp: event.timestamp,
    minute: event.minute,
    type: event.type.name,
    detail: null,
    locationX: event.location?.[0] ?? null,
    locationY: event.location?.[1] ?? null,
    shotOutcome: isShot ? (event.shot?.outcome?.name ?? null) : null,
    shotXg: isShot ? (event.shot?.statsbomb_xg ?? null) : null,
    shotBodyPart: isShot ? (event.shot?.body_part?.name ?? null) : null,
    shotTechnique: isShot ? (event.shot?.technique?.name ?? null) : null,
    externalTeamId: event.team?.id ?? null,
    externalPlayerId: event.player?.id ?? null,
  };
};

export default mapStatsBombEvent;
