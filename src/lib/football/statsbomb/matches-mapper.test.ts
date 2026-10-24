import { describe, expect, it } from "vitest";
import { mapStatsBombMatch, type StatsBombMatch } from "./matches-mapper";

const sampleMatch: StatsBombMatch = {
  match_id: 3895292,
  match_date: "2024-04-06",
  kick_off: "15:30:00",
  home_score: 0,
  away_score: 1,
  match_status: "available",
  match_week: 28,
  home_team: {
    home_team_id: 28,
    home_team_name: "Union Berlin",
  },
  away_team: {
    away_team_id: 904,
    away_team_name: "Bayer Leverkusen",
  },
  competition: {
    competition_id: 9,
    competition_name: "Bundesliga",
  },
  season: {
    season_id: 281,
    season_name: "2023/2024",
  },
};

describe("mapStatsBombMatch", () => {
  it("maps match metadata and preserves external IDs", () => {
    const result = mapStatsBombMatch(sampleMatch);

    expect(result.provider).toBe("statsbomb");
    expect(result.externalId).toBe(3895292);
    expect(result.homeTeam.externalId).toBe(28);
    expect(result.awayTeam.externalId).toBe(904);
    expect(result.competitionExternalId).toBe(9);
    expect(result.seasonExternalId).toBe(281);
  });

  it("preserves zero scores", () => {
    const result = mapStatsBombMatch(sampleMatch);

    expect(result.homeScore).toBe(0);
    expect(result.awayScore).toBe(1);
  });

  it("maps the match week and kickoff time", () => {
    const result = mapStatsBombMatch(sampleMatch);

    expect(result.matchday).toBe(28);
    expect(result.playedAt.toISOString()).toBe("2024-04-06T15:30:00.000Z");
  });

  it("handles missing optional kickoff and match week", () => {
    const result = mapStatsBombMatch({
      ...sampleMatch,
      kick_off: null,
      match_week: null,
    });

    expect(result.matchday).toBeNull();
    expect(result.playedAt.toISOString()).toBe("2024-04-06T00:00:00.000Z");
  });
});
