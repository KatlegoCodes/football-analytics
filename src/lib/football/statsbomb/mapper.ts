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

  pass?: {
    outcome?: { name: string } | null;
    type?: { name: string } | null;
    recipient?: { id: number } | null;
    assisted_shot_id?: string | null;
  } | null;

  duel?: {
    type?: { name: string } | null;
    outcome?: { name: string } | null;
  } | null;

  foul_committed?: {
    card?: { name: string } | null;
  } | null;

  substitution?: {
    replacement?: { id: number; name: string } | null;
  } | null;

  tactics?: {
    formation?: number | null;
    lineup?:
      | {
          player: {
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
  } | null;
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
  passOutcome: string | null;
  passType: string | null;
  passRecipientId: number | null;
  passAssistedShotId: string | null;

  duelType: string | null;
  duelOutcome: string | null;

  foulCard: string | null;

  substitutionReplacementId: number | null;
  substitutionReplacementName: string | null;
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
    passOutcome: event.type.name === "Pass" ? (event.pass?.outcome?.name ?? null) : null,

    passType: event.type.name === "Pass" ? (event.pass?.type?.name ?? null) : null,

    passRecipientId: event.type.name === "Pass" ? (event.pass?.recipient?.id ?? null) : null,

    passAssistedShotId: event.type.name === "Pass" ? (event.pass?.assisted_shot_id ?? null) : null,

    duelType: event.type.name === "Duel" ? (event.duel?.type?.name ?? null) : null,

    duelOutcome: event.type.name === "Duel" ? (event.duel?.outcome?.name ?? null) : null,

    foulCard:
      event.type.name === "Foul Committed" ? (event.foul_committed?.card?.name ?? null) : null,

    substitutionReplacementId:
      event.type.name === "Substitution" ? (event.substitution?.replacement?.id ?? null) : null,

    substitutionReplacementName:
      event.type.name === "Substitution" ? (event.substitution?.replacement?.name ?? null) : null,
    externalTeamId: event.team?.id ?? null,
    externalPlayerId: event.player?.id ?? null,
  };
};

export default mapStatsBombEvent;
