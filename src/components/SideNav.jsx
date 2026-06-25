import { NavLink } from "react-router-dom";
import { cx } from "../lib/cx";

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
    <aside className="sticky top-0 z-20 h-screen border-r border-[var(--oc-hairline)] bg-[var(--oc-canvas-deep)] p-4 text-[var(--oc-ink)] max-[1120px]:static max-[1120px]:h-auto max-[1120px]:border-b max-[1120px]:border-r-0 max-[1120px]:p-3">
      <div className="grid grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-3 border border-[var(--oc-hairline)] bg-[var(--oc-surface)] p-3 max-[760px]:grid-cols-[38px_minmax(0,1fr)_38px]">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-[4px] border border-[var(--oc-hairline-strong)] bg-[var(--oc-surface-soft)] text-base leading-none text-[var(--oc-ink)] transition-colors hover:border-[var(--oc-accent)] hover:bg-[var(--oc-accent-softer)] hover:text-[var(--oc-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-accent)] max-[760px]:h-[38px] max-[760px]:w-[38px]"
          aria-label="Open settings"
          title="Settings (Ctrl + ,)"
          onClick={onOpenSettings}
        >
          ⚙
        </button>
        <div className="min-w-0">
          <p className="truncate text-base font-bold leading-tight text-[var(--oc-ink)]">LiftLog Lite</p>
          <p className="mt-1 truncate text-xs font-normal leading-tight text-[var(--oc-muted)]">Local workout tracker</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-[4px] border border-[var(--oc-hairline)] bg-transparent text-xs font-bold leading-none text-[var(--oc-marker)] max-[760px]:h-[38px] max-[760px]:w-[38px]">[LL]</span>
      </div>

      <nav className="mt-4 grid gap-2 max-[1120px]:grid-cols-3 max-[760px]:grid-cols-1" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cx(
              "relative grid min-h-[58px] grid-cols-[44px_minmax(0,1fr)] items-center gap-2 border border-[var(--oc-hairline)] bg-transparent px-3 py-2 text-[var(--oc-body)] no-underline transition-colors hover:border-[var(--oc-hairline-strong)] hover:bg-[var(--oc-surface)] hover:text-[var(--oc-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-accent)] max-[1120px]:min-h-[54px]",
              isActive && "border-[var(--oc-accent)] bg-[var(--oc-accent-softer)] text-[var(--oc-ink)] before:absolute before:left-[-13px] before:font-bold before:text-[var(--oc-accent)] before:content-['>'] max-[1120px]:before:hidden hover:border-[var(--oc-accent)] hover:bg-[var(--oc-accent-softer)] hover:text-[var(--oc-ink)] [&_span:first-child]:border-[var(--oc-accent)] [&_span:first-child]:text-[var(--oc-accent)] [&_small]:text-[var(--oc-muted)]",
            )}
          >
            <span className="inline-flex h-8 w-11 min-w-11 shrink-0 items-center justify-center overflow-hidden rounded-[4px] border border-current text-xs font-medium leading-none tabular-nums whitespace-nowrap max-[1120px]:h-7">
              [{item.shortcut}]
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-sm font-bold leading-tight">{item.label}</strong>
              <small className="mt-1 block truncate text-xs leading-tight opacity-70 max-[760px]:hidden">{item.description}</small>
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default SideNav;
