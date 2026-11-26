import { MatchPlayerStatDetail } from "@/types/analytics";

type MatchPlayerStatsProp = {
  playerStats: MatchPlayerStatDetail[];
};

const MatchPlayerStats = ({ playerStats }: MatchPlayerStatsProp) => {
  if (playerStats.length === 0) {
    return (
      <section className="rounded-xl border border-[#E8E5DE] bg-white p-6">
        <h2 className="text-lg font-bold text-[#202631]">Player Statistics</h2>
        <p className="mt-3 text-sm text-[#8B8B86]">
          Player statistics are not available for this match.
        </p>
      </section>
    );
  }

  const homePlayers = playerStats.filter(
    (stat) => playerStats.length > 0 && stat.playerId !== null && stat
  );

  return (
    <section className="rounded-xl border border-[#E8E5DE] bg-white p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A52A3A]">
          StatsBomb Open data
        </p>
        <h2 className="mt-2 text-xl font-bold text-[#202631]">Player Statistics</h2>
        <p className="mt-1 text-sm text-[#8B8B86]">Individual match contributions</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-162.5 text-left text-sm ">
          <thead>
            <tr className="border-b border-[#E8E5DE] text-xs text-[#8B8B86]">
              <th className="py-3 pr-4">Player</th>
              <th className="px-3 py-3 text-center">MIN</th>
              <th className="px-3 py-3 text-center">G</th>
              <th className="px-3 py-3 text-center">A</th>
              <th className="px-3 py-3 text-center">SH</th>
              <th className="px-3 py-3 text-center">SOT</th>
              <th className="px-3 py-3 text-center">PASS</th>
              <th className="px-3 py-3 text-center">KP</th>
              <th className="px-3 py-3 text-center">TACK</th>
            </tr>
          </thead>

          <tbody>
            {playerStats.map((stat) => (
              <tr key={stat.playerId} className="border-b border-[#8B8B86] last:border-0">
                <td className="py-4 pr-4">
                  <p className="font-semibold text-[#202631]">{stat.playerName}</p>
                  <p className="mt-1 text-xs text-[#8B8B86]">
                    {stat.position ?? "Position Unavailable"}
                  </p>
                </td>

                <td className="px-3 py-4 text-center tabular-nums">{stat.minutesPlayed ?? "—"}</td>
                <td className="px-3 py-4 text-center tabular-nums">{stat.goals}</td>
                <td className="px-3 py-4 text-center tabular-nums">{stat.assists}</td>
                <td className="px-3 py-4 text-center tabular-nums">{stat.shots}</td>
                <td className="px-3 py-4 text-center tabular-nums">{stat.shotsOnTarget}</td>
                <td className="px-3 py-4 text-center tabular-nums">
                  {stat.passesCompleted}/{stat.passes}
                </td>
                <td className="px-3 py-4 text-center tabular-nums">{stat.keyPasses}</td>
                <td className="px-3 py-4 text-center tabular-nums">{stat.tackles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-[#A09D95]">
        MIN: Minutes · G: Goals · A: Assists · SH: Shots · SOT: Shots on target · KP: Key passes ·
        TACK: Tackles
      </p>
    </section>
  );
};

export default MatchPlayerStats;
