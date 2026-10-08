"use client";

import Link from "next/link";

const ErrorPage = ({ reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-red-400">ERROR</p>

        <h1 className="mt-3 text-3xl font-bold">We couldn&apos;t load this page</h1>

        <p className="mt-4 text-zinc-400">
          Something unexpected happened while loading the football data.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <button
            className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-zinc-950"
            type="button"
            onClick={reset}
          >
            Try Again
          </button>

          <Link
            href="/dashboard"
            className="rounded-lg border border-zinc-700 px-5 py-3 text-sm font-semibold"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
