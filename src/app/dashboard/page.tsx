import React from "react";

const Dashboard = () => {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-10">
          <p className="mb-2 text-sm font-medium text-zinc-500">FOOTBALL ANALYTICS</p>

          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Explore Football Data, Team Perfomance and Player Statistics
          </p>
        </header>

        <section>
          <h2 className="mb-4 text-xl font-semibold">League Overview</h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-400 ">Teams</p>
              <p className="mt-2 text-3xl font-bold">2</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-400">Matches</p>
              <p className="mt-2 text-3xl font-bold">1</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-400">Goals</p>
              <p className="mt-2 text-3xl font-bold">4</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
