const DashboardLoading = () => {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <div className="h-4 w-32 animate-pulse rounded bg-zinc-800" />
          <div className="mt-4 h-10 w-56 animate-pulse rounded bg-zinc-800" />
          <div className="mt-4 h-10 w-96 animate-pulse rounded bg-zinc-800" />
        </div>

        <div>
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900"
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default DashboardLoading;
