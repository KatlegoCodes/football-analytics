import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-[#E8E5DE] bg-white px-5 py-7 lg:flex">
      <Link href="/" className="mb-12 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#202631] text-sm font-bold text-white ">
          FA
        </div>

        <div>
          <p className="text-sm font-bold tracking-wide text-[#202631]">FOOTBALL</p>
          <p className="text-xs tracking-[0.18em] text-[#8B8B86]">ANALYTICS</p>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-8">
        <div>
          <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.18em] text-[#A09D95]">
            WORKSPACE
          </p>

          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg bg-[#F7F6F2] px-3 py-3 text-sm font-semibold text-[#A52A3A]"
          >
            <span className="text-base">◫</span>
            Overview
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#555B63] transition hover:bg-[#F7F6F2] hover:text-[#202631]"
          >
            <span className="text-base">◉</span>
            Premier League
          </Link>

          <Link
            href="/bundesliga"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#555B63] transition hover:bg-[#F7F6F2] hover:text-[#202631]"
          >
            <span className="text-base">◉</span>
            Bundesliga
          </Link>
        </div>
      </nav>

      <div className="border-t border-[#E8E5DE] pt-5">
        <p className="text-xs font-medium text-[#202631]">Football Intelligence</p>
        <p className="mt-1 text-xs text-[#A09D95]">Powered by data.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
