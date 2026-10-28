export type StatsBombMatch = {
  match_id: number;
  match_date: string;
  kick_off?: string | null;
  home_score: number | null;
  away_score: number | null;
  match_status?: string | null;
  match_week?: number | null;
  home_team: {
    home_team_id: number;
    home_team_name: string;
  };
  away_team: {
    away_team_id: number;
    away_team_name: string;
  };
  competition: {
    competition_id: number;
    competition_name: string;
  };
  season: {
    season_id: number;
    season_name: string;
  };
};

export type MappedStatsBombMatch = {
  provider: "statsbomb";
  externalId: number;
  playedAt: Date;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  matchday: number | null;
  competitionExternalId: number;
  competitionName: string;
  seasonExternalId: number;
  seasonName: string;
  homeTeam: {
    externalId: number;
    name: string;
  };
  awayTeam: {
    externalId: number;
    name: string;
  };
};

export const mapStatsBombMatch = (match: StatsBombMatch): MappedStatsBombMatch => {
  const playedAt = new Date(`${match.match_date}T${match.kick_off ?? "00:00:00"}Z`);
  if (Number.isNaN(playedAt.getTime())) {
    throw new Error(`Invalid match date for StatsBomb match ${match.match_id}`);
  }

  return {
    provider: "statsbomb",
    externalId: match.match_id,
    playedAt,
    homeScore: match.home_score,
    awayScore: match.away_score,
    status:
      match.home_score !== null && match.away_score !== null
        ? "FINISHED"
        : (match.match_status ?? "SCHEDULED"),
    matchday: match.match_week ?? null,
    competitionExternalId: match.competition.competition_id,
    competitionName: match.competition.competition_name,
    seasonExternalId: match.season.season_id,
    seasonName: match.season.season_name,
    homeTeam: {
      externalId: match.home_team.home_team_id,
      name: match.home_team.home_team_name,
    },
    awayTeam: {
      externalId: match.away_team.away_team_id,
      name: match.away_team.away_team_name,
    },
  };
};
