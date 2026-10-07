const TeamLoading = () => {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 animate-pulse rounded-full bg-zinc-800" />

          <div>
            <div className="h-4 w-32 animate-pulse rounded bg-zinc-800" />
            <div className="mt-4 h-10 w-64 animate-pulse rounded bg-zinc-800" />
            <div className="mt-3 h-4 w-24 animate-pulse rounded bg-zinc-800" />
          </div>
        </div>

        <div className="mt-10 h-32 animate-pulse rounded-xl bg-zinc-900" />

        <div className="mt-6 h-80 animate-pulse rounded-xl bg-zinc-900" />
      </div>
    </main>
  );
};

export default TeamLoading;
