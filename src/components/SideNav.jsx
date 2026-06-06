import { NavLink } from "react-router-dom";

const navItems = [
  {
    label: "Session Timer",
    description: "Track workout time, sets, rests, and session notes.",
    path: "/timer",
  },
  {
    label: "Exercises",
    description: "Browse home-friendly movements.",
    path: "/exercises",
  },
];

function SideNav() {
  return (
    <aside className="side-nav" aria-label="Main navigation">
      <div className="side-brand">
        <span className="brand-mark">LL</span>
        <div>
          <p className="side-brand-title">LiftLog Lite</p>
          <p className="side-brand-subtitle">Workout tracker</p>
        </div>
      </div>

      <nav className="side-nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `side-nav-link${isActive ? " active" : ""}`}
          >
            <span>{item.label}</span>
            <small>{item.description}</small>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default SideNav;
