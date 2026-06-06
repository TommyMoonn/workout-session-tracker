import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";

function AppLayout() {
  return (
    <div className="app-shell">
      <SideNav />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
