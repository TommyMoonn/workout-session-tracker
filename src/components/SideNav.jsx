import { NavLink } from "react-router-dom";

const navItems = [
  {
    label: "Timer",
    shortcut: "01",
    description: "Active session",
    path: "/timer",
  },
  {
    label: "History",
    shortcut: "02",
    description: "Saved logs",
    path: "/history",
  },
  {
    label: "Exercises",
    shortcut: "03",
    description: "Library",
    path: "/exercises",
  },
];

function SideNav() {
  return (
    <aside className="side-nav">
      <div className="side-brand">
        <span className="side-brand-mark">LL</span>
        <div>
          <p className="side-brand-title">LiftLog Lite</p>
          <p className="side-brand-subtitle">Local workout tracker</p>
        </div>
      </div>

      <nav className="side-nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `side-nav-link${isActive ? " active" : ""}`}
          >
            <span className="side-nav-number">{item.shortcut}</span>
            <span className="side-nav-text">
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default SideNav;
