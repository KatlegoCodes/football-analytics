import Link from "next/link";

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-zinc-500">404</p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">Nothing here</h1>

        <p className="mt-4 text-zinc-400">
          The team, match or page you&apos;re looking for doesn&apos;t exist.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
