import { prisma } from "@/lib/db/prisma";
import { getStandings } from "@/lib/analytics/standings";

const Dashboard = async () => {
  const [teamCount, matchCount, goalStats, standings] = await Promise.all([
    prisma.team.count(),
    prisma.match.count(),
    prisma.match.aggregate({
      _sum: {
        homeScore: true,
        awayScore: true,
      },
    }),
    getStandings(),
  ]);

  const totalGoals = (goalStats._sum.homeScore ?? 0) + (goalStats._sum.awayScore ?? 0);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-10">
          <p className="mb-2 text-sm font-medium text-zinc-500">FOOTBALL ANALYTICS</p>

          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Explore Football Data, Team Perfomance and Player Statistics
          </p>
        </header>

        <section>
          <h2 className="mb-4 text-xl font-semibold">League Overview</h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-400 ">Teams</p>
              <p className="mt-2 text-3xl font-bold">{teamCount}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-400">Matches</p>
              <p className="mt-2 text-3xl font-bold">{matchCount}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-400">Goals</p>
              <p className="mt-2 text-3xl font-bold">{totalGoals}</p>
            </div>
          </div>
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
                {standings.map((team) => (
                  <tr key={team.teamId} className="border-b border-zinc-800 last:border-0">
                    <td className="px-6 py-4 font-medium">{team.team}</td>
                    <td className="px-6 py-4">{team.played}</td>
                    <td className="px-6 py-4">{team.wins}</td>
                    <td className="px-6 py-4">{team.draws}</td>
                    <td className="px-6 py-4">{team.losses}</td>
                    <td className="px-6 py-4">
                      {team.goaldDifference > 0 ? `+${team.goaldDifference}` : team.goaldDifference}
                    </td>
                    <td className="px-6 py-4 font-bold">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
