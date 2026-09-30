import Image from "next/image";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { getTeamForm } from "@/lib/analytics/team-forms";
import { getTeamPerformance } from "@/lib/analytics/team-performance";

type TeamPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const TeamPage = async ({ params }: TeamPageProps) => {
  const { id } = await params;

  const teamId = Number(id);

  if (!Number.isInteger(teamId) || teamId < 0) {
    notFound();
  }

  const [team, form, performance] = await Promise.all([
    prisma.team.findUnique({
      where: {
        id: teamId,
      },
    }),

    getTeamForm(teamId),

    getTeamPerformance(teamId),
  ]);

  if (!team || !form || !performance) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-10 flex items-center gap-5">
          {team.crestUrl && (
            <div className="relative h-20 w-20 shrink-0">
              <Image
                src={team.crestUrl}
                alt={`${team.name} crest`}
                fill
                sizes="80px"
                className="object-contain"
              />
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-zinc-500">TEAM ANALYTICS</p>

            <h1 className="mt-1 text-4xl font-bold tracking-tight">{team.name}</h1>

            {team.code && <p className="mt-2 text-zinc-400">{team.code}</p>}
          </div>
        </header>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Recent Form</h2>

          {form.matches.length === 0 ? (
            <div>No Complete Matches Available.</div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {form.matches.map((match) => (
                <div
                  key={match.matchId}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                        match.result === "W"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : match.result === "D"
                            ? "bg-amber-500/15 text-amber-400 "
                            : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {match.result}
                    </span>

                    <span className="font-medium">{match.opponent}</span>
                  </div>

                  <p className="text-sm text-zinc-400">
                    {match.venue === "HOME" ? "home" : "away"}
                    {"."}
                    {match.goalsFor}-{match.goalsAgainst}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Performance</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Played" value={performance.overall.played} />

            <StatCard label="Points per game" value={performance.overall.pointsPerGame} />

            <StatCard label="Goals per game" value={performance.overall.goalsPerGame} />

            <StatCard
              label="Goals conceded / game"
              value={performance.overall.goalsAgainstPerGame}
            />

            <StatCard label="Wins" value={performance.overall.wins} />

            <StatCard label="Draws" value={performance.overall.draws} />

            <StatCard label="Losses" value={performance.overall.losses} />

            <StatCard
              label="Goal difference"
              value={
                performance.overall.goalDifference > 0
                  ? `+${performance.overall.goalDifference}`
                  : performance.overall.goalDifference
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
};

const StatCard = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="text-sm text-zinc-400">{label}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
};

type PerformancePanelProps = {
  title: string;

  performance: {
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    pointsPerGame: number;
    cleanSheets: number;
    failedToScore: number;
  };
};

const PerformancePanel = ({ title, performance }: PerformancePanelProps) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="mb-6 text-lg font-semibold">{title}</h3>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        <Metric label="Played" value={performance.played} />

        <Metric
          label="W / D / L"
          value={`${performance.wins} / ${performance.draws} / ${performance.losses}`}
        />

        <Metric label="PPG" value={performance.pointsPerGame} />

        <Metric label="Goals" value={`${performance.goalsFor}–${performance.goalsAgainst}`} />

        <Metric label="Clean sheets" value={performance.cleanSheets} />

        <Metric label="Failed to score" value={performance.failedToScore} />
      </div>
    </div>
  );
};

const Metric = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>

      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
};

export default TeamPage;
