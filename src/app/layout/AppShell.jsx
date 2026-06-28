import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SettingsPanel } from "../../components/settings";
import SideNav from "./SideNav";
import { useKeyboardShortcuts } from "@features/shortcuts";

const navigationShortcuts = [
  { id: "nav.timer", path: "/timer" },
  { id: "nav.history", path: "/history" },
  { id: "nav.exercises", path: "/exercises" },
];

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const shortcuts = useMemo(() => [
    ...navigationShortcuts.map((shortcut) => ({
      id: shortcut.id,
      disabled: isSettingsOpen || location.pathname === shortcut.path,
      handler: () => navigate(shortcut.path),
    })),
    {
      id: "nav.settings",
      allowInEditable: true,
      disabled: isSettingsOpen,
      handler: () => setIsSettingsOpen(true),
    },
    {
      id: "global.close",
      allowInEditable: true,
      disabled: !isSettingsOpen,
      handler: () => setIsSettingsOpen(false),
    },
  ], [isSettingsOpen, location.pathname, navigate]);

  useKeyboardShortcuts(shortcuts, {
    ignoreWhenBlockingLayerOpen: false,
  });

  return (
    <div className="grid min-h-screen grid-cols-[260px_minmax(0,1fr)] bg-[var(--oc-canvas)] max-[1120px]:grid-cols-1">
      <SideNav onOpenSettings={() => setIsSettingsOpen(true)} />
      <main className="min-w-0 px-8 pb-[72px] pt-8 max-[1120px]:px-4 max-[1120px]:pt-6 max-[760px]:px-3 max-[760px]:pb-[104px] max-[760px]:pt-4">
        <Outlet />
      </main>

      {isSettingsOpen && <SettingsPanel onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}

export default AppShell;
