import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";

function AppLayout() {
  return (
    <div className="min-h-screen bg-[#F8F1E7] bg-[linear-gradient(90deg,rgba(124,45,18,0.07)_1px,transparent_1px),linear-gradient(180deg,rgba(124,45,18,0.07)_1px,transparent_1px)] bg-[size:28px_28px] text-[#050505]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1500px] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
        <SideNav />
        <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
