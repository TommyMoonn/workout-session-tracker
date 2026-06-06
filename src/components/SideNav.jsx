import { NavLink } from "react-router-dom";

const navItems = [
  {
    label: "Session Timer",
    description: "Track the active workout.",
    path: "/timer",
  },
  {
    label: "History",
    description: "Review saved sessions and exports.",
    path: "/history",
  },
  {
    label: "Exercises",
    description: "Browse home-friendly movements.",
    path: "/exercises",
  },
];

function SideNav() {
  return (
    <aside className="sticky top-0 z-20 h-auto border-b-2 border-black bg-white shadow-[0_6px_0_#050505] lg:h-screen lg:border-b-0 lg:border-r-2 lg:shadow-[7px_0_0_#050505]">
      <div className="flex items-center gap-3 border-b-2 border-black px-5 py-5">
        <span className="grid h-10 w-10 place-items-center border-2 border-black bg-[#F97316] text-xs font-black uppercase tracking-[0.12em] text-white shadow-[3px_3px_0_#050505]">
          LL
        </span>
        <div>
          <p className="text-lg font-black tracking-[-0.04em]">LiftLog Lite</p>
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-neutral-600">Workout tracker</p>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:overflow-visible lg:p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => [
              "min-w-[220px] border-2 border-black px-4 py-3 text-left shadow-[3px_3px_0_#050505] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#050505] lg:min-w-0",
              isActive ? "bg-[#F97316] text-white" : "bg-[#FFF1E6] text-black",
            ].join(" ")}
          >
            <span className="block text-sm font-black uppercase tracking-[0.08em]">{item.label}</span>
            <small className="mt-1 block text-xs font-bold leading-snug opacity-80">{item.description}</small>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default SideNav;
