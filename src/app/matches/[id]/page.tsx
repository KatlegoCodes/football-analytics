import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getMatchDetail } from "@/lib/analytics/match-detail";
import { match } from "assert";

type MatchPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const MatchPage = async ({ params }: MatchPageProps) => {
  const { id } = await params;

  const matchId = Number(id);

  if (!Number.isInteger(matchId) || matchId < 0) {
    notFound();
  }

  const match = await getMatchDetail(matchId);

  if (!match) {
    notFound();
  }

  const isFinished =
    match.status === "FINISHED" && match.homeScore !== null && match.awayScore !== null;

  const matchDate = new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Africa/Johannesburg",
  }).format(match.playedAt);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-10 text-center">
          <p>
            {match.season.name}
            {match.matchday ? `Matchday ${match.matchday}` : ""}
          </p>
          <p>{matchDate}</p>

          <StatusBadge status={match.status} />
        </header>

        <section className="rounde-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-10">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-10">
            <Team
              id={match.homeTeam.id}
              name={match.homeTeam.name}
              shortName={match.homeTeam.shortName}
              crestUrl={match.homeTeam.crestUrl}
            />

            <div className="text-center">
              {isFinished ? (
                <>
                  <div className="flex items-center gap-3 text-4xl font-bold sm:text-6xl">
                    <span>{match.homeScore}</span>
                    <span className="text-zinc-600">-</span>
                    <span>{match.awayScore}</span>
                  </div>

                  <p className="mt-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Full time
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    VS
                  </p>

                  <p>{match.status}</p>
                </>
              )}
            </div>

            <Team
              id={match.awayTeam.id}
              name={match.awayTeam.name}
              shortName={match.awayTeam.shortName}
              crestUrl={match.awayTeam.crestUrl}
            />
          </div>
        </section>

        {isFinished && (
          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <MatchInfo label="Result" value={formatOutcome(match.outcome)} />

            <MatchInfo label="Matchday" value={match.matchday ? String(match.matchday) : "-"} />

            <MatchInfo label="Season" value={match.season.name} />
          </section>
        )}
      </div>
    </main>
  );
};

const Team = ({
  id,
  name,
  shortName,
  crestUrl,
}: {
  id: number;
  name: string;
  shortName: string | null;
  crestUrl: string | null;
}) => {
  return (
    <Link href={`/teams/${id}`} className="group flex min-w-0 flex-col items-center text-center">
      {crestUrl ? (
        <div className="relative mb-4 h-20 w-20 sm:h-28 sm:w-28">
          <Image
            src={crestUrl}
            alt={`${name} crest`}
            fill
            sizes="(max-width: 640px) 80px, 112px"
            className="object-contain transition-transform group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800 text-xl font-bold sm:h-28 sm:w-28">
          {shortName?.slice(0, 1) ?? name.slice(0, 1)}
        </div>
      )}

      <h2 className="text-sm font-semibold group-hover:text-zinc-300 sm:text-xl">
        <span className="hidden sm:inline">{name}</span>

        <span className="sm:hidden">{shortName ?? name}</span>
      </h2>
    </Link>
  );
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="mt-4 inline-block rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-400">
      {status.replaceAll("_", " ")}
    </span>
  );
}

function MatchInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-center">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>

      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}

function formatOutcome(outcome: "HOME_WIN" | "AWAY_WIN" | "DRAW" | null) {
  switch (outcome) {
    case "HOME_WIN":
      return "Home win";

    case "AWAY_WIN":
      return "Away win";

    case "DRAW":
      return "Draw";

    default:
      return "—";
  }
}

export default MatchPage;
