import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";

function AppShell() {
  return (
    <div className="grid min-h-screen grid-cols-[260px_minmax(0,1fr)] bg-[var(--oc-canvas)] max-[1120px]:grid-cols-1">
      <SideNav />
      <main className="min-w-0 px-8 pb-[72px] pt-8 max-[1120px]:px-4 max-[1120px]:pt-6 max-[760px]:px-3 max-[760px]:pt-4">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;
