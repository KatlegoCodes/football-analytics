const DashboardLoading = () => {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mt-4 h-10 w-64" />
          <Skeleton className="mt-3 h-5 w-80" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-4 h-9 w-16" />
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <Skeleton className="h-7 w-40" />

          <div>
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

const Skeleton = ({ className }: { className: string }) => {
  return <div className={`animate-pulse rounded bg-zinc-800 ${className}`} />;
};

export default DashboardLoading;
