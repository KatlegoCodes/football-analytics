"use client";

const DashboardError = ({ reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-red-400">SOMETHING WENT WRONG</p>

        <h1 className="mt-3 text-3xl font-bold">Couldn&apos;t load the dashboard</h1>

        <p className="mt-4 text-zinc-400">
          The football data couldn&apos;t be loaded right now. You can try the request again.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </main>
  );
};

export default DashboardError;
