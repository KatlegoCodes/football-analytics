"use client";

const DashboardError = ({ reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-zinc-500">Football Analytics</p>

        <h1 className="mt-3 text-3xl font-bold">Couldn&apos;t load the dashboard</h1>

        <p className="mt-3 text-zinc-400">Something went wrong while loading the football data</p>

        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-white px-5 py-2.5 font-medium text-zinc-950"
        >
          Try Again
        </button>
      </div>
    </main>
  );
};

export default DashboardError;
