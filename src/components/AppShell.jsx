import { Outlet } from "react-router-dom";
import SideNavCharcoal from "./SideNav";

function AppShellCharcoal() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f5]">
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:54px_54px]" />
      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1420px] grid-cols-1 lg:grid-cols-[236px_minmax(0,1fr)]">
        <SideNavCharcoal />
        <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">
          <div className="animate-[pageIn_260ms_ease-out_both]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppShellCharcoal;
