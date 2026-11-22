import Sidebar from "@/components/analytics/Sidebar";

type PlatformLayoutProps = {
  children: React.ReactNode;
};

const PlatformLayout = ({ children }: PlatformLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#F7F6F2]">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <div className="mx-auto min-h-screen w-full max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PlatformLayout;
