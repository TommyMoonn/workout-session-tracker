import { NavLink } from "react-router-dom";
import { cx } from "@shared/lib";

const navItems = [
  {
    label: "Timer",
    shortcut: "1",
    description: "Active session",
    path: "/timer",
  },
  {
    label: "History",
    shortcut: "2",
    description: "Saved logs",
    path: "/history",
  },
  {
    label: "Exercises",
    shortcut: "3",
    description: "Library",
    path: "/exercises",
  },
];

function SideNav({ onOpenSettings }) {
  return (
    <>
      <aside className="sticky top-0 z-20 h-screen border-r border-[var(--oc-hairline)] bg-[var(--oc-canvas-deep)] p-4 text-[var(--oc-ink)] max-[1120px]:static max-[1120px]:h-auto max-[1120px]:border-b max-[1120px]:border-r-0 max-[1120px]:p-3 max-[760px]:hidden">
        <div className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-3 border border-[var(--oc-hairline)] bg-[var(--oc-surface)] p-3">
          <button
            type="button"
            className="oc-interactive grid h-10 w-10 place-items-center rounded-[4px] border border-[var(--oc-hairline-strong)] bg-[var(--oc-surface-soft)] text-base leading-none text-[var(--oc-ink)] hover:border-[var(--oc-accent)] hover:bg-[var(--oc-accent-softer)] hover:text-[var(--oc-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus)]"
            aria-label="Open settings"
            title="Settings (Ctrl + ,)"
            onClick={onOpenSettings}
          >
            ⚙
          </button>
          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-tight text-[var(--oc-ink)]">LiftLog Lite</p>
          </div>
        </div>

        <nav className="mt-4 grid gap-2 max-[1120px]:grid-cols-3" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cx(
                "oc-interactive relative grid min-h-[58px] grid-cols-[44px_minmax(0,1fr)] items-center gap-2 border border-[var(--oc-hairline)] bg-transparent px-3 py-2 text-[var(--oc-body)] no-underline hover:border-[var(--oc-hairline-strong)] hover:bg-[var(--oc-surface)] hover:text-[var(--oc-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus)] max-[1120px]:min-h-[54px]",
                isActive && "border-[var(--oc-accent)] bg-[var(--oc-accent-softer)] text-[var(--oc-ink)] before:absolute before:left-[-13px] before:font-bold before:text-[var(--oc-accent-text)] before:content-['>'] max-[1120px]:before:hidden hover:border-[var(--oc-accent)] hover:bg-[var(--oc-accent-softer)] hover:text-[var(--oc-ink)] [&_span:first-child]:border-[var(--oc-accent)] [&_span:first-child]:text-[var(--oc-accent-text)] [&_small]:text-[var(--oc-muted)]",
              )}
            >
              <span className="inline-flex h-8 w-11 min-w-11 shrink-0 items-center justify-center overflow-hidden rounded-[4px] border border-current text-xs font-medium leading-none tabular-nums whitespace-nowrap max-[1120px]:h-7">
                [{item.shortcut}]
              </span>
              <span className="min-w-0">
                <strong className="block truncate text-sm font-bold leading-tight">{item.label}</strong>
                <small className="mt-1 block truncate text-xs leading-tight opacity-70">{item.description}</small>
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 hidden border-t border-[var(--oc-hairline-strong)] bg-[var(--oc-canvas-deep)] px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 text-[var(--oc-ink)] max-[760px]:block" aria-label="Mobile navigation">
        <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cx(
              "oc-interactive grid min-h-[58px] place-items-center gap-1 rounded-[4px] border border-transparent px-1 py-2 text-center text-xs font-bold leading-tight text-[var(--oc-body)] no-underline hover:bg-[var(--oc-surface)] hover:text-[var(--oc-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--oc-focus)]",
              isActive && "border-[var(--oc-accent)] bg-[var(--oc-accent-softer)] text-[var(--oc-ink)]",
            )}
          >
            <span className="text-[11px] font-medium leading-none text-[var(--oc-muted)]">[{item.shortcut}]</span>
            <span className="max-w-full truncate">{item.label}</span>
          </NavLink>
        ))}
          <button
            type="button"
            className="oc-interactive grid min-h-[58px] place-items-center gap-1 rounded-[4px] border border-transparent px-1 py-2 text-center text-xs font-bold leading-tight text-[var(--oc-body)] hover:bg-[var(--oc-surface)] hover:text-[var(--oc-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--oc-focus)]"
            aria-label="Open settings"
            onClick={onOpenSettings}
          >
            <span className="text-base leading-none" aria-hidden="true">⚙</span>
            <span className="max-w-full truncate">Settings</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default SideNav;
