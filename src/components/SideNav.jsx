import { NavLink } from "react-router-dom";

const navItems = [
  {
    label: "Timer",
    description: "Active session and rest flow.",
    path: "/timer",
  },
  {
    label: "History",
    description: "Saved sessions and exports.",
    path: "/history",
  },
  {
    label: "Exercises",
    description: "Movement library.",
    path: "/exercises",
  },
];

function SideNavCharcoal() {
  return (
    <aside className="sticky top-0 z-20 border-b border-[#252525] bg-[#090909]/95 backdrop-blur lg:h-screen lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 border-b border-[#252525] px-5 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-md border border-[#333] bg-[#141414] font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#f3f3f3]">
          LL
        </span>
        <div className="min-w-0">
          <p className="font-serif text-lg font-bold leading-none tracking-[-0.02em] text-[#f5f5f5]">LiftLog Lite</p>
          <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b8b8b]">Workout tracker</p>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:overflow-visible lg:p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => [
              "min-w-[210px] rounded-lg border px-4 py-3 text-left transition duration-200 lg:min-w-0",
              isActive
                ? "border-[#3ecf8e]/55 bg-[#151515] text-white"
                : "border-[#2a2a2a] bg-[#111] text-[#d6d6d6] hover:border-[#444] hover:bg-[#161616] hover:text-white",
            ].join(" ")}
          >
            <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em]">{item.label}</span>
            <small className="mt-1.5 block text-sm font-semibold leading-snug text-[#9d9d9d]">{item.description}</small>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default SideNavCharcoal;
