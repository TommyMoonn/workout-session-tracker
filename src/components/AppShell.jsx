import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";

function AppShell() {
  return (
    <div className="app-shell">
      <SideNav />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;
