import Link from "next/link";
import { getDashboardData } from "@/lib/analytics/dashboard";
import { prisma } from "@/lib/db/prisma";
import { getStandings } from "@/lib/analytics/standings";

type DashboardMatch = {
  id: number;
  playedAt: Date;
  homeScore: number | null;
  awayScore: number | null;

  homeTeam: {
    name: string;
    shortName: string | null;
  };

  awayTeam: {
    name: string;
    shortName: string | null;
  };
};

const formatMatchDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Johannesburg",
  }).format(date);
};

const MatchList = ({
  title,
  matches,
  showScore = false,
}: {
  title: string;
  matches: DashboardMatch[];
  showScore: boolean;
}) => {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        {matches.length === 0 ? (
          <p className="p-5 text-sm text-zinc-400">No matches available</p>
        ) : (
          matches.map((match) => (
            <Link
              key={match.id}
              href={`/matches/${match.id}`}
              className="block border border-zinc-800 p-4 transition-colors last:border-b-0 hover:bg-zinc-800/60"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium">{match.homeTeam.shortName ?? match.homeTeam.name}</p>

                  <p className="mt-1 font-medium">
                    {match.awayTeam.shortName ?? match.awayTeam.name}
                  </p>
                </div>

                {showScore && match.homeScore !== null && match.awayScore !== null ? (
                  <div className="text-right text-lg font-bold">
                    <p>{match.homeScore}</p>
                    <p>{match.awayScore}</p>
                  </div>
                ) : (
                  <time className="shrink-0 text-right text-sm text-zinc-400">
                    {formatMatchDate(match.playedAt)}
                  </time>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
};

const Dashboard = async () => {
  const currentSeason = await prisma.season.findFirst({
    where: {
      provider: "football-data",
    },
    orderBy: {
      startYear: "desc",
    },
  });

  if (!currentSeason) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h1 className="text-3xl font-bold">Premier League</h1>
          <p className="mt-4 text-zinc-400 ">No season data is available yet</p>
        </div>
      </main>
    );
  }

  const [dashboard, standings] = await Promise.all([
    getDashboardData(currentSeason.id),
    getStandings(currentSeason.id),
  ]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-10">
          <p className="mb-2 text-sm font-medium text-zinc-500">FOOTBALL ANALYTICS</p>

          <h1 className="text-4xl font-bold tracking-tight">Premier League</h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Explore Football Data, Team Perfomance and Player Statistics
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Teams" value={dashboard.summary.teams} />

          <SummaryCard label="Fixtures" value={dashboard.summary.matches} />

          <SummaryCard label="Played" value={dashboard.summary.finishedMatches} />

          <SummaryCard label="Goals" value={dashboard.summary.goals} />
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">League Standings</h2>

          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
            <table className="w-full text-left">
              <thead className="border-b border-zinc-800 text-sm text-zinc-400">
                <tr>
                  <th className="px-6 py-4">Team</th>
                  <th className="px-6 py-4">P</th>
                  <th className="px-6 py-4">W</th>
                  <th className="px-6 py-4">D</th>
                  <th className="px-6 py-4">L</th>
                  <th className="px-6 py-4">GD</th>
                  <th className="px-6 py-4">Pts</th>
                </tr>
              </thead>

              <tbody>
                {standings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                      No standings data available yet.
                    </td>
                  </tr>
                ) : (
                  standings.map((team) => (
                    <tr key={team.teamId} className="border-b border-zinc-800 last:border-0">
                      <td className="px-6 py-4 font-medium">
                        <Link href={`/teams/${team.teamId}`} className="hover:underline">
                          {team.team}
                        </Link>
                      </td>
                      <td className="px-6 py-4">{team.played}</td>
                      <td className="px-6 py-4">{team.wins}</td>
                      <td className="px-6 py-4">{team.draws}</td>
                      <td className="px-6 py-4">{team.losses}</td>
                      <td className="px-6 py-4">
                        {team.goaldDifference > 0
                          ? `+${team.goaldDifference}`
                          : team.goaldDifference}
                      </td>
                      <td className="px-6 py-4 font-bold">{team.points}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <MatchList title="Recent Results" matches={dashboard.recentMatches} showScore />
          <MatchList title="Upcoming Matches" matches={dashboard.upcomingMatches} showScore />
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
