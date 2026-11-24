import { prisma } from "@/lib/db/prisma";
import { getStatsBombArchive } from "@/lib/analytics/statsbomb-archive";

const BundesligaPage = async () => {
  const season = await prisma.season.findFirst({
    where: {
      provider: "statsbomb",
      externalId: 281,
    },
  });

  if (!season) {
    return (
      <section className="py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#A52A3A]">
          Statsbomb open Data
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#202631]">Bundesliga Archive</h1>
        <p className="mt-3 text-sm text-[#8B8B86]">
          Historical Match data is currently unavailable
        </p>
      </section>
    );
  }

  const archive = await getStatsBombArchive(season.id);

  if (!archive) {
    return <p>Unable to load Bundesliga archive.</p>;
  }

  return (
    <div className="space-y-10">
      <header className="border-b border-[#E8E5DE] pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A52A3A]">
          StatsBomb Open Data / Historical Analysis
        </p>

        <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#202631]">Bundesliga</h1>
            <p className="mt-2 text-sm text-[#8B8B86]">
              {archive.season.name} Historical match archive
            </p>
          </div>

          <div className="text-sm text-[#8B8B86]">
            Season {archive.season.startYear} / {archive.season.endYear}
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#E8E5DE] bg-white p-6">
          <p className="text-sm text-[#8B8B86]">Matches in archive</p>
          <p className="mt-3 text-4xl font-semibold text-[#202631]">{archive.summary.matches}</p>
        </div>

        <div className="rounded-xl border border-[#E8E5DE] bg-white p-6">
          <p className="text-sm text-[#8B8B86]">Completed matches</p>
          <p className="mt-3 text-4xl font-semibold text-[#202631]">
            {archive.summary.completedMatches}
          </p>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#202631]">Match archive</h2>
          <p className="mt-1 text-sm text-[#8B8B86]">
            Explore historical Bundesliga fixtures and results.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#E8E5DE] bg-white">
          {archive.matches.length === 0 ? (
            <p className="p-6 text-sm text-[#8B8B86]">No matches are available for this season.</p>
          ) : (
            <div className="divide-y divide-[#E8E5DE]">
              {archive.matches.map((match) => (
                <div
                  key={match.id}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-5 sm:grid-cols-[1fr_auto_1fr]"
                >
                  <div className="text-sm font-medium text-[#202631]">{match.homeTeam.name}</div>

                  <div className="text-center">
                    {match.status === "FINISHED" ? (
                      <p className="font-semibold tabular-nums text-[#202631]">
                        {match.homeScore} – {match.awayScore}
                      </p>
                    ) : (
                      <p className="text-xs text-[#8B8B86]">Not played</p>
                    )}

                    <p className="mt-1 text-[10px] uppercase tracking-wider text-[#A09D95]">
                      {new Date(match.playedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="text-right text-sm font-medium text-[#202631]">
                    {match.awayTeam.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BundesligaPage;
